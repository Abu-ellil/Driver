
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Platform } from 'react-native';
import { Screen } from '../types';
import { useTheme } from '../context/ThemeContext';

const { height } = Dimensions.get('window');

interface OrderDetailsScreenProps {
  onNavigate: (s: Screen) => void;
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ onNavigate }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Mock Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusIcons}>
           <View style={styles.statusBox} />
           <View style={styles.statusDot} />
           <View style={styles.statusDot} />
        </View>
        <Text style={styles.statusTime}>9:41</Text>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZNpZ0yW6Jk_mbrQsUXjdhchRAaGGzpZHCJ87D3z3wP6DzEOyyUys0ZwivDdnCIylYt6zuAvmTeB_uREnwHQDN3zOCL3vpy_2zazDbOtOmmUpayjOI2fU52sK4OMGHHhaTvsmKOt4J12TJI1UlvWRR3fEWuVToiGYwT_yuEoPB9_OmjVKPSZoiSzQ5202hdMTfzRqc0JeQnOPqqwwJb1OuKvC1qVxtZgaWhmyUrVNLxxnDOWJGTZ2fGg-NZ-JO-hLzOIU2YaJAPA" }}
          style={styles.mapImage}
        />
        <View style={styles.mapOverlay} />
        
        {/* Map UI Elements */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.mapBtn}>
            <Text style={styles.mapBtnIcon}>navigation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mapBtn, { marginTop: 12 }]}>
            <Text style={styles.mapBtnIcon}>layers</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.driverIndicator}>
           <View style={styles.pulseOuter} />
           <View style={styles.pulseInner} />
        </View>

        {/* Waypoints on map */}
        <View style={[styles.waypoint, { top: '35%', left: '55%' }]}>
           <View style={styles.waypointCircle}><Text style={styles.waypointText}>1</Text></View>
           <View style={styles.waypointLabel}><Text style={styles.waypointLabelText}>1. مطعم البيك</Text></View>
        </View>
        <View style={[styles.waypoint, { top: '25%', left: '70%' }]}>
           <View style={styles.waypointCircle}><Text style={styles.waypointText}>2</Text></View>
           <View style={styles.waypointLabel}><Text style={styles.waypointLabelText}>2. صيدلية النهدي</Text></View>
        </View>
      </View>

      {/* Details Sheet */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
          {/* Top Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.earningsCol}>
              <Text style={styles.label}>إجمالي الأرباح المتوقعة</Text>
              <Text style={styles.earningsValue}>45.00 <Text style={styles.currency}>ر.س</Text></Text>
            </View>
            <View style={styles.distanceCol}>
              <View style={styles.distanceIconRow}>
                 <Text style={styles.distanceIcon}>straighten</Text>
                 <Text style={styles.label}>المسافة</Text>
              </View>
              <Text style={styles.distanceValue}>12.5 <Text style={styles.unit}>كم</Text></Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>نقاط الاستلام (2)</Text>

          {/* Pickup Point 1 */}
          <View style={[styles.pickupCard, styles.activeCard]}>
            <View style={styles.pickupHeader}>
               <View style={styles.pickupIdCol}>
                  <Text style={styles.pickupLabel}>رقم الطلب</Text>
                  <Text style={styles.pickupId}>#4922</Text>
               </View>
               <View style={styles.pickupTitleCol}>
                  <Text style={styles.pickupName}>مطعم البيك</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>جاهز للاستلام</Text>
                  </View>
               </View>
               <View style={styles.stepCircle}><Text style={styles.stepText}>1</Text></View>
            </View>
            <View style={styles.addressRow}>
               <Text style={styles.addressIcon}>location_on</Text>
               <Text style={styles.addressText}>طريق الملك فهد، حي العليا، الرياض 12214</Text>
            </View>
            <View style={styles.cardActions}>
               <TouchableOpacity style={styles.secondaryBtn}>
                  <Text style={styles.btnTextSecondary}>اتصال</Text>
                  <Text style={styles.btnIconSecondary}>call</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.primaryBtn}>
                  <Text style={styles.btnTextPrimary}>الخريطة</Text>
                  <Text style={styles.btnIconPrimary}>map</Text>
               </TouchableOpacity>
            </View>
          </View>

          {/* Pickup Point 2 */}
          <View style={styles.pickupCard}>
            <View style={styles.pickupHeader}>
               <View style={styles.pickupIdCol}>
                  <Text style={styles.pickupLabel}>رقم الطلب</Text>
                  <Text style={styles.pickupId}>#1102</Text>
               </View>
               <View style={styles.pickupTitleCol}>
                  <Text style={styles.pickupName}>صيدلية النهدي</Text>
                  <View style={[styles.statusBadge, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                    <Text style={[styles.statusText, { color: '#888' }]}>قيد التحضير</Text>
                  </View>
               </View>
               <View style={[styles.stepCircle, { backgroundColor: '#112117' }]}><Text style={styles.stepText}>2</Text></View>
            </View>
            <View style={styles.addressRow}>
               <Text style={styles.addressIcon}>location_on</Text>
               <Text style={styles.addressText}>شارع التخصصي، حي المعذر، الرياض 11564</Text>
            </View>
            <View style={styles.cardActions}>
               <TouchableOpacity style={styles.secondaryBtn}>
                  <Text style={styles.btnTextSecondary}>اتصال</Text>
                  <Text style={styles.btnIconSecondary}>call</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.secondaryBtn}>
                  <Text style={styles.btnTextSecondary}>الخريطة</Text>
                  <Text style={styles.btnIconSecondary}>map</Text>
               </TouchableOpacity>
            </View>
          </View>

          {/* Fare details accordion */}
          <TouchableOpacity style={styles.fareRow}>
             <Text style={styles.fareIcon}>expand_more</Text>
             <Text style={styles.fareLabel}>تفاصيل الأجرة</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Swipe Button Container */}
        <View style={styles.footer}>
           <View style={styles.swipeContainer}>
              <Text style={styles.swipeText}>اسحب للبدء الرحلة</Text>
              <TouchableOpacity 
                style={styles.swipeHandle}
                onPress={() => onNavigate(Screen.ACTIVE_TRIP)}
              >
                 <Text style={styles.swipeIcon}>arrow_forward</Text>
              </TouchableOpacity>
           </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1a12' },
  statusBar: { paddingTop: 40, paddingHorizontal: 25, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  statusIcons: { flexDirection: 'row-reverse', gap: 6 },
  statusBox: { width: 30, height: 12, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)' },
  statusTime: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  mapContainer: { height: '40%', width: '100%', position: 'relative' },
  mapImage: { width: '100%', height: '100%', opacity: 0.4 },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,26,18,0.2)' },
  mapControls: { position: 'absolute', right: 20, top: 20 },
  mapBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(26,46,34,0.8)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  mapBtnIcon: { fontFamily: 'Material Icons Round', color: '#fff', fontSize: 24 },
  driverIndicator: { position: 'absolute', top: '50%', left: '30%', justifyContent: 'center', alignItems: 'center' },
  pulseOuter: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(25,230,107,0.1)', borderWidth: 1, borderColor: 'rgba(25,230,107,0.3)' },
  pulseInner: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: '#19e66b', borderWidth: 2, borderColor: '#fff' },
  waypoint: { position: 'absolute', alignItems: 'center' },
  waypointCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#19e66b', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0d1a12', zIndex: 2 },
  waypointText: { color: '#0d1a12', fontWeight: '900', fontSize: 16 },
  waypointLabel: { position: 'absolute', top: -35, backgroundColor: 'rgba(26,46,34,0.95)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#333', minWidth: 80 },
  waypointLabelText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  sheet: { flex: 1, backgroundColor: '#112117', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -30, shadowColor: '#000', shadowOffset: { width: 0, height: -15 }, shadowOpacity: 0.4, shadowRadius: 20 },
  sheetHandle: { width: 50, height: 4, backgroundColor: '#222', borderRadius: 2, alignSelf: 'center', marginTop: 15 },
  sheetContent: { padding: 25, paddingBottom: 150 },
  infoRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start' },
  earningsCol: { alignItems: 'flex-end' },
  distanceCol: { alignItems: 'flex-start' },
  distanceIconRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 4 },
  distanceIcon: { fontFamily: 'Material Icons Round', fontSize: 16, color: '#888', marginLeft: 6 },
  label: { color: '#888', fontSize: 13, fontWeight: 'bold', fontFamily: 'Cairo' },
  earningsValue: { fontSize: 32, fontWeight: '900', color: '#19e66b', marginTop: 5 },
  currency: { fontSize: 16, fontWeight: '400' },
  distanceValue: { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: 5 },
  unit: { fontSize: 14, fontWeight: '400' },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 25 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'right', marginBottom: 20, fontFamily: 'Cairo' },
  pickupCard: { backgroundColor: '#1a2e22', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#222' },
  activeCard: { borderColor: '#19e66b', borderRightWidth: 4 },
  pickupHeader: { flexDirection: 'row-reverse', alignItems: 'center' },
  stepCircle: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#112117', justifyContent: 'center', alignItems: 'center', marginLeft: 16, borderWidth: 1, borderColor: '#333' },
  stepText: { color: '#19e66b', fontWeight: '900', fontSize: 18 },
  pickupTitleCol: { flex: 1, alignItems: 'flex-end' },
  pickupName: { fontSize: 18, fontWeight: 'bold', color: '#fff', fontFamily: 'Cairo' },
  statusBadge: { backgroundColor: 'rgba(25,230,107,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 4 },
  statusText: { color: '#19e66b', fontSize: 10, fontWeight: 'bold', fontFamily: 'Cairo' },
  pickupIdCol: { alignItems: 'flex-end', minWidth: 60 },
  pickupLabel: { fontSize: 9, color: '#555', fontWeight: 'bold' },
  pickupId: { fontSize: 14, color: '#888', fontWeight: 'bold', marginTop: 2 },
  addressRow: { flexDirection: 'row-reverse', alignItems: 'flex-start', marginTop: 20 },
  addressIcon: { fontFamily: 'Material Icons Round', fontSize: 18, color: '#555', marginLeft: 10, marginTop: 2 },
  addressText: { color: '#888', fontSize: 13, flex: 1, textAlign: 'right', fontFamily: 'Cairo', lineHeight: 22 },
  cardActions: { flexDirection: 'row-reverse', gap: 12, marginTop: 20 },
  primaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: 'rgba(25,230,107,0.1)', flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 8 },
  secondaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnTextPrimary: { color: '#19e66b', fontWeight: 'bold', fontSize: 14, fontFamily: 'Cairo' },
  btnIconPrimary: { fontFamily: 'Material Icons Round', fontSize: 18, color: '#19e66b' },
  btnTextSecondary: { color: '#fff', fontWeight: 'bold', fontSize: 14, fontFamily: 'Cairo' },
  btnIconSecondary: { fontFamily: 'Material Icons Round', fontSize: 18, color: '#fff' },
  fareRow: { flexDirection: 'row-reverse', justifyContent: 'flex-end', alignItems: 'center', padding: 10 },
  fareLabel: { color: '#888', fontSize: 14, fontWeight: 'bold', fontFamily: 'Cairo' },
  fareIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#888', marginRight: 8 },
  footer: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: 25, paddingBottom: Platform.OS === 'ios' ? 40 : 25, backgroundColor: 'rgba(17,33,23,0.9)' },
  swipeContainer: { height: 74, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 37, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 8, borderWidth: 1, borderColor: 'rgba(25,230,107,0.2)' },
  swipeText: { flex: 1, textAlign: 'center', color: '#888', fontSize: 15, fontWeight: 'bold', fontFamily: 'Cairo' },
  swipeHandle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#19e66b', justifyContent: 'center', alignItems: 'center' },
  swipeIcon: { fontFamily: 'Material Icons Round', fontSize: 28, color: '#112117' }
});

export default OrderDetailsScreen;
