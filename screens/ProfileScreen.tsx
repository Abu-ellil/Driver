
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Screen } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProfileScreenProps {
  onNavigate: (s: Screen) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const { colors, toggleTheme, mode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: mode === 'dark' ? 'rgba(26,46,34,0.5)' : colors.surfaceAlt }]}>
        <View style={styles.headerTop}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZNpZ0yW6Jk_mbrQsUXjdhchRAaGGzpZHCJ87D3z3wP6DzEOyyUys0ZwivDdnCIylYt6zuAvmTeB_uREnwHQDN3zOCL3vpy_2zazDbOtOmmUpayjOI2fU52sK4OMGHHhaTvsmKOt4J12TJI1UlvWRR3fEWuVToiGYwT_yuEoPB9_OmjVKPSZoiSzQ5202hdMTfzRqc0JeQnOPqqwwJb1OuKvC1qVxtZgaWhmyUrVNLxxnDOWJGTZ2fGg-NZ-JO-hLzOIU2YaJAPA" }}
                style={[styles.avatar, { borderColor: colors.primary }]}
              />
              <View style={[styles.activePill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.verifiedIcon, { color: colors.primary }]}>verified</Text>
                <Text style={[styles.activeText, { color: colors.text }]}>نشط</Text>
              </View>
            </View>
            <View style={styles.nameCol}>
              <Text style={[styles.userName, { color: colors.text }]}>أحمد محمد</Text>
              <View style={styles.ratingRow}>
                <View style={[styles.ratingBadge, { backgroundColor: colors.surface }]}>
                   <Text style={styles.starIcon}>star</Text>
                   <Text style={[styles.ratingText, { color: colors.text }]}>4.9</Text>
                </View>
                <Text style={[styles.statusText, { color: colors.subtext }]}>سائق مميز</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={[styles.notifButton, { backgroundColor: colors.surface }]}>
            <Text style={[styles.notifIcon, { color: colors.subtext }]}>notifications_none</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
           <Text style={[styles.sectionTitle, { color: colors.text }]}>مقاييس الأداء</Text>
           <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                 <View style={styles.metricHeader}>
                    <View style={[styles.metricIconBox, { backgroundColor: colors.primarySoft }]}><Text style={[styles.metricIcon, { color: colors.primary }]}>check_circle</Text></View>
                    <Text style={[styles.metricValue, { color: colors.text }]}>95%</Text>
                 </View>
                 <Text style={[styles.metricLabel, { color: colors.subtext }]}>معدل القبول</Text>
                 <View style={[styles.progressBg, { backgroundColor: colors.background }]}><View style={[styles.progressFill, { backgroundColor: colors.primary, width: '95%' }]} /></View>
              </View>
              <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                 <View style={styles.metricHeader}>
                    <View style={[styles.metricIconBox, { backgroundColor: colors.primarySoft }]}><Text style={[styles.metricIcon, { color: colors.primary }]}>thumb_up</Text></View>
                    <Text style={[styles.metricValue, { color: colors.text }]}>98%</Text>
                 </View>
                 <Text style={[styles.metricLabel, { color: colors.subtext }]}>رضا العملاء</Text>
                 <View style={[styles.progressBg, { backgroundColor: colors.background }]}><View style={[styles.progressFill, { backgroundColor: colors.primary, width: '98%' }]} /></View>
              </View>
           </View>
        </View>

        <View style={styles.section}>
           <Text style={[styles.sectionTitle, { color: colors.text }]}>الإعدادات</Text>
           <View style={[styles.menuContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              
              <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={toggleTheme}>
                 <View style={styles.menuLeft}><Text style={[styles.chevronIcon, { color: colors.border }]}>chevron_left</Text></View>
                 <View style={styles.menuRight}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>{mode === 'dark' ? 'الوضع الفاتح' : 'الوضع الليلي'}</Text>
                    <View style={[styles.menuIconBox, { backgroundColor: colors.background }]}>
                      <Text style={[styles.menuItemIcon, { color: colors.primary }]}>
                        {mode === 'dark' ? 'light_mode' : 'dark_mode'}
                      </Text>
                    </View>
                 </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                 <View style={styles.menuLeft}><Text style={[styles.chevronIcon, { color: colors.border }]}>chevron_left</Text></View>
                 <View style={styles.menuRight}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>المعلومات الشخصية</Text>
                    <View style={[styles.menuIconBox, { backgroundColor: colors.background }]}><Text style={[styles.menuItemIcon, { color: colors.subtext }]}>person</Text></View>
                 </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                 <View style={styles.menuLeft}><Text style={[styles.chevronIcon, { color: colors.border }]}>chevron_left</Text></View>
                 <View style={styles.menuRight}>
                    <View>
                      <Text style={[styles.menuItemTitle, { color: colors.text }]}>تفاصيل المركبة</Text>
                      <Text style={[styles.menuItemSub, { color: colors.subtext }]}>Toyota Corolla • 2021</Text>
                    </View>
                    <View style={[styles.menuIconBox, { backgroundColor: colors.background }]}><Text style={[styles.menuItemIcon, { color: colors.subtext }]}>directions_car</Text></View>
                 </View>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                 <View style={styles.menuLeft}><Text style={[styles.chevronIcon, { color: colors.border }]}>chevron_left</Text></View>
                 <View style={styles.menuRight}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>المساعدة والدعم</Text>
                    <View style={[styles.menuIconBox, { backgroundColor: colors.background }]}><Text style={[styles.menuItemIcon, { color: colors.subtext }]}>headset_mic</Text></View>
                 </View>
              </TouchableOpacity>
           </View>

           <TouchableOpacity style={[styles.logoutButton, { borderColor: 'rgba(239,68,68,0.3)' }]} onPress={() => onNavigate(Screen.LOGIN)}>
              <Text style={styles.logoutIcon}>logout</Text>
              <Text style={styles.logoutText}>تسجيل الخروج</Text>
           </TouchableOpacity>
           <Text style={[styles.versionText, { color: colors.subtext }]}>إصدار 2.4.1 (120)</Text>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={[styles.navBar, { backgroundColor: colors.nav, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(Screen.DASHBOARD)}>
          <Text style={[styles.navIcon, { color: colors.subtext }]}>dashboard</Text>
          <Text style={[styles.navText, { color: colors.subtext }]}>الرئيسية</Text>
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
          <View style={[styles.navItemActive, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.navIconActive, { color: colors.primary }]}>person</Text>
          </View>
          <Text style={[styles.navTextActive, { color: colors.primary }]}>حسابي</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 25 },
  headerTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  profileInfo: { flexDirection: 'row-reverse', alignItems: 'center' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2 },
  activePill: { position: 'absolute', bottom: -5, right: -5, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1, flexDirection: 'row-reverse', alignItems: 'center' },
  verifiedIcon: { fontFamily: 'Material Icons Round', fontSize: 10, marginLeft: 4 },
  activeText: { fontSize: 8, fontWeight: '900' },
  nameCol: { marginRight: 15 },
  userName: { fontSize: 20, fontWeight: '900', textAlign: 'right', fontFamily: 'Cairo' },
  ratingRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 4 },
  ratingBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, flexDirection: 'row-reverse', alignItems: 'center', marginLeft: 10 },
  starIcon: { fontFamily: 'Material Icons Round', fontSize: 14, color: '#facc15', marginLeft: 4 },
  ratingText: { fontWeight: 'bold', fontSize: 12 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  notifButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  notifIcon: { fontFamily: 'Material Icons Round', fontSize: 22 },
  scrollContent: { paddingBottom: 150 },
  section: { paddingHorizontal: 25, marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '900', textAlign: 'right', marginBottom: 15, fontFamily: 'Cairo' },
  metricsGrid: { flexDirection: 'row-reverse', gap: 12 },
  metricCard: { flex: 1, padding: 20, borderRadius: 25, borderWidth: 1 },
  metricHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  metricIconBox: { padding: 6, borderRadius: 8 },
  metricIcon: { fontFamily: 'Material Icons Round', fontSize: 18 },
  metricValue: { fontSize: 22, fontWeight: '900' },
  metricLabel: { fontSize: 10, fontWeight: 'bold', textAlign: 'right' },
  progressBg: { width: '100%', height: 6, borderRadius: 3, marginTop: 15, overflow: 'hidden' },
  progressFill: { height: '100%' },
  menuContainer: { borderRadius: 25, overflow: 'hidden', borderWidth: 1 },
  menuItem: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 },
  menuLeft: { justifyContent: 'center' },
  chevronIcon: { fontFamily: 'Material Icons Round', fontSize: 20 },
  menuRight: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 },
  menuItemTitle: { fontWeight: 'bold', fontSize: 14, textAlign: 'right' },
  menuItemSub: { fontSize: 10, marginTop: 2, textAlign: 'right' },
  menuIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  menuItemIcon: { fontFamily: 'Material Icons Round', fontSize: 18 },
  logoutButton: { marginTop: 30, height: 60, borderRadius: 18, borderWidth: 1, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center' },
  logoutIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#ef4444', marginLeft: 10 },
  logoutText: { color: '#ef4444', fontWeight: '900', fontSize: 16, fontFamily: 'Cairo' },
  versionText: { textAlign: 'center', marginTop: 20, fontSize: 10, fontWeight: 'bold' },
  navBar: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row-reverse', justifyContent: 'space-around', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 30 : 20, paddingTop: 15, borderTopWidth: 1 },
  navItem: { alignItems: 'center' },
  navItemActive: { padding: 8, borderRadius: 12 },
  navIcon: { fontFamily: 'Material Icons Round', fontSize: 24 },
  navIconActive: { fontFamily: 'Material Icons Round', fontSize: 24 },
  navText: { fontSize: 10, fontWeight: 'bold' },
  navTextActive: { fontSize: 10, fontWeight: 'bold' },
  fab: { width: 64, height: 64, borderRadius: 32, marginTop: -40, justifyContent: 'center', alignItems: 'center', borderWidth: 4 },
  fabIcon: { fontFamily: 'Material Icons Round', fontSize: 32, color: '#112117' }
});

export default ProfileScreen;
