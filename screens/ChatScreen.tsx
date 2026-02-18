
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Platform, KeyboardAvoidingView, ActivityIndicator, Animated, Easing } from 'react-native';
import Text from '../components/IconText';
import { Screen, Message } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { useConnectivity } from '../context/ConnectivityContext';
import { useTheme } from '../context/ThemeContext';
import { useWebSocket } from '../context/WebSocketContext';
import { StorageService } from '../services/StorageService';

interface ChatScreenProps {
  onNavigate: (s: Screen) => void;
}

const CHAT_STORAGE_KEY = 'captain_chat_history';

const INITIAL_MESSAGES: Message[] = [
  { id: '1', sender: 'customer', text: 'مرحباً كابتن 👋، هل اقتربت من المطعم؟', timestamp: '١٠:٣٢ ص', status: 'read' },
  { id: '2', sender: 'driver', text: 'أهلاً بك يا محمد. نعم، أنا على بعد ٥ دقائق تقريباً من الموقع.', timestamp: '١٠:٣٣ ص', status: 'read' },
  { id: '3', sender: 'customer', text: 'ممتاز، يرجى الاتصال بي عند الوصول لأن الجرس لا يعمل.', timestamp: '١٠:٣٤ ص', status: 'read' }
];

// مكون فرعي لعرض حالة الرسالة مع تأثير حركي للأيقونة
const AnimatedStatus: React.FC<{ status?: Message['status'], colors: any }> = ({ status, colors }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const lastStatus = useRef(status);

  useEffect(() => {
    if (status === 'read' && lastStatus.current !== 'read') {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.5, duration: 150, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }),
      ]).start();
    }
    lastStatus.current = status;
  }, [status]);

  if (!status) return null;

  const getStatusIcon = (s?: string) => {
    switch (s) {
      case 'sending': return 'schedule';
      case 'sent': return 'done';
      case 'delivered': return 'done_all';
      case 'read': return 'done_all';
      default: return null;
    }
  };

  const getStatusColor = (s?: string) => {
    if (s === 'read') return colors.primary;
    return colors.subtext;
  };

  return (
    <Animated.Text 
      style={[
        styles.statusIcon, 
        { color: getStatusColor(status), transform: [{ scale }] }
      ]}
    >
      {getStatusIcon(status)}
    </Animated.Text>
  );
};

// مكون عنصر الرسالة مع تأثير حركي للفقاعة نفسها
const ChatMessageItem: React.FC<{ msg: Message, colors: any }> = ({ msg, colors }) => {
  const bubbleScale = useRef(new Animated.Value(1)).current;
  const lastStatus = useRef(msg.status);

  useEffect(() => {
    // تشغيل التأثير عند تحول الحالة إلى 'read' فقط (لرسائل السائق)
    if (msg.sender === 'driver' && msg.status === 'read' && lastStatus.current !== 'read') {
      Animated.sequence([
        Animated.timing(bubbleScale, { toValue: 1.05, duration: 150, useNativeDriver: true }),
        Animated.spring(bubbleScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
      ]).start();
    }
    lastStatus.current = msg.status;
  }, [msg.status]);

  return (
    <View style={[styles.messageWrapper, msg.sender === 'driver' ? styles.driverWrapper : styles.customerWrapper]}>
      <Animated.View style={[
        styles.bubble, 
        msg.sender === 'driver' ? [styles.driverBubble, { backgroundColor: colors.primary }] : [styles.customerBubble, { backgroundColor: colors.surface, borderColor: colors.border }],
        { transform: [{ scale: bubbleScale }] }
      ]}>
        <Text style={[styles.bubbleText, msg.sender === 'driver' ? styles.driverText : { color: colors.text }]}>{msg.text}</Text>
      </Animated.View>
      <View style={styles.msgMeta}>
         <Text style={styles.msgTime}>{msg.timestamp}</Text>
         {msg.sender === 'driver' && (
           <AnimatedStatus status={msg.status} colors={colors} />
         )}
      </View>
    </View>
  );
};

// Helper functions for audio encoding/decoding
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): any {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate }) => {
  const { isOnline } = useConnectivity();
  const { socket } = useWebSocket();
  const { colors } = useTheme();
  
  // تحميل الرسائل من التخزين المحلي بطريقة متوافقة بين الويب و RN.
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const [messageText, setMessageText] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadMessages = async () => {
      const saved = await StorageService.getItem(CHAT_STORAGE_KEY);
      if (!mounted || !saved) return;

      try {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      } catch {
        // Ignore malformed persisted data and keep defaults.
      }
    };

    loadMessages();

    return () => {
      mounted = false;
    };
  }, []);

  // حفظ الرسائل في التخزين عند كل تغيير
  useEffect(() => {
    StorageService.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Typing animation dots
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCustomerTyping) {
      const animate = (v: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(v, { toValue: -5, duration: 400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
            Animated.timing(v, { toValue: 0, duration: 400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          ])
        );
      };
      const a1 = animate(dot1, 0);
      const a2 = animate(dot2, 200);
      const a3 = animate(dot3, 400);
      a1.start(); a2.start(); a3.start();
      return () => { a1.stop(); a2.stop(); a3.stop(); };
    }
  }, [isCustomerTyping]);

  useEffect(() => {
    const handleIncomingMessage = (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      scrollToBottom();
    };

    const handleReadReceipt = (data: { messageId: string, status: Message['status'] }) => {
      setMessages(prev => prev.map(m => m.id === data.messageId ? { ...m, status: data.status } : m));
    };

    const handleTypingStatus = (data: { isTyping: boolean }) => {
      setIsCustomerTyping(data.isTyping);
      if (data.isTyping) scrollToBottom();
    };

    const offMsg = socket.on('chat_message', handleIncomingMessage);
    const offReceipt = socket.on('read_receipt', handleReadReceipt);
    const offTyping = socket.on('typing_status', handleTypingStatus);

    return () => {
      offMsg();
      offReceipt();
      offTyping();
    };
  }, [socket]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: `driver_${Date.now()}`,
      sender: 'driver',
      text: messageText,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      status: isOnline ? 'sent' : 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    scrollToBottom();

    socket.send('chat_message', newMessage);
  };

  const stopDictation = async () => {
    setIsDictating(false);
    if (sessionRef.current) sessionRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const startDictation = async () => {
    if (!isOnline) {
      alert("خاصية الإملاء الصوتي تتطلب اتصالاً بالإنترنت.");
      return;
    }

    if (
      Platform.OS !== 'web' ||
      typeof window === 'undefined' ||
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      alert("الإملاء الصوتي متاح حالياً على الويب فقط.");
      return;
    }

    try {
      setIsConnecting(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextCtor) {
        throw new Error('AudioContext is unavailable');
      }
      const audioContext = new AudioContextCtor({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsDictating(true);
            const source = audioContext.createMediaStreamSource(stream);
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              if (text) setMessageText(prev => prev + text);
            }
          },
          onerror: () => { setIsConnecting(false); stopDictation(); },
          onclose: () => stopDictation()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: 'You are a dictation assistant. Transcribe the user speech accurately in Arabic.',
        }
      });
      sessionRef.current = sessionPromise;
    } catch (error) {
      setIsConnecting(false);
      alert("فشل بدء الإملاء الصوتي.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => onNavigate(Screen.ACTIVE_TRIP)} style={styles.backButton}>
            <Text style={styles.backIcon}>arrow_back_ios</Text>
          </TouchableOpacity>
          <View style={styles.userBadge}>
            <Image source={{ uri: "https://lh3.googleusercontent.com/aclAsXp-vLrN0wP1X-F-CP7-8DUMRpJNGoWrQvdYvKGzBjr4QGCx0ifTNgVqepw3fB15zdy3cTts3Q3gkAfA4j1rhFqGKlTJsEX0Pk8PeVUzZZu0beA9AAzef-hxJ-_eZUWS7NpZAvm9t3ZWojbAcarGq9kYFSMROAILKlduPivWu_qr7OBSrh0dkRclQ6LMgP7xvb3r3XjTiIfy5spTuwIDxgz3Pcmw0HiYRMUE4FGCd3OncJDfk8XyV72fBOLou96PS54Y2lGw" }} style={styles.avatar} />
            <View style={[styles.onlineStatus, { backgroundColor: isOnline ? colors.primary : '#6b7280' }]} />
          </View>
          <View>
            <Text style={styles.userName}>محمد أحمد</Text>
            <Text style={[styles.statusText, { color: isOnline ? colors.primary : '#6b7280' }]}>
              {isOnline ? (isCustomerTyping ? 'يكتب الآن...' : 'متصل الآن') : 'غير متصل'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton} disabled={!isOnline}>
          <Text style={[styles.callIcon, !isOnline && { opacity: 0.3 }]}>call</Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.chatContent} onContentSizeChange={scrollToBottom}>
        <View style={styles.dateBadge}><Text style={styles.dateText}>اليوم، ١٠:٣٠ صباحاً</Text></View>
        
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} msg={msg} colors={colors} />
        ))}

        {isCustomerTyping && (
          <View style={[styles.messageWrapper, styles.customerWrapper]}>
            <View style={[styles.typingBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
               <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot1 }], backgroundColor: colors.subtext }]} />
               <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot2 }], backgroundColor: colors.subtext }]} />
               <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot3 }], backgroundColor: colors.subtext }]} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}><Text style={[styles.attachIcon, { color: colors.subtext }]}>attach_file</Text></TouchableOpacity>
          <View style={[styles.inputContainer, isDictating && { borderColor: colors.primary, backgroundColor: colors.primarySoft }, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TextInput 
              style={[styles.input, { color: colors.text }]}
              placeholder={isDictating ? "جاري الاستماع..." : "اكتب رسالة..."}
              placeholderTextColor={isDictating ? colors.primary : colors.subtext}
              multiline
              value={messageText}
              onChangeText={(t) => {
                setMessageText(t);
                socket.send('typing_status', { isTyping: t.length > 0 });
              }}
              onSubmitEditing={handleSendMessage}
            />
          </View>
          {messageText.trim() ? (
            <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={handleSendMessage}>
               <Text style={styles.sendIcon}>send</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.micButton, isDictating && styles.micButtonActive, (!isOnline && !isDictating) && { backgroundColor: colors.border }, { backgroundColor: colors.primary }]} 
              onPress={() => isDictating ? stopDictation() : startDictation()}
              disabled={isConnecting}
            >
              {isConnecting ? <ActivityIndicator size="small" color="#112117" /> : <Text style={[styles.micIcon, isDictating && styles.micIconActive]}>{isDictating ? 'stop' : 'mic'}</Text>}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1a12' },
  header: { paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#1a2e22', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#222' },
  headerRight: { flexDirection: 'row-reverse', alignItems: 'center' },
  backButton: { marginLeft: 10 },
  backIcon: { fontFamily: 'Material Icons Round', fontSize: 18, color: '#555', transform: [{ rotate: '180deg' }] },
  userBadge: { position: 'relative', marginLeft: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  onlineStatus: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: '#1a2e22' },
  userName: { fontSize: 14, fontWeight: 'bold', color: '#fff', textAlign: 'right', fontFamily: 'Cairo' },
  statusText: { fontSize: 10, textAlign: 'right', fontFamily: 'Cairo' },
  callButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(25,230,107,0.1)', justifyContent: 'center', alignItems: 'center' },
  callIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#19e66b' },
  chatContent: { padding: 20, paddingBottom: 100 },
  dateBadge: { alignSelf: 'center', backgroundColor: '#1a2e22', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15, marginBottom: 25, borderWidth: 1, borderColor: '#333' },
  dateText: { fontSize: 10, color: '#555', fontWeight: 'bold', fontFamily: 'Cairo' },
  messageWrapper: { marginBottom: 20, maxWidth: '85%' },
  driverWrapper: { alignSelf: 'flex-start' },
  customerWrapper: { alignSelf: 'flex-end' },
  bubble: { padding: 12, paddingHorizontal: 16, borderRadius: 20 },
  driverBubble: { borderTopLeftRadius: 5 },
  customerBubble: { borderTopRightRadius: 5, borderWidth: 1 },
  bubbleText: { fontSize: 14, lineHeight: 22, fontFamily: 'Cairo' },
  driverText: { color: '#112117', fontWeight: '500' },
  msgMeta: { flexDirection: 'row-reverse', marginTop: 4, alignItems: 'center' },
  msgTime: { fontSize: 9, color: '#555', fontWeight: 'bold' },
  statusIcon: { fontFamily: 'Material Icons Round', fontSize: 14, marginLeft: 4 },
  typingBubble: { padding: 15, paddingHorizontal: 20, borderRadius: 20, borderTopRightRadius: 5, borderWidth: 1, flexDirection: 'row', gap: 5 },
  typingDot: { width: 6, height: 6, borderRadius: 3 },
  footer: { padding: 15, borderTopWidth: 1, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  inputRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  attachButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  attachIcon: { fontFamily: 'Material Icons Round', fontSize: 22, transform: [{ rotate: '45deg' }] },
  inputContainer: { flex: 1, borderRadius: 20, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 10, flexDirection: 'row-reverse', alignItems: 'center' },
  input: { flex: 1, fontSize: 14, textAlign: 'right', maxHeight: 80, fontFamily: 'Cairo' },
  micButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  micButtonActive: { backgroundColor: '#ef4444' },
  micIcon: { fontFamily: 'Material Icons Round', fontSize: 24, color: '#112117' },
  micIconActive: { color: '#fff' },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { fontFamily: 'Material Icons Round', fontSize: 24, color: '#112117', transform: [{ rotate: '180deg' }] },
});

export default ChatScreen;

