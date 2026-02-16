
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Screen } from '../types';

interface PaymentScreenProps {
  onNavigate: (s: Screen) => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onNavigate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate(Screen.DASHBOARD)} style={styles.backButton}>
          <Text style={styles.backIcon}>arrow_back_ios</Text>
        </TouchableOpacity>
        <Text style={styles.title}>سداد مستحقات الوكالة</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
         <View style={styles.balanceCard}>
            <View style={styles.balanceBlob} />
            <Text style={styles.balanceLabel}>إجمالي المديونية المستحقة</Text>
            <Text style={styles.balanceValue}>1,250.00 SAR</Text>
            <View style={styles.updateBadge}><Text style={styles.updateText}>آخر تحديث: منذ ١٥ دقيقة</Text></View>
         </View>

         <View style={styles.alertBox}>
            <Text style={styles.alertIcon}>warning_amber</Text>
            <View style={styles.alertTextCol}>
               <Text style={styles.alertTitle}>تنبيه هام</Text>
               <Text style={styles.alertDesc}>يرجى سداد ديونك لتجنب حظر الحساب المؤقت وتوقف استقبال الطلبات.</Text>
            </View>
         </View>

         <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>المبلغ المراد سداده</Text>
            <View style={styles.inputWrapper}>
               <Text style={styles.inputCurrency}>SAR</Text>
               <TextInput 
                 style={styles.amountInput}
                 defaultValue="1250.00"
                 keyboardType="numeric"
                 placeholderTextColor="#555"
               />
            </View>
         </View>

         <View style={styles.methodSection}>
            <Text style={styles.inputLabel}>طريقة الدفع</Text>
            <View style={styles.methodsList}>
               <TouchableOpacity style={styles.methodCardActive}>
                  <View style={styles.methodInfo}>
                     <View style={styles.methodIconBoxActive}><Text style={styles.methodIconActive}>credit_card</Text></View>
                     <View style={styles.methodTextCol}>
                        <Text style={styles.methodTitleActive}>بطاقة بنكية / مدى</Text>
                        <Text style={styles.methodSub}>دفع فوري وآمن</Text>
                     </View>
                  </View>
                  <View style={styles.radioOuterActive}><View style={styles.radioInnerActive} /></View>
               </TouchableOpacity>

               <TouchableOpacity style={styles.methodCard}>
                  <View style={styles.methodInfo}>
                     <View style={styles.methodIconBox}><Text style={styles.methodIcon}>phone_iphone</Text></View>
                     <View style={styles.methodTextCol}>
                        <Text style={styles.methodTitle}>Apple Pay</Text>
                        <Text style={styles.methodSub}>أسرع طريقة للدفع</Text>
                     </View>
                  </View>
                  <View style={styles.radioOuter} />
               </TouchableOpacity>
            </View>
         </View>
      </ScrollView>

      <View style={styles.footer}>
         <View style={styles.finalTotalRow}>
            <Text style={styles.totalLabel}>المبلغ النهائي</Text>
            <Text style={styles.totalValue}>١,٢٥٠.٠٠ ريال</Text>
         </View>
         <TouchableOpacity style={styles.payButton} onPress={() => onNavigate(Screen.DASHBOARD)}>
            <Text style={styles.payButtonText}>تأكيد الدفع</Text>
            <Text style={styles.payButtonIcon}>check_circle</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#112117' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#222' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1a2e22', justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontFamily: 'Material Icons Round', fontSize: 18, color: '#fff', transform: [{ rotate: '180deg' }] },
  title: { fontSize: 16, fontWeight: '900', color: '#fff', fontFamily: 'Cairo' },
  placeholder: { width: 40 },
  scrollContent: { padding: 20, paddingBottom: 150 },
  balanceCard: { backgroundColor: '#112117', padding: 30, borderRadius: 30, borderWidth: 1, borderColor: '#333', alignItems: 'center', overflow: 'hidden' },
  balanceBlob: { position: 'absolute', top: -40, left: -40, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(25,230,107,0.1)' },
  balanceLabel: { fontSize: 13, color: '#888', fontWeight: 'bold', fontFamily: 'Cairo' },
  balanceValue: { fontSize: 32, fontWeight: '900', color: '#fff', marginVertical: 15 },
  updateBadge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  updateText: { fontSize: 10, color: '#555', fontWeight: 'bold' },
  alertBox: { backgroundColor: 'rgba(249,115,22,0.1)', padding: 15, borderRadius: 20, flexDirection: 'row-reverse', gap: 15, marginVertical: 25, borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)' },
  alertIcon: { fontFamily: 'Material Icons Round', fontSize: 24, color: '#f97316' },
  alertTextCol: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '900', color: '#f97316', textAlign: 'right', fontFamily: 'Cairo' },
  alertDesc: { fontSize: 11, color: '#888', textAlign: 'right', marginTop: 4, lineHeight: 18 },
  inputSection: { marginBottom: 25 },
  inputLabel: { fontSize: 14, fontWeight: '900', color: '#888', textAlign: 'right', marginBottom: 12, fontFamily: 'Cairo' },
  inputWrapper: { backgroundColor: '#1a2e22', borderRadius: 20, padding: 20, borderWidth: 2, borderColor: '#19e66b', flexDirection: 'row-reverse', alignItems: 'center' },
  inputCurrency: { fontSize: 18, fontWeight: '900', color: '#555', marginLeft: 15 },
  amountInput: { flex: 1, fontSize: 32, fontWeight: '900', color: '#fff', textAlign: 'right' },
  methodSection: { marginBottom: 30 },
  methodsList: { gap: 12 },
  methodCardActive: { backgroundColor: 'rgba(25,230,107,0.05)', borderRadius: 20, padding: 20, borderWidth: 2, borderColor: '#19e66b', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  methodCard: { backgroundColor: '#1a2e22', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#333', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 },
  methodInfo: { flexDirection: 'row-reverse', alignItems: 'center' },
  methodIconBoxActive: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#112117', justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  methodIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#112117', justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  methodIconActive: { fontFamily: 'Material Icons Round', fontSize: 24, color: '#19e66b' },
  methodIcon: { fontFamily: 'Material Icons Round', fontSize: 24, color: '#fff' },
  methodTextCol: { alignItems: 'flex-end' },
  methodTitleActive: { fontSize: 15, fontWeight: '900', color: '#fff' },
  methodTitle: { fontSize: 15, fontWeight: '900', color: '#ccc' },
  methodSub: { fontSize: 10, color: '#555', marginTop: 2 },
  radioOuterActive: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#19e66b', justifyContent: 'center', alignItems: 'center', backgroundColor: '#19e66b' },
  radioInnerActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#112117' },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#333' },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: 'rgba(17,33,23,0.95)', borderTopWidth: 1, borderTopColor: '#222' },
  finalTotalRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalLabel: { fontSize: 14, color: '#888', fontWeight: 'bold' },
  totalValue: { fontSize: 20, fontWeight: '900', color: '#fff' },
  payButton: { backgroundColor: '#19e66b', height: 60, borderRadius: 18, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center' },
  payButtonText: { color: '#112117', fontSize: 18, fontWeight: '900', marginLeft: 12 },
  payButtonIcon: { fontFamily: 'Material Icons Round', fontSize: 24, color: '#112117' }
});

export default PaymentScreen;
