import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Animated, Easing, ActivityIndicator } from 'react-native';
import { Screen } from '../types';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const ROUTE_PATH = "M 75 25 C 70 25, 65 30, 60 30 L 50 30 C 45 30, 45 35, 45 40 L 45 55 C 45 60, 40 60, 35 60 L 25 60 C 20 60, 15 75";

const AnimatedPath = Animated.createAnimatedComponent('path' as any);

interface OrderDetailsScreenProps {
  onNavigate: (s: Screen) => void;
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ onNavigate }) => {
  const { colors } = useTheme();
  const [isStarting, setIsStarting] = useState(false);
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  
  const routeAnim = useRef(new Animated.Value(0)).current;
  const flowAnim = useRef(new Animated.Value(0)).current;
  const pickupScale = useRef(new Animated.Value(1)).current;
  const deliveryScale = useRef(new Animated.Value(0)).current;
  const deliveryOpacity = useRef(new Animated.Value(0)).current;
  const buttonWidth = useRef(new Animated.Value(width - 50)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  // Pulse animations
  const pickupPulseScale = useRef(new Animated.Value(1)).current;
  const pickupPulseOpacity = useRef(new Animated.Value(0.6)).current;
  const deliveryPulseScale = useRef(new Animated.Value(1)).current;
  const deliveryPulseOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }

    // Start pickup pulse immediately
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pickupPulseScale, { toValue: 2.2, duration: 1500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(pickupPulseOpacity, { toValue: 0, duration: 1500, useNativeDriver: true })
        ]),
        Animated.parallel([
          Animated.timing(pickupPulseScale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(pickupPulseOpacity, { toValue: 0.6, duration: 0, useNativeDriver: true })
        ])
      ])
    ).start();
  }, []);

  const startTripAnimation = () => {
    setIsStarting(true);
    
    Animated.timing(buttonWidth, {
      toValue: 64,
      duration: 400,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();

    routeAnim.setValue(0);
    deliveryOpacity.setValue(0);
    deliveryScale.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(routeAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pickupScale, { toValue: 1.2, duration: 450, useNativeDriver: true }),
            Animated.timing(pickupScale, { toValue: 1, duration: 450, useNativeDriver: true }),
          ]),
          { iterations: 2 }
        )
      ]),
      Animated.parallel([
        Animated.timing(deliveryOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(deliveryScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Start flow animation
      Animated.loop(
        Animated.timing(flowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false
        })
      ).start();

      // Start delivery pulse
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(deliveryPulseScale, { toValue: 2.2, duration: 1500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(deliveryPulseOpacity, { toValue: 0, duration: 1500, useNativeDriver: true })
          ]),
          Animated.parallel([
            Animated.timing(deliveryPulseScale, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(deliveryPulseOpacity, { toValue: 0.6, duration: 0, useNativeDriver: true })
          ])
        ])
      ).start();

      setTimeout(() => {
        onNavigate(Screen.ACTIVE_TRIP);
      }, 1200);
    });
  };

  const dashOffset = routeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [pathLength || 1000, 0], 
  });

  const flowOffset = flowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20]
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.mapContainer}>
        {/* Cast style to any to fix ImageStyle union errors */}
        <Image 
          source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZNpZ0yW6Jk_mbrQsUXjdhchRAaGGzpZHCJ87D3z3wP6DzEOyyUys0ZwivDdnCIylYt6zuAvmTeB_uREnwHQDN3zOCL3vpy_2zazDbOtOmmUpayjOI2fU52sK4OMGHHhaTvsmKOt4J12TJI1UlvWRR3fEWuVToiGYwT_yuEoPB9_OmjVKPSZoiSzQ5202hdMTfzRqc0JeQnOPqqwwJb1OuKvC1qVxtZgaWhmyUrVNLxxnDOWJGTZ2fGg-NZ-JO-hLzOIU2YaJAPA" }}
          style={styles.mapImage as any}
        />
        <View style={styles.mapOverlay} />
        
        <View style={styles.headerRow}>
           <TouchableOpacity onPress={() => onNavigate(Screen.ORDERS)} style={[styles.backBtn, { backgroundColor: 'rgba(26,46,34,0.8)' }]}>
              <Text style={styles.backIcon}>arrow_forward</Text>
           </TouchableOpacity>
           <View style={[styles.timePill, { backgroundColor: 'rgba(26,46,34,0.8)' }]}>
              <Text style={styles.timePillText}>وصول متوقع: ١٢ د</Text>
           </View>
        </View>

        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colors.primary} />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <path 
              d={ROUTE_PATH} 
              fill="none" 
              stroke="rgba(0,0,0,0.1)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <AnimatedPath
              ref={pathRef}
              d={ROUTE_PATH}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray={isStarting ? [10, 5] : pathLength}
              style={{ 
                strokeDashoffset: isStarting && flowAnim ? Animated.add(dashOffset as any, flowOffset as any) : dashOffset as any 
              }}
            />
          </svg>
        </View>

        {/* Pickup Pulse */}
        <Animated.View style={[styles.waypointPulse, { top: '25%', left: '75%', backgroundColor: colors.primary, opacity: pickupPulseOpacity, transform: [{ scale: pickupPulseScale }] }]} />
        <Animated.View style={[styles.waypoint, { top: '25%', left: '75%', transform: [{ scale: pickupScale }] }]}>
           <View style={[styles.waypointCircle, { backgroundColor: colors.primary }]}>
             <Text style={styles.waypointText}>1</Text>
           </View>
           <View style={styles.waypointLabel}>
             <Text style={styles.waypointLabelText}>المطعم</Text>
           </View>
        </Animated.View>

        {/* Delivery Pulse - Added as any to fix incorrect overload matching */}
        <Animated.View style={[
          styles.waypointPulse, 
          { 
            top: '75%', 
            left: '15%', 
            backgroundColor: '#ef4444', 
            opacity: Animated.multiply(deliveryOpacity, deliveryPulseOpacity), 
            transform: [{ scale: deliveryPulseScale }] 
          }
        ] as any} />
        <Animated.View style={[
          styles.waypoint, 
          { 
            top: '75%', 
            left: '15%', 
            opacity: deliveryOpacity, 
            transform: [{ scale: deliveryScale }] 
          }
        ]}>
           <View style={[styles.waypointCircle, { backgroundColor: '#ef4444' }]}>
             <Text style={styles.waypointText}>2</Text>
           </View>
           <View style={[styles.waypointLabel, { backgroundColor: 'rgba(239,68,68,0.9)' }]}>
             <Text style={styles.waypointLabelText}>العميل</Text>
           </View>
        </Animated.View>

        <Animated.View style={[styles.successOverlay, { opacity: successOpacity, backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.successIcon, { color: colors.primary }]}>check_circle</Text>
          <Text style={[styles.successText, { color: colors.primary }]}>تم قبول الرحلة</Text>
        </Animated.View>
      </View>

      <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
        <View style={styles.sheetHandle} />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
          <View style={styles.statsSummary}>
            <View style={styles.statBox}>
               <Text style={[styles.statLabel, { color: colors.subtext }]}>الربح الصافي</Text>
               <Text style={[styles.statValue, { color: colors.primary }]}>٤٥.٠٠ <Text style={styles.currency}>ر.س</Text></Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
               <Text style={[styles.statLabel, { color: colors.subtext }]}>المسافة</Text>
               <Text style={[styles.statValue, { color: colors.text }]}>٨.٤ <Text style={styles.unit}>كم</Text></Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
               <Text style={[styles.statLabel, { color: colors.subtext }]}>الوقت</Text>
               <Text style={[styles.statValue, { color: colors.text }]}>٢٥ <Text style={styles.unit}>د</Text></Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.customerSummaryRow}>
            <View style={styles.customerMainInfo}>
              <View style={styles.customerTextContainer}>
                  <Text style={[styles.customerName, { color: colors.text }]}>عبدالله منصور</Text>
                  <View style={styles.customerRating}>
                    <Text style={styles.starSmall}>star</Text>
                    <Text style={[styles.ratingValue, { color: colors.subtext }]}>٤.٨ (١٢٠ طلب)</Text>
                  </View>
              </View>
              {/* Cast style to any to fix ImageStyle union errors */}
              <Image 
                  source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAz9lwkz5CPv8Rw8IFJjMlD-SJ0SAMkSlEcegcP4mVyUWwqOnDD4fYJu0mgm7ZuI4Rzaz6fN90bUY5cPoUxE5-TYfYcPrwRtjlyAOYU2dJyjk4Bkx0dkBX-F_3DM39LYsvfOfbn2gb6cjuAgQ546Nn8R8tGd-Y12l3fqFjQ7kQgDZgsDSYD8czqCtQfEwyMOHnTHK-T8Wyt90UTm_VSLnkqObm6Iinr-B6796wsovXN8olHNP_WjHnOQ039n6o51ZSm2_lr8gSKsQ" }}
                  style={styles.customerAvatar as any}
              />
            </View>
            <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]} onPress={() => onNavigate(Screen.CHAT)}>
              <Text style={[styles.contactBtnIcon, { color: colors.primary }]}>chat_bubble</Text>
              <Text style={[styles.contactBtnText, { color: colors.primary }]}>تواصل مع العميل</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border, marginTop: 20 }]} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>الأصناف المطلوبة (٣)</Text>
            <View style={[styles.itemsCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
               <View style={styles.itemRow}>
                  <Text style={[styles.itemQty, { color: colors.primary }]}>x٢</Text>
                  <Text style={[styles.itemName, { color: colors.text }]}>وجبة بيج ماك عائلية</Text>
               </View>
               <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />
               <View style={styles.itemRow}>
                  <Text style={[styles.itemQty, { color: colors.primary }]}>x١</Text>
                  <Text style={[styles.itemName, { color: colors.text }]}>كوكاكولا حجم كبير</Text>
               </View>
               <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />
               <View style={styles.itemRow}>
                  <Text style={[styles.itemQty, { color: colors.primary }]}>x١</Text>
                  {/* Cast style to any to fix incorrect overload matching */}
                  <Text style={[styles.itemName, { color: colors.text }] as any}>ماك فلوري أوريو</Text>
               </View>
            </View>
          </View>

          <View style={styles.section}>
             <Text style={[styles.sectionTitle, { color: colors.text }]}>مسار الرحلة</Text>
             <View style={styles.timeline}>
                <View style={styles.timelineItem}>
                   <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                   <View style={styles.timelineLine} />
                   <View style={styles.timelineContent}>
                      <Text style={[styles.timelineTitle, { color: colors.text }]}>استلام: مطعم البيك</Text>
                      <Text style={[styles.timelineDesc, { color: colors.subtext }]}>حي العليا - طريق الملك فهد</Text>
                   </View>
                </View>
                <View style={styles.timelineItem}>
                   <View style={[styles.timelineDot, { backgroundColor: '#ef4444' }]} />
                   <View style={styles.timelineContent}>
                      <Text style={[styles.timelineTitle, { color: colors.text }]}>تسليم: موقع العميل</Text>
                      <Text style={[styles.timelineDesc, { color: colors.subtext }]}>حي النخيل - شارع التخصصي</Text>
                   </View>
                </View>
             </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
           <Animated.View style={{ width: buttonWidth, alignSelf: 'center' }}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.swipeBtn, { backgroundColor: isStarting ? colors.border : colors.primary }]}
              onPress={startTripAnimation}
              disabled={isStarting}
            >
                {isStarting ? (
                  <ActivityIndicator color="#112117" size="small" />
                ) : (
                  <>
                    <Text style={styles.swipeBtnText}>قبول وبدء الرحلة</Text>
                    <View style={styles.swipeIconCircle}>
                      <Text style={styles.swipeIcon}>chevron_left</Text>
                    </View>
                  </>
                )}
            </TouchableOpacity>
           </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { height: '35%', width: '100%', position: 'relative' },
  mapImage: { width: '100%', height: '100%', opacity: 0.5 },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  headerRow: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontFamily: 'Material Icons Round', color: '#fff', fontSize: 24 },
  timePill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  timePillText: { color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'Cairo' },
  waypoint: { position: 'absolute', alignItems: 'center', zIndex: 6, transform: [{translateX: -16}, {translateY: -16}] },
  waypointPulse: { position: 'absolute', width: 40, height: 40, borderRadius: 20, zIndex: 5, marginLeft: -20, marginTop: -20 },
  waypointCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0d1a12', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
  waypointText: { color: '#0d1a12', fontWeight: '900', fontSize: 16 },
  waypointLabel: { marginTop: 4, backgroundColor: 'rgba(26,46,34,0.95)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  waypointLabelText: { color: '#fff', fontSize: 10, fontWeight: 'bold', fontFamily: 'Cairo' },
  successOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 50, justifyContent: 'center', alignItems: 'center' },
  successIcon: { fontFamily: 'Material Icons Round', fontSize: 80, marginBottom: 12 },
  successText: { fontSize: 24, fontWeight: 'bold', fontFamily: 'Cairo' },
  sheet: { flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -30, elevation: 20 },
  sheetHandle: { width: 40, height: 4, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2, alignSelf: 'center', marginTop: 15 },
  sheetContent: { padding: 25, paddingBottom: 120 },
  statsSummary: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(0,0,0,0.05)' },
  statLabel: { fontSize: 11, fontWeight: 'bold', fontFamily: 'Cairo', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '900' },
  currency: { fontSize: 12, fontWeight: '400' },
  unit: { fontSize: 12, fontWeight: '400' },
  divider: { height: 1, marginVertical: 25 },
  customerSummaryRow: { marginBottom: 10 },
  customerMainInfo: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 15 },
  customerAvatar: { width: 56, height: 56, borderRadius: 28, marginLeft: 16 },
  customerTextContainer: { flex: 1, alignItems: 'flex-end' },
  customerName: { fontSize: 18, fontWeight: 'bold', fontFamily: 'Cairo' },
  customerRating: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 4 },
  starSmall: { fontFamily: 'Material Icons Round', fontSize: 14, color: '#facc15', marginLeft: 4 },
  ratingValue: { fontSize: 12, fontFamily: 'Cairo' },
  contactBtn: { height: 48, borderRadius: 14, borderWidth: 1, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 8 },
  contactBtnIcon: { fontFamily: 'Material Icons Round', fontSize: 18 },
  contactBtnText: { fontSize: 14, fontWeight: 'bold', fontFamily: 'Cairo' },
  section: { marginBottom: 30, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Cairo', textAlign: 'right', marginBottom: 15 },
  itemsCard: { padding: 16, borderRadius: 20, borderWidth: 1 },
  itemRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  itemQty: { fontSize: 14, fontWeight: 'bold', marginLeft: 12 },
  itemName: { fontSize: 14, fontFamily: 'Cairo' },
  itemDivider: { height: 1, marginVertical: 12 },
  timeline: { paddingRight: 10 },
  timelineItem: { flexDirection: 'row-reverse', marginBottom: 0, paddingBottom: 20 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, zIndex: 1, marginLeft: 16, marginTop: 4 },
  timelineLine: { position: 'absolute', right: 5, top: 12, bottom: 0, width: 2, backgroundColor: 'rgba(0,0,0,0.05)' },
  timelineContent: { flex: 1, alignItems: 'flex-end' },
  timelineTitle: { fontSize: 14, fontWeight: 'bold', fontFamily: 'Cairo' },
  timelineDesc: { fontSize: 12, fontFamily: 'Cairo', marginTop: 2 },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, borderTopWidth: 1, zIndex: 20 },
  swipeBtn: { height: 64, borderRadius: 32, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  swipeBtnText: { color: '#112117', fontSize: 18, fontWeight: 'bold', fontFamily: 'Cairo', flex: 1, textAlign: 'center' },
  swipeIconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#112117', justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  swipeIcon: { fontFamily: 'Material Icons Round', fontSize: 28, color: '#fff' },
});

export default OrderDetailsScreen;