
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { Screen, Message } from '../types';

interface ChatScreenProps {
  onNavigate: (s: Screen) => void;
}

const mockMessages: Message[] = [
  { id: '1', sender: 'customer', text: 'مرحباً كابتن 👋، هل اقتربت من المطعم؟', timestamp: '١٠:٣٢ ص' },
  { id: '2', sender: 'driver', text: 'أهلاً بك يا محمد. نعم، أنا على بعد ٥ دقائق تقريباً من الموقع.', timestamp: '١٠:٣٣ ص' },
  { id: '3', sender: 'customer', text: 'ممتاز، يرجى الاتصال بي عند الوصول لأن الجرس لا يعمل.', timestamp: '١٠:٣٤ ص' }
];

const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate }) => {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => onNavigate(Screen.ACTIVE_TRIP)} style={styles.backButton}>
            <Text style={styles.backIcon}>arrow_back_ios</Text>
          </TouchableOpacity>
          <View style={styles.userBadge}>
            <Image 
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAclAsXp-vLrN0wP1X-F-CP7-8DUMRpJNGoWrQvdYvKGzBjr4QGCx0ifTNgVqepw3fB15zdy3cTts3Q3gkAfA4j1rhFqGKlTJsEX0Pk8PeVUzZZu0beA9AAzef-hxJ-_eZUWS7NpZAvm9t3ZWojbAcarGq9kYFSMROAILKlduPivWu_qr7OBSrh0dkRclQ6LMgP7xvb3r3XjTiIfy5spTuwIDxgz3Pcmw0HiYRMUE4FGCd3OncJDfk8XyV72fBOLou96PS54Y2lGw" }}
              style={styles.avatar}
            />
            <View style={styles.onlineStatus} />
          </View>
          <View>
            <Text style={styles.userName}>محمد أحمد</Text>
            <Text style={styles.statusText}>متصل الآن</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton}><Text style={styles.callIcon}>call</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.chatContent}>
        <View style={styles.dateBadge}><Text style={styles.dateText}>اليوم، ١٠:٣٠ صباحاً</Text></View>
        
        {mockMessages.map((msg) => (
          <View key={msg.id} style={[styles.messageWrapper, msg.sender === 'driver' ? styles.driverWrapper : styles.customerWrapper]}>
            <View style={[styles.bubble, msg.sender === 'driver' ? styles.driverBubble : styles.customerBubble]}>
              <Text style={[styles.bubbleText, msg.sender === 'driver' ? styles.driverText : styles.customerText]}>{msg.text}</Text>
            </View>
            <View style={styles.msgMeta}>
               <Text style={styles.msgTime}>{msg.timestamp}</Text>
               {msg.sender === 'driver' && <Text style={styles.readDot}> • تم التسليم</Text>}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickReplies}>
          <TouchableOpacity style={styles.replyPill}><Text style={styles.replyText}>أنا في الطريق</Text></TouchableOpacity>
          <TouchableOpacity style={styles.replyPill}><Text style={styles.replyText}>وصلت للموقع</Text></TouchableOpacity>
          <TouchableOpacity style={styles.replyPill}><Text style={styles.replyText}>شكراً لك</Text></TouchableOpacity>
        </ScrollView>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}><Text style={styles.attachIcon}>attach_file</Text></TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              placeholder="اكتب رسالة..."
              placeholderTextColor="#555"
              multiline
            />
            <Text style={styles.camIcon}>camera_alt</Text>
          </View>
          <TouchableOpacity style={styles.micButton}><Text style={styles.micIcon}>mic</Text></TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#112117' },
  header: { paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#1a2e22', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#222' },
  headerRight: { flexDirection: 'row-reverse', alignItems: 'center' },
  backButton: { marginLeft: 10 },
  backIcon: { fontFamily: 'Material Icons Round', fontSize: 18, color: '#555', transform: [{ rotate: '180deg' }] },
  userBadge: { position: 'relative', marginLeft: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  onlineStatus: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#19e66b', borderWidth: 2, borderColor: '#1a2e22' },
  userName: { fontSize: 14, fontWeight: 'bold', color: '#fff', textAlign: 'right' },
  statusText: { fontSize: 10, color: '#19e66b', textAlign: 'right' },
  callButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(25,230,107,0.1)', justifyContent: 'center', alignItems: 'center' },
  callIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#19e66b' },
  chatContent: { padding: 20, paddingBottom: 100 },
  dateBadge: { alignSelf: 'center', backgroundColor: '#1a2e22', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15, marginBottom: 25, borderWidth: 1, borderColor: '#333' },
  dateText: { fontSize: 10, color: '#555', fontWeight: 'bold' },
  messageWrapper: { marginBottom: 20, maxWidth: '85%' },
  driverWrapper: { alignSelf: 'flex-start' },
  customerWrapper: { alignSelf: 'flex-end' },
  bubble: { padding: 15, borderRadius: 20 },
  driverBubble: { backgroundColor: '#19e66b', borderTopLeftRadius: 5 },
  customerBubble: { backgroundColor: '#1a2e22', borderTopRightRadius: 5, borderWidth: 1, borderColor: '#333' },
  bubbleText: { fontSize: 14, lineHeight: 22 },
  driverText: { color: '#112117', fontWeight: '500' },
  customerText: { color: '#fff', textAlign: 'right' },
  msgMeta: { flexDirection: 'row-reverse', marginTop: 4 },
  msgTime: { fontSize: 9, color: '#555', fontWeight: 'bold' },
  readDot: { fontSize: 9, color: '#555', fontWeight: 'bold' },
  footer: { padding: 15, backgroundColor: 'rgba(26,46,34,0.95)', borderTopWidth: 1, borderTopColor: '#222', paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  quickReplies: { flexDirection: 'row-reverse', marginBottom: 15 },
  replyPill: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 15, marginLeft: 10, borderWidth: 1, borderColor: '#333' },
  replyText: { fontSize: 11, color: '#888', fontWeight: 'bold' },
  inputRow: { flexDirection: 'row-reverse', alignItems: 'flex-end', gap: 10 },
  attachButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  attachIcon: { fontFamily: 'Material Icons Round', fontSize: 22, color: '#555', transform: [{ rotate: '45deg' }] },
  inputContainer: { flex: 1, backgroundColor: '#112117', borderRadius: 20, borderWidth: 1, borderColor: '#222', paddingHorizontal: 15, paddingVertical: 10, flexDirection: 'row-reverse', alignItems: 'center' },
  input: { flex: 1, fontSize: 14, color: '#fff', textAlign: 'right', maxHeight: 80 },
  camIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#333' },
  micButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#19e66b', justifyContent: 'center', alignItems: 'center', shadowColor: '#19e66b', shadowOpacity: 0.3, shadowRadius: 5 },
  micIcon: { fontFamily: 'Material Icons Round', fontSize: 24, color: '#112117' }
});

export default ChatScreen;
