
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Screen } from '../types';

interface ReviewPendingScreenProps {
  onNavigate: (s: Screen) => void;
}

const ReviewPendingScreen: React.FC<ReviewPendingScreenProps> = ({ onNavigate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topActions}>
         <TouchableOpacity onPress={() => onNavigate(Screen.LOGIN)} style={styles.logoutBtn}>
            <Text style={styles.logoutIcon}>logout</Text>
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
         </TouchableOpacity>
      </View>

      <View style={styles.centerBox}>
        <View style={styles.animBox}>
           <View style={styles.iconCircle}>
              <Text style={styles.checkIcon}>fact_check</Text>
           </View>
           <View style={styles.statusPill}>
              <Text style={styles.hourIcon}>hourglass_top</Text>
           </View>
        </View>

        <Text style={styles.title}>جاري مراجعة الحساب</Text>
        <Text style={styles.desc}>
          شكراً لتسجيلك معنا. يقوم فريقنا حالياً بالتحقق من المستندات والبيانات الخاصة بك لضمان جودة الخدمة.
        </Text>

        <View style={styles.timerPill}>
           <Text style={styles.timerIcon}>schedule</Text>
           <Text style={styles.timerText}>الرد المتوقع خلال 24-48 ساعة</Text>
        </View>

        <View style={styles.footerActions}>
           <View style={styles.helpBox}>
              <View style={styles.helpIconBox}><Text style={styles.helpIcon}>headset_mic</Text></View>
              <View>
                 <Text style={styles.helpTitle}>تحتاج مساعدة؟</Text>
                 <Text style={styles.helpSub}>فريق الدعم متاح للإجابة على استفساراتك</Text>
              </View>
           </View>
           <TouchableOpacity style={styles.chatBtn}>
              <Text style={styles.btnText}>تواصل مع الدعم</Text>
              <Text style={styles.btnIcon}>chat</Text>
           </TouchableOpacity>
        </View>
        
        <Text style={styles.refCode}>معرف الطلب: #REF-8920</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#112117', padding: 25 },
  topActions: { paddingTop: 40, alignItems: 'flex-start' },
  logoutBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  logoutIcon: { fontFamily: 'Material Icons Round', fontSize: 18, color: '#555', transform: [{ rotate: '180deg' }] },
  logoutText: { color: '#555', fontWeight: 'bold', fontSize: 13, fontFamily: 'Cairo' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  animBox: { position: 'relative', marginBottom: 40 },
  iconCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(25,230,107,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(25,230,107,0.2)', shadowColor: '#19e66b', shadowOpacity: 0.2, shadowRadius: 30 },
  checkIcon: { fontFamily: 'Material Icons Round', fontSize: 60, color: '#19e66b' },
  statusPill: { position: 'absolute', top: -5, right: -5, backgroundColor: '#1a2e22', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#333', transform: [{ rotate: '12deg' }] },
  hourIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#19e66b' },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 15, fontFamily: 'Cairo' },
  desc: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20, marginBottom: 30, fontFamily: 'Cairo' },
  timerPill: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: 'rgba(25,230,107,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 15, marginBottom: 40, borderWidth: 1, borderColor: 'rgba(25,230,107,0.2)' },
  timerIcon: { fontFamily: 'Material Icons Round', fontSize: 18, color: '#19e66b', marginLeft: 8 },
  timerText: { color: '#19e66b', fontSize: 12, fontWeight: 'bold', fontFamily: 'Cairo' },
  footerActions: { width: '100%', gap: 15 },
  helpBox: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 25, flexDirection: 'row-reverse', alignItems: 'center', gap: 15, borderWidth: 1, borderColor: '#222' },
  helpIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(25,230,107,0.1)', justifyContent: 'center', alignItems: 'center' },
  helpIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#19e66b' },
  helpTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'right', fontFamily: 'Cairo' },
  helpSub: { color: '#555', fontSize: 10, textAlign: 'right', fontWeight: 'bold', marginTop: 2 },
  chatBtn: { backgroundColor: '#19e66b', height: 60, borderRadius: 20, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', shadowColor: '#19e66b', shadowOpacity: 0.3, shadowRadius: 10 },
  btnText: { color: '#112117', fontSize: 18, fontWeight: '900', marginLeft: 12, fontFamily: 'Cairo' },
  btnIcon: { fontFamily: 'Material Icons Round', fontSize: 22, color: '#112117' },
  refCode: { fontSize: 10, color: '#333', marginTop: 30, fontWeight: 'bold', letterSpacing: 1 }
});

export default ReviewPendingScreen;
