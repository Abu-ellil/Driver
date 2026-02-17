
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { Screen } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

interface DashboardScreenProps {
  onNavigate: (s: Screen) => void;
  isOnline: boolean;
  setIsOnline: (b: boolean) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, isOnline, setIsOnline }) => {
  const { mode, colors, toggleTheme } = useTheme();
  const { addNotification, unreadCount, syncing } = useNotifications();

  const handleToggleOnline = () => {
    const newState = !isOnline;
    setIsOnline(newState);
    if (newState) {
      setTimeout(() => {
        addNotification({
          title: 'طلب جديد متاح! 🚀',
          body: 'يوجد طلب توصيل من "برجر هاوس" بالقرب منك بقيمة 25 ر.س',
          type: 'order'
        });
      }, 1500);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <View style={styles.headerRight}>
           <TouchableOpacity onPress={() => onNavigate(Screen.NOTIFICATIONS)} style={[styles.iconButton, { backgroundColor: colors.surface }]}>
              <Text style={[styles.headerIcon, { color: colors.primary }]}>notifications</Text>
              {unreadCount > 0 ? (
                <View style={[styles.badge, { backgroundColor: '#ef4444' }]}>
                  <Text style={styles.badgeText}>{String(unreadCount)}</Text>
                </View>
              ) : null}
              {syncing ? (
                <View style={styles.syncIndicator}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : null}
           </TouchableOpacity>
           <TouchableOpacity onPress={toggleTheme} style={[styles.iconButton, { backgroundColor: colors.surface, marginRight: 8 }]}>
              <Text style={[styles.headerIcon, { color: colors.primary }]}>
                {mode === 'dark' ? 'light_mode' : 'dark_mode'}
              </Text>
           </TouchableOpacity>
           <View style={{ marginRight: 15 }}>
            <Text style={[styles.statusLabel, { color: colors.subtext }]}>الحالة</Text>
            <View style={styles.statusControl}>
              <TouchableOpacity 
                onPress={handleToggleOnline} 
                style={[
                  styles.toggleContainer, 
                  { backgroundColor: isOnline ? colors.primary : colors.border }
                ]}
              >
                <View style={[
                  styles.toggleThumb, 
                  { transform: [{ translateX: isOnline ? 18 : 0 }] }
                ]} />
              </TouchableOpacity>
              <Text style={[styles.statusText, { color: isOnline ? colors.primary : colors.subtext }]}>
                {isOnline ? 'متصل' : 'غير متصل'}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => onNavigate(Screen.PROFILE)} style={[styles.profileBadge, { borderColor: colors.primary }]}>
          <Image 
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAz9lwkz5CPv8Rw8IFJjMlD-SJ0SAMkSlEcegcP4mVyUWwqOnDD4fYJu0mgm7ZuI4Rzaz6fN90bUY5cPoUxE5-TYfYcPrwRtjlyAOYU2dJyjk4Bkx0dkBX-F_3DM39LYsvfOfbn2gb6cjuAgQ546Nn8R8tGd-Y12l3fqFjQ7kQgDZgsDSYD8czqCtQfEwyMOHnTHK-T8Wyt90UTm_VSLnkqObm6Iinr-B6796wsovXN8olHNP_WjHnOQ039n6o51ZSm2_lr8gSKsQ" }}
            style={styles.profileImage}
          />
          <View style={[styles.onlineDot, { borderColor: colors.surface, backgroundColor: colors.primary }]} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>report_problem</Text>
          <View style={styles.warningTextContent}>
            <Text style={styles.warningTitle}>رصيد مستحق</Text>
            <Text style={styles.warningDesc}>عليك مبلغ $154.50 للوكالة. يرجى السداد.</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate(Screen.PAYMENT)} style={styles.payButton}>
            <Text style={styles.payButtonText}>دفع</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>الأرباح</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>$85.20</Text>
            <View style={styles.statTrend}>
              <Text style={[styles.trendIcon, { color: colors.primary }]}>trending_up</Text>
              <Text style={[styles.trendText, { color: colors.primary }]}>+12%</Text>
            </View>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>نشط</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>3h 15m</Text>
            <Text style={[styles.statDetail, { color: colors.subtext }]}>بدأ 9:00 ص</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>الطلبات</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>6</Text>
            <Text style={[styles.statDetail, { color: colors.subtext }]}>2 معلق</Text>
          </View>
        </View>

        <View style={[styles.mapContainer, { borderColor: colors.primarySoft }]}>
          <View style={[styles.mapMock, { backgroundColor: mode === 'dark' ? '#0d1a12' : '#e2e8f0' }]}>
             <View style={styles.mapOverlayTop}>
               <View style={[styles.mapPill, { backgroundColor: colors.nav, borderColor: colors.border }]}>
                 <View style={styles.dotPulse} />
                 <Text style={[styles.mapPillText, { color: colors.text }]}>منطقة طلب عالي</Text>
               </View>
             </View>
             <View style={styles.driverIndicator}>
                <View style={[styles.driverPulse, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]} />
                <Text style={[styles.navigationIcon, { color: colors.primary }]}>navigation</Text>
             </View>
          </View>
        </View>

        <View style={[styles.nearbyCard, { backgroundColor: colors.surface, borderColor: colors.primarySoft }]}>
          <View style={styles.nearbyHeader}>
            <View>
              <Text style={[styles.nearbyTitle, { color: colors.text }]}>طلبات قريبة</Text>
              <Text style={[styles.nearbySubtitle, { color: colors.subtext }]}>بناءً على موقعك الحالي</Text>
            </View>
            <View style={[styles.badgeContainer, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.badgeTextSmall, { color: colors.primary }]}>3 جديدة</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => onNavigate(Screen.ORDERS)} style={[styles.radarButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.radarIcon}>radar</Text>
            <Text style={styles.radarText}>عرض الطلبات القريبة</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.navBar, { backgroundColor: colors.nav, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(Screen.DASHBOARD)}>
          <View style={[styles.navItemActive, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.navIconActive, { color: colors.primary }]}>dashboard</Text>
          </View>
          <Text style={[styles.navTextActive, { color: colors.primary }]}>الرئيسية</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(Screen.ORDERS)}>
          <Text style={[styles.navIcon, { color: colors.subtext }]}>receipt_long</Text>
          <Text style={[styles.navText, { color: colors.subtext }]}>الطلبات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary, borderColor: colors.background }]}>
          <Text style={styles.fabIcon}>qr_code_scanner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(Screen.PAYMENT)}>
          <Text style={[styles.navIcon, { color: colors.subtext }]}>payments</Text>
          <Text style={[styles.navText, { color: colors.subtext }]}>الأرباح</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(Screen.PROFILE)}>
          <Text style={[styles.navIcon, { color: colors.subtext }]}>person</Text>
          <Text style={[styles.navText, { color: colors.subtext }]}>حسابي</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  headerRight: { flexDirection: 'row-reverse', alignItems: 'center' },
  iconButton: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  headerIcon: { fontFamily: 'Material Icons Round', fontSize: 24 },
  badge: { position: 'absolute', top: -5, right: -5, minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, zIndex: 2 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  syncIndicator: { position: 'absolute', bottom: -2, left: -2, zIndex: 1 },
  statusLabel: { fontSize: 10, fontWeight: '700', textAlign: 'right', marginBottom: 4 },
  statusControl: { flexDirection: 'row-reverse', alignItems: 'center' },
  statusText: { fontSize: 18, fontWeight: 'bold', marginRight: 10, fontFamily: 'Cairo' },
  toggleContainer: { width: 44, height: 24, borderRadius: 12, padding: 3, flexDirection: 'row' },
  toggleThumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff' },
  profileBadge: { position: 'relative', borderWidth: 2, borderRadius: 25, padding: 2 },
  profileImage: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#333' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  scrollContent: { paddingBottom: 120 },
  warningCard: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', margin: 16, padding: 16, borderRadius: 20, flexDirection: 'row-reverse', alignItems: 'center' },
  warningIcon: { fontFamily: 'Material Icons Round', color: '#ef4444', fontSize: 24, marginLeft: 12 },
  warningTextContent: { flex: 1 },
  warningTitle: { color: '#ef4444', fontWeight: 'bold', fontSize: 14, fontFamily: 'Cairo', textAlign: 'right' },
  warningDesc: { color: '#ef4444', fontSize: 11, marginTop: 2, fontFamily: 'Cairo', textAlign: 'right' },
  payButton: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  payButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'Cairo' },
  statsGrid: { flexDirection: 'row-reverse', paddingHorizontal: 16, gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 20, alignItems: 'center', borderWidth: 1 },
  statLabel: { fontSize: 10, fontWeight: 'bold', fontFamily: 'Cairo', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '900', fontFamily: 'Cairo' },
  statTrend: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  trendText: { fontSize: 10, fontWeight: 'bold' },
  trendIcon: { fontFamily: 'Material Icons Round', fontSize: 12, transform: [{ rotate: '180deg' }] },
  statDetail: { fontSize: 10, marginTop: 4 },
  mapContainer: { margin: 16, height: 240, borderRadius: 40, overflow: 'hidden', borderWidth: 1 },
  mapMock: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapOverlayTop: { position: 'absolute', top: 16, right: 16 },
  mapPill: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  dotPulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', marginLeft: 8 },
  mapPillText: { fontSize: 10, fontWeight: 'bold', fontFamily: 'Cairo' },
  driverIndicator: { justifyContent: 'center', alignItems: 'center' },
  driverPulse: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 1 },
  navigationIcon: { fontFamily: 'Material Icons Round', fontSize: 32 },
  nearbyCard: { margin: 16, borderRadius: 32, padding: 24, borderWidth: 1 },
  nearbyHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  nearbyTitle: { fontSize: 18, fontWeight: 'bold', fontFamily: 'Cairo', textAlign: 'right' },
  nearbySubtitle: { fontSize: 12, fontFamily: 'Cairo', textAlign: 'right' },
  badgeContainer: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeTextSmall: { fontSize: 10, fontWeight: 'bold', fontFamily: 'Cairo' },
  radarButton: { height: 56, borderRadius: 16, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 12 },
  radarIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#112117', marginLeft: 10 },
  radarText: { color: '#112117', fontSize: 16, fontWeight: '900', fontFamily: 'Cairo' },
  navBar: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row-reverse', justifyContent: 'space-around', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 30 : 20, paddingTop: 15, borderTopWidth: 1 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navItemActive: { padding: 8, borderRadius: 12, marginBottom: 4 },
  navIcon: { fontFamily: 'Material Icons Round', fontSize: 24 },
  navIconActive: { fontFamily: 'Material Icons Round', fontSize: 24 },
  navText: { fontSize: 10, fontWeight: 'bold', fontFamily: 'Cairo' },
  navTextActive: { fontSize: 10, fontWeight: 'bold', fontFamily: 'Cairo' },
  fab: { width: 64, height: 64, borderRadius: 32, marginTop: -40, justifyContent: 'center', alignItems: 'center', borderWidth: 4, elevation: 5 },
  fabIcon: { fontFamily: 'Material Icons Round', fontSize: 32, color: '#112117' }
});

export default DashboardScreen;
