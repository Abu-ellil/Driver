
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Screen } from '../types';
import { useConnectivity } from '../context/ConnectivityContext';

interface ActiveTripScreenProps {
  onNavigate: (s: Screen) => void;
}

const ActiveTripScreen: React.FC<ActiveTripScreenProps> = ({ onNavigate }) => {
  const { isOnline } = useConnectivity();

  return (
    <View style={styles.container}>
      {/* Map Mock or Fallback */}
      <View style={styles.mapContainer}>
        {isOnline ? (
          <Image 
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZNpZ0yW6Jk_mbrQsUXjdhchRAaGGzpZHCJ87D3z3wP6DzEOyyUys0ZwivDdnCIylYt6zuAvmTeB_uREnwHQDN3zOCL3vpy_2zazDbOtOmmUpayjOI2fU52sK4OMGHHhaTvsmKOt4J12TJI1UlvWRR3fEWuVToiGYwT_yuEoPB9_OmjVKPSZoiSzQ5202hdMTfzRqc0JeQnOPqqwwJb1OuKvC1qVxtZgaWhmyUrVNLxxnDOWJGTZ2fGg-NZ-JO-hLzOIU2YaJAPA" }}
            style={styles.mapImage}
          />
        ) : (
          <View style={[styles.mapImage, styles.mapFallback]}>
             <Text style={styles.fallbackIcon}>map</Text>
             <Text style={styles.fallbackText}>الموقع مخزن مؤقتاً - لا يوجد اتصال بالخريطة</Text>
          </View>
        )}
        <View style={styles.mapOverlay} />
        
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.mapButton}><Text style={styles.mapButtonIcon}>near_me</Text></TouchableOpacity>
          <TouchableOpacity style={styles.mapButton}><Text style={styles.mapButtonIcon}>layers</Text></TouchableOpacity>
        </View>

        <View style={styles.etaBadge}>
           <View style={styles.etaCol}>
              <Text style={styles.etaLabel}>الوقت</Text>
              <Text style={styles.etaValuePrimary}>12 دقيقة</Text>
           </View>
           <View style={styles.etaDivider} />
           <View style={styles.etaCol}>
              <Text style={styles.etaLabel}>المسافة</Text>
              <Text style={styles.etaValueSecondary}>3.4 كم</Text>
           </View>
        </View>
      </View>

      {/* Sheet */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        
        <ScrollView style={styles.sheetContent}>
           <View style={styles.summaryRow}>
              <View>
                <Text style={styles.earningsLabel}>الأرباح المتوقعة</Text>
                <Text style={styles.earningsValue}>45.00 ر.س</Text>
              </View>
              <View style={styles.summaryStatusCol}>
                 <View style={styles.orderIdRow}>
                    <Text style={styles.orderIcon}>delivery_dining</Text>
                    <Text style={styles.orderIdText}>طلب #4829</Text>
                 </View>
                 <View style={styles.statusPill}><Text style={styles.statusPillText}>جاري الاستلام</Text></View>
              </View>
           </View>

           <View style={styles.stopsContainer}>
              <View style={styles.stopCardActive}>
                 <View style={styles.stopSidebar} />
                 <View style={styles.stopCardContent}>
                    <View style={styles.stopHeader}>
                       <View style={styles.stopTitleRow}>
                          <View style={styles.stopNumberBox}><Text style={styles.stopNumberText}>1</Text></View>
                          <View>
                             <Text style={styles.stopName}>مطعم البيك</Text>
                             <Text style={styles.stopStatusActive}>جاهز للاستلام</Text>
                          </View>
                       </View>
                       <TouchableOpacity style={styles.chatButton} onPress={() => onNavigate(Screen.CHAT)}>
                          <Text style={styles.chatIcon}>chat</Text>
                       </TouchableOpacity>
                    </View>
                    <View style={styles.addressRow}>
                       <Text style={styles.addressIcon}>location_on</Text>
                       <Text style={styles.addressText}>طريق الملك فهد، حي العليا، الرياض 12214</Text>
                    </View>
                 </View>
              </View>

              <View style={styles.stopCard}>
                 <View style={styles.stopHeader}>
                    <View style={styles.stopTitleRow}>
                       <View style={styles.stopNumberBoxInactive}><Text style={styles.stopNumberTextInactive}>2</Text></View>
                       <View>
                          <Text style={styles.stopName}>صيدلية النهدي</Text>
                          <Text style={styles.stopStatusInactive}>قيد التحضير</Text>
                       </View>
                    </View>
                 </View>
                 <View style={styles.addressRow}>
                    <Text style={styles.addressIcon}>location_on</Text>
                    <Text style={styles.addressText}>شارع التخصصي، حي المعذر، الرياض 11564</Text>
                 </View>
              </View>
           </View>
        </ScrollView>

        <View style={styles.actionContainer}>
           <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate(Screen.DASHBOARD)}>
              <Text style={styles.actionButtonText}>تأكيد الوصول للمطعم</Text>
              <Text style={styles.actionButtonIcon}>check_circle</Text>
           </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#112117' },
  mapContainer: { height: '45%', width: '100%' },
  mapImage: { width: '100%', height: '100%', opacity: 0.3 },
  mapFallback: { backgroundColor: '#1a2e22', justifyContent: 'center', alignItems: 'center' },
  fallbackIcon: { fontFamily: 'Material Icons Round', fontSize: 48, color: '#333', marginBottom: 12 },
  fallbackText: { color: '#888', fontSize: 12, fontFamily: 'Cairo' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17,33,23,0.2)' },
  mapControls: { position: 'absolute', right: 20, top: 60, gap: 12 },
  mapButton: { width: 44, height: 44, backgroundColor: 'rgba(26,46,34,0.9)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  mapButtonIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#fff' },
  etaBadge: { position: 'absolute', top: 60, left: '50%', transform: [{ translateX: -75 }], width: 150, backgroundColor: 'rgba(26,46,34,0.95)', padding: 10, borderRadius: 30, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(25,230,107,0.2)' },
  etaCol: { alignItems: 'center', flex: 1 },
  etaLabel: { fontSize: 9, color: '#888' },
  etaValuePrimary: { fontSize: 12, fontWeight: 'bold', color: '#19e66b' },
  etaValueSecondary: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  etaDivider: { width: 1, height: 20, backgroundColor: '#333' },
  sheet: { flex: 1, backgroundColor: '#1a2e22', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -30, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  sheetHandle: { width: 40, height: 5, backgroundColor: '#333', borderRadius: 5, alignSelf: 'center', marginTop: 15 },
  sheetContent: { padding: 25 },
  summaryRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 25, borderBottomWidth: 1, borderBottomColor: '#333', marginBottom: 25 },
  earningsLabel: { fontSize: 12, color: '#888', textAlign: 'right' },
  earningsValue: { fontSize: 28, fontWeight: '900', color: '#19e66b' },
  summaryStatusCol: { alignItems: 'flex-end' },
  orderIdRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 5 },
  orderIcon: { fontFamily: 'Material Icons Round', fontSize: 16, color: '#888', marginLeft: 6 },
  orderIdText: { fontSize: 12, color: '#888' },
  statusPill: { backgroundColor: 'rgba(25,230,107,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusPillText: { color: '#19e66b', fontSize: 9, fontWeight: 'bold' },
  stopsContainer: { gap: 16, paddingBottom: 150 },
  stopCardActive: { backgroundColor: '#112117', borderRadius: 25, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(25,230,107,0.2)' },
  stopSidebar: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 6, backgroundColor: '#19e66b' },
  stopCardContent: { padding: 20 },
  stopHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  stopTitleRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  stopNumberBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1a2e22', justifyContent: 'center', alignItems: 'center', marginLeft: 12, borderWidth: 1, borderColor: '#333' },
  stopNumberText: { color: '#19e66b', fontWeight: '900', fontSize: 18 },
  stopName: { fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'right' },
  stopStatusActive: { fontSize: 11, color: '#19e66b', marginTop: 2, textAlign: 'right' },
  chatButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  chatIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#fff' },
  addressRow: { flexDirection: 'row-reverse', alignItems: 'flex-start' },
  addressIcon: { fontFamily: 'Material Icons Round', fontSize: 16, color: '#555', marginLeft: 8, marginTop: 2 },
  addressText: { color: '#888', fontSize: 13, flex: 1, textAlign: 'right', lineHeight: 20 },
  stopCard: { backgroundColor: 'rgba(17,33,23,0.5)', borderRadius: 25, padding: 20, borderWidth: 1, borderColor: '#333', opacity: 0.6 },
  stopNumberBoxInactive: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1a2e22', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  stopNumberTextInactive: { color: '#555', fontWeight: '900', fontSize: 18 },
  stopStatusInactive: { fontSize: 11, color: '#555', marginTop: 2, textAlign: 'right' },
  actionContainer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: 'rgba(26,46,34,0.95)' },
  actionButton: { backgroundColor: '#19e66b', height: 60, borderRadius: 18, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center' },
  actionButtonText: { color: '#112117', fontSize: 16, fontWeight: '900', marginLeft: 12 },
  actionButtonIcon: { fontFamily: 'Material Icons Round', fontSize: 24, color: '#112117' }
});

export default ActiveTripScreen;
