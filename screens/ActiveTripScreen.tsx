
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { Svg, Defs, Pattern, Path, Rect } from 'react-native-svg';
import Text from '../components/IconText';
import { Screen } from '../types';
import { useConnectivity } from '../context/ConnectivityContext';
import { useTheme } from '../context/ThemeContext';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const COLLAPSED_HEIGHT = 280;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.75;

// مسار الرحلة الواقعي (متطابق مع تفاصيل الطلب)
const ROUTE_PATH = "M 75 25 C 70 25, 65 30, 60 30 L 50 30 C 45 30, 45 35, 45 40 L 45 55 C 45 60, 40 60, 35 60 L 25 60 C 20 60, 15 65, 15 75";
const MAP_URI = "https://lh3.googleusercontent.com/aida-public/AB6AXuDZNpZ0yW6Jk_mbrQsUXjdhchRAaGGzpZHCJ87D3z3wP6DzEOyyUys0ZwivDdnCIylYt6zuAvmTeB_uREnwHQDN3zOCL3vpy_2zazDbOtOmmUpayjOI2fU52sK4OMGHHhaTvsmKOt4J12TJI1UlvWRR3fEWuVToiGYwT_yuEoPB9_OmjVKPSZoiSzQ5202hdMTfzRqc0JeQnOPqqwwJb1OuKvC1qVxtZgaWhmyUrVNLxxnDOWJGTZ2fGg-NZ-JO-hLzOIU2YaJAPA";

interface ActiveTripScreenProps {
  onNavigate: (s: Screen) => void;
}

const OfflineMapFallback: React.FC<{ colors: any, cachedUri: string | null }> = ({ colors, cachedUri }) => (
  <View style={[styles.offlineMapContainer, { backgroundColor: colors.surfaceAlt }]}>
    {cachedUri ? (
      <Image source={{ uri: cachedUri }} style={[styles.mapImage, { opacity: 0.3, filter: 'grayscale(100%)' } as any]} />
    ) : (
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" style={{ opacity: 0.15 }}>
          <Defs>
            <Pattern id="grid" width={10} height={10} patternUnits="userSpaceOnUse">
              <Path d="M 10 0 L 0 0 0 10" fill="none" stroke={colors.text} strokeWidth={0.2} />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grid)" />
          <Rect x={10} y={10} width={15} height={15} rx={2} fill={colors.border} />
          <Rect x={40} y={15} width={20} height={10} rx={2} fill={colors.border} />
          <Rect x={70} y={40} width={15} height={25} rx={2} fill={colors.border} />
          <Rect x={20} y={50} width={10} height={15} rx={2} fill={colors.border} />
        </Svg>
      </View>
    )}
    
    <View style={[styles.offlineStatusPill, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
       <Text style={[styles.offlineStatusIcon, { color: colors.primary }]}>{cachedUri ? 'sd_storage' : 'cloud_off'}</Text>
       <Text style={[styles.offlineStatusText, { color: '#fff' }]}>
         {cachedUri ? 'عرض الخريطة المخزنة مؤقتاً' : 'وضع عدم الاتصال - الشبكة فقط'}
       </Text>
    </View>
  </View>
);

const ActiveTripScreen: React.FC<ActiveTripScreenProps> = ({ onNavigate }) => {
  const { isOnline } = useConnectivity();
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [cachedMapUri, setCachedMapUri] = useState<string | null>(null);
  const [isCaching, setIsCaching] = useState(false);
  
  const sheetHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cacheAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // محاكاة عملية التخزين المؤقت للخرائط عند العودة للإنترنت
    if (isOnline) {
      setIsCaching(true);
      Animated.timing(cacheAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
      
      const timer = setTimeout(() => {
        setCachedMapUri(MAP_URI);
        setIsCaching(false);
        Animated.timing(cacheAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const toggleSheet = () => {
    const toValue = isExpanded ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT;
    const toOpacity = isExpanded ? 0 : 0.5;
    
    Animated.parallel([
      Animated.spring(sheetHeight, {
        toValue,
        friction: 8,
        tension: 50,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: toOpacity,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* قسم الخريطة مع دعم الأوفلاين المطور */}
      <View style={styles.mapContainer}>
        {isOnline ? (
          <Image 
            source={{ uri: MAP_URI }}
            style={styles.mapImage}
          />
        ) : (
          <OfflineMapFallback colors={colors} cachedUri={cachedMapUri} />
        )}
        
        {/* رسم المسار (دائماً مرئي) */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute' }}>
            <Path
              d={ROUTE_PATH} 
              fill="none" 
              stroke={isOnline ? colors.primary : colors.subtext} 
              strokeWidth={2.5}
              strokeLinecap="round" 
              strokeDasharray="4,4" 
              opacity={isOnline ? 1 : 0.8}
            />
          </Svg>
        </View>

        {/* نقاط الرحلة على الخريطة */}
        <View style={[styles.miniWaypoint, { top: '25%', left: '75%', backgroundColor: colors.primary }]} />
        <View style={[styles.miniWaypoint, { top: '75%', left: '15%', backgroundColor: '#ef4444' }]} />

        {/* مؤشر جاري التخزين المؤقت */}
        {isCaching && (
          <Animated.View style={[styles.cachingPill, { backgroundColor: colors.surface, borderColor: colors.primary, opacity: cacheAnim }]}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.cachingText, { color: colors.text }]}>جاري حفظ الخريطة للمنطقة...</Text>
          </Animated.View>
        )}

        <View style={styles.mapControls}>
          <TouchableOpacity style={[styles.mapButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.mapButtonIcon, { color: colors.primary }]}>my_location</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.topInstruction, { backgroundColor: colors.surface, borderColor: colors.primarySoft }]}>
           <View style={[styles.directionIconBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.directionIcon}>turn_right</Text>
           </View>
           <View style={styles.instructionTextContainer}>
              <Text style={[styles.instructionTitle, { color: colors.text }]}>انعطف يميناً بعد 200 متر</Text>
              <Text style={[styles.instructionSub, { color: colors.subtext }]}>طريق الملك فهد الرئيسي</Text>
           </View>
        </View>
      </View>

      <Animated.View pointerEvents={isExpanded ? 'auto' : 'none'} style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={toggleSheet} />
      </Animated.View>

      <Animated.View style={[styles.bottomSheet, { height: sheetHeight, backgroundColor: colors.surface, borderColor: colors.border, borderTopWidth: 1 }]}>
        <TouchableOpacity activeOpacity={1} onPress={toggleSheet} style={styles.sheetHandleArea}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
        </TouchableOpacity>

        <ScrollView scrollEnabled={isExpanded} showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryTop}>
               <View style={styles.summaryTextCol}>
                  <Text style={[styles.summaryLabel, { color: colors.subtext }]}>الوجهة التالية</Text>
                  <Text style={[styles.summaryTitle, { color: colors.text }]}>مطعم البيك - استلام الطلب</Text>
               </View>
               <View style={[styles.priceTag, { backgroundColor: colors.primarySoft }]}>
                  <Text style={[styles.priceValue, { color: colors.primary }]}>45.00 ر.س</Text>
               </View>
            </View>
            
            <View style={styles.summaryStats}>
               <View style={styles.statItem}>
                  <Text style={[styles.statIcon, { color: colors.primary }]}>schedule</Text>
                  <Text style={[styles.statText, { color: colors.text }]}>12 دقيقة</Text>
               </View>
               <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
               <View style={styles.statItem}>
                  <Text style={[styles.statIcon, { color: colors.primary }]}>straighten</Text>
                  <Text style={[styles.statText, { color: colors.text }]}>3.4 كم</Text>
               </View>
               <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
               <View style={styles.statItem}>
                  <Text style={[styles.statIcon, { color: colors.primary }]}>tag</Text>
                  <Text style={[styles.statText, { color: colors.text }]}>#4829</Text>
               </View>
            </View>
          </View>

          <View style={[styles.expandedContent, { opacity: isExpanded ? 1 : 0.6 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>محطات الرحلة</Text>
            <View style={styles.timeline}>
               <View style={styles.timelineItem}>
                  <View style={styles.timelineSidebar}>
                     <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                     <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                  </View>
                  <View style={[styles.stopCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                     <View style={styles.stopHeader}>
                        <Text style={[styles.stopName, { color: colors.text }]}>مطعم البيك</Text>
                        <TouchableOpacity style={[styles.iconAction, { backgroundColor: colors.surface }]} onPress={() => onNavigate(Screen.CHAT)}>
                           <Text style={[styles.iconActionText, { color: colors.primary }]}>chat</Text>
                        </TouchableOpacity>
                     </View>
                     <Text style={[styles.stopAddress, { color: colors.subtext }]}>حي العليا - طريق الملك فهد</Text>
                     <View style={styles.stopStatusRow}>
                        <Text style={[styles.statusPill, { backgroundColor: colors.primarySoft, color: colors.primary }]}>جاهز للاستلام</Text>
                     </View>
                  </View>
               </View>
               <View style={styles.timelineItem}>
                  <View style={styles.timelineSidebar}><View style={[styles.timelineDot, { backgroundColor: '#ef4444' }]} /></View>
                  <View style={[styles.stopCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                     <View style={styles.stopHeader}>
                        <Text style={[styles.stopName, { color: colors.text }]}>منزل العميل (محمد)</Text>
                        <TouchableOpacity style={[styles.iconAction, { backgroundColor: colors.surface }]}><Text style={[styles.iconActionText, { color: '#ef4444' }]}>call</Text></TouchableOpacity>
                     </View>
                     <Text style={[styles.stopAddress, { color: colors.subtext }]}>حي النخيل - شارع التخصصي</Text>
                  </View>
               </View>
            </View>
            <View style={[styles.orderItemsPreview, { backgroundColor: colors.background, borderColor: colors.border }]}>
               <Text style={[styles.previewTitle, { color: colors.text }]}>تفاصيل الأصناف</Text>
               <Text style={[styles.previewText, { color: colors.subtext }]}>٢ وجبة عائلية، ١ كوكاكولا لتر، ١ بطاطس كبير</Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.sheetFooter, { borderTopColor: colors.border }]}>
           <TouchableOpacity style={[styles.primaryAction, { backgroundColor: colors.primary }]} onPress={() => onNavigate(Screen.DASHBOARD)}>
              <Text style={styles.primaryActionText}>تأكيد الوصول للموقع</Text>
              <Text style={styles.primaryActionIcon}>check_circle</Text>
           </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 1, position: 'relative' },
  mapImage: { width: '100%', height: '100%', opacity: 0.6 },
  offlineMapContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  offlineStatusPill: { position: 'absolute', bottom: 300, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  offlineStatusIcon: { fontFamily: 'Material Icons Round', fontSize: 16 },
  offlineStatusText: { fontSize: 12, fontWeight: 'bold', fontFamily: 'Cairo' },
  miniWaypoint: { position: 'absolute', width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: '#fff', zIndex: 10 },
  mapControls: { position: 'absolute', top: 120, right: 20, gap: 10 },
  mapButton: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  mapButtonIcon: { fontFamily: 'Material Icons Round', fontSize: 24 },
  topInstruction: { position: 'absolute', top: 50, left: 20, right: 20, padding: 15, borderRadius: 20, borderWidth: 1, flexDirection: 'row-reverse', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  directionIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  directionIcon: { fontFamily: 'Material Icons Round', fontSize: 28, color: '#112117' },
  instructionTextContainer: { flex: 1, alignItems: 'flex-end' },
  instructionTitle: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Cairo' },
  instructionSub: { fontSize: 12, fontFamily: 'Cairo', marginTop: 2 },
  cachingPill: { position: 'absolute', top: 125, alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, flexDirection: 'row-reverse', alignItems: 'center', gap: 8, zIndex: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cachingText: { fontSize: 11, fontWeight: 'bold', fontFamily: 'Cairo' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000', zIndex: 10 },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 32, borderTopRightRadius: 32, zIndex: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 25 },
  sheetHandleArea: { width: '100%', height: 30, justifyContent: 'center', alignItems: 'center' },
  sheetHandle: { width: 40, height: 4, borderRadius: 2 },
  sheetContent: { paddingHorizontal: 25, paddingBottom: 120 },
  summaryContainer: { marginBottom: 25 },
  summaryTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  summaryTextCol: { alignItems: 'flex-end', flex: 1 },
  summaryLabel: { fontSize: 11, fontWeight: 'bold', fontFamily: 'Cairo', marginBottom: 4 },
  summaryTitle: { fontSize: 18, fontWeight: '900', fontFamily: 'Cairo' },
  priceTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  priceValue: { fontSize: 16, fontWeight: '900' },
  summaryStats: { flexDirection: 'row-reverse', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  statIcon: { fontFamily: 'Material Icons Round', fontSize: 16 },
  statText: { fontSize: 12, fontWeight: 'bold', fontFamily: 'Cairo' },
  statDivider: { width: 1, height: 16 },
  expandedContent: { marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Cairo', textAlign: 'right', marginBottom: 15 },
  timeline: { marginBottom: 20 },
  timelineItem: { flexDirection: 'row-reverse', marginBottom: 15 },
  timelineSidebar: { width: 30, alignItems: 'center', marginLeft: 10 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 12, zIndex: 1 },
  timelineLine: { width: 2, flex: 1, marginTop: -5, marginBottom: -15 },
  stopCard: { flex: 1, padding: 16, borderRadius: 20, borderWidth: 1 },
  stopHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  stopName: { fontSize: 15, fontWeight: 'bold', fontFamily: 'Cairo' },
  iconAction: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  iconActionText: { fontFamily: 'Material Icons Round', fontSize: 18 },
  stopAddress: { fontSize: 12, fontFamily: 'Cairo', textAlign: 'right' },
  stopStatusRow: { flexDirection: 'row-reverse', marginTop: 10 },
  statusPill: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  orderItemsPreview: { padding: 15, borderRadius: 16, borderWidth: 1, marginTop: 10 },
  previewTitle: { fontSize: 13, fontWeight: 'bold', fontFamily: 'Cairo', textAlign: 'right', marginBottom: 4 },
  previewText: { fontSize: 11, fontFamily: 'Cairo', textAlign: 'right', lineHeight: 18 },
  sheetFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 25, borderTopWidth: 1 },
  primaryAction: { height: 60, borderRadius: 18, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 12 },
  primaryActionText: { color: '#112117', fontSize: 16, fontWeight: '900', fontFamily: 'Cairo' },
  primaryActionIcon: { fontFamily: 'Material Icons Round', fontSize: 24, color: '#112117' }
});

export default ActiveTripScreen;

