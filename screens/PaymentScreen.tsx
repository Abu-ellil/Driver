
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated } from 'react-native';
import { Screen } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PaymentScreenProps {
  onNavigate: (s: Screen) => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onNavigate }) => {
  const { colors } = useTheme();
  const [selectedMethods, setSelectedMethods] = useState<string[]>(['card']);
  const [amount, setAmount] = useState('1250.00');

  const toggleMethod = (id: string) => {
    setSelectedMethods(prev => 
      prev.includes(id) 
        ? prev.filter(m => m !== id) 
        : [...prev, id]
    );
  };

  const showMultipleWarning = selectedMethods.length > 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => onNavigate(Screen.DASHBOARD)} style={[styles.backButton, { backgroundColor: colors.surfaceAlt }]}>
          <Text style={[styles.backIcon, { color: colors.text }]}>arrow_back_ios</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>سداد مستحقات الوكالة</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
         <View style={[styles.balanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.balanceBlob, { backgroundColor: colors.primarySoft }]} />
            <Text style={[styles.balanceLabel, { color: colors.subtext }]}>إجمالي المديونية المستحقة</Text>
            <Text style={[styles.balanceValue, { color: colors.text }]}>1,250.00 SAR</Text>
            <View style={[styles.updateBadge, { backgroundColor: colors.surfaceAlt }]}><Text style={[styles.updateText, { color: colors.subtext }]}>آخر تحديث: منذ ١٥ دقيقة</Text></View>
         </View>

         {showMultipleWarning && (
           <View style={[styles.warningBanner, { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }]}>
              <Text style={styles.warningBannerIcon}>info</Text>
              <Text style={styles.warningBannerText}>
                لقد اخترت عدة وسائل دفع. سيتم استخدام الوسيلة الأساسية فقط عند إتمام العملية.
              </Text>
           </View>
         )}

         <View style={styles.alertBox}>
            <Text style={styles.alertIcon}>warning_amber</Text>
            <View style={styles.alertTextCol}>
               <Text style={styles.alertTitle}>تنبيه هام</Text>
               <Text style={styles.alertDesc}>يرجى سداد ديونك لتجنب حظر الحساب المؤقت وتوقف استقبال الطلبات.</Text>
            </View>
         </View>

         <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.subtext }]}>المبلغ المراد سداده</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
               <Text style={[styles.inputCurrency, { color: colors.subtext }]}>SAR</Text>
               <TextInput 
                 style={[styles.amountInput, { color: colors.text }]}
                 value={amount}
                 onChangeText={setAmount}
                 keyboardType="numeric"
                 placeholderTextColor={colors.subtext}
               />
            </View>
         </View>

         <View style={styles.methodSection}>
            <Text style={[styles.inputLabel, { color: colors.subtext }]}>اختر وسيلة الدفع (يمكن اختيار متعدد)</Text>
            <View style={styles.methodsList}>
               <TouchableOpacity 
                 style={[
                   styles.methodCard, 
                   { backgroundColor: colors.surface, borderColor: colors.border },
                   selectedMethods.includes('card') && { borderColor: colors.primary, backgroundColor: colors.primarySoft }
                 ]}
                 onPress={() => toggleMethod('card')}
               >
                  <View style={styles.methodInfo}>
                     <View style={[styles.methodIconBox, { backgroundColor: colors.background }]}><Text style={[styles.methodIcon, { color: selectedMethods.includes('card') ? colors.primary : colors.subtext }]}>credit_card</Text></View>
                     <View style={styles.methodTextCol}>
                        <Text style={[styles.methodTitle, { color: colors.text }]}>بطاقة بنكية / مدى</Text>
                        <Text style={[styles.methodSub, { color: colors.subtext }]}>دفع فوري وآمن</Text>
                     </View>
                  </View>
                  <View style={[styles.checkbox, { borderColor: colors.border }, selectedMethods.includes('card') && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                    {selectedMethods.includes('card') && <Text style={styles.checkMark}>check</Text>}
                  </View>
               </TouchableOpacity>

               <TouchableOpacity 
                 style={[
                   styles.methodCard, 
                   { backgroundColor: colors.surface, borderColor: colors.border },
                   selectedMethods.includes('apple') && { borderColor: colors.primary, backgroundColor: colors.primarySoft }
                 ]}
                 onPress={() => toggleMethod('apple')}
               >
                  <View style={styles.methodInfo}>
                     <View style={[styles.methodIconBox, { backgroundColor: colors.background }]}><Text style={[styles.methodIcon, { color: selectedMethods.includes('apple') ? colors.primary : colors.subtext }]}>phone_iphone</Text></View>
                     <View style={styles.methodTextCol}>
                        <Text style={[styles.methodTitle, { color: colors.text }]}>Apple Pay</Text>
                        <Text style={[styles.methodSub, { color: colors.subtext }]}>أسرع طريقة للدفع</Text>
                     </View>
                  </View>
                  <View style={[styles.checkbox, { borderColor: colors.border }, selectedMethods.includes('apple') && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                    {selectedMethods.includes('apple') && <Text style={styles.checkMark}>check</Text>}
                  </View>
               </TouchableOpacity>

               <TouchableOpacity 
                 style={[
                   styles.methodCard, 
                   { backgroundColor: colors.surface, borderColor: colors.border },
                   selectedMethods.includes('stc') && { borderColor: colors.primary, backgroundColor: colors.primarySoft }
                 ]}
                 onPress={() => toggleMethod('stc')}
               >
                  <View style={styles.methodInfo}>
                     <View style={[styles.methodIconBox, { backgroundColor: colors.background }]}><Text style={[styles.methodIcon, { color: selectedMethods.includes('stc') ? colors.primary : colors.subtext }]}>account_balance_wallet</Text></View>
                     <View style={styles.methodTextCol}>
                        <Text style={[styles.methodTitle, { color: colors.text }]}>STC Pay</Text>
                        <Text style={[styles.methodSub, { color: colors.subtext }]}>المحفظة الرقمية</Text>
                     </View>
                  </View>
                  <View style={[styles.checkbox, { borderColor: colors.border }, selectedMethods.includes('stc') && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                    {selectedMethods.includes('stc') && <Text style={styles.checkMark}>check</Text>}
                  </View>
               </TouchableOpacity>
            </View>
         </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
         <View style={styles.finalTotalRow}>
            <Text style={[styles.totalLabel, { color: colors.subtext }]}>المبلغ النهائي</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>{amount} ريال</Text>
         </View>
         <TouchableOpacity 
           style={[styles.payButton, { backgroundColor: selectedMethods.length > 0 ? colors.primary : colors.border }]} 
           onPress={() => onNavigate(Screen.DASHBOARD)}
           disabled={selectedMethods.length === 0}
         >
            <Text style={[styles.payButtonText, { color: '#112117' }]}>إتمام الدفع</Text>
            <Text style={[styles.payButtonIcon, { color: '#112117' }]}>payment</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 },
  backButton: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontFamily: 'Material Icons Round', fontSize: 18, transform: [{ rotate: '180deg' }] },
  title: { fontSize: 16, fontWeight: '900', fontFamily: 'Cairo' },
  placeholder: { width: 40 },
  scrollContent: { padding: 20, paddingBottom: 150 },
  balanceCard: { padding: 30, borderRadius: 30, borderWidth: 1, alignItems: 'center', overflow: 'hidden' },
  balanceBlob: { position: 'absolute', top: -40, left: -40, width: 100, height: 100, borderRadius: 50 },
  balanceLabel: { fontSize: 13, fontWeight: 'bold', fontFamily: 'Cairo' },
  balanceValue: { fontSize: 32, fontWeight: '900', marginVertical: 15, fontFamily: 'Cairo' },
  updateBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  updateText: { fontSize: 10, fontWeight: 'bold', fontFamily: 'Cairo' },
  warningBanner: { flexDirection: 'row-reverse', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginTop: 20, gap: 10 },
  warningBannerIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#92400e' },
  warningBannerText: { flex: 1, fontSize: 11, color: '#92400e', fontFamily: 'Cairo', textAlign: 'right', fontWeight: 'bold' },
  alertBox: { backgroundColor: 'rgba(249,115,22,0.1)', padding: 15, borderRadius: 20, flexDirection: 'row-reverse', gap: 15, marginVertical: 25, borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)' },
  alertIcon: { fontFamily: 'Material Icons Round', fontSize: 24, color: '#f97316' },
  alertTextCol: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '900', color: '#f97316', textAlign: 'right', fontFamily: 'Cairo' },
  alertDesc: { fontSize: 11, color: '#888', textAlign: 'right', marginTop: 4, lineHeight: 18, fontFamily: 'Cairo' },
  inputSection: { marginBottom: 25 },
  inputLabel: { fontSize: 13, fontWeight: '900', textAlign: 'right', marginBottom: 12, fontFamily: 'Cairo' },
  inputWrapper: { borderRadius: 20, padding: 15, borderWidth: 2, flexDirection: 'row-reverse', alignItems: 'center' },
  inputCurrency: { fontSize: 16, fontWeight: '900', marginLeft: 15 },
  amountInput: { flex: 1, fontSize: 24, fontWeight: '900', textAlign: 'right', fontFamily: 'Cairo' },
  methodSection: { marginBottom: 30 },
  methodsList: { gap: 12 },
  methodCard: { borderRadius: 20, padding: 16, borderWidth: 1, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  methodInfo: { flexDirection: 'row-reverse', alignItems: 'center' },
  methodIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  methodIcon: { fontFamily: 'Material Icons Round', fontSize: 24 },
  methodTextCol: { alignItems: 'flex-end' },
  methodTitle: { fontSize: 15, fontWeight: '900', fontFamily: 'Cairo' },
  methodSub: { fontSize: 10, marginTop: 2, fontFamily: 'Cairo' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  checkMark: { fontFamily: 'Material Icons Round', fontSize: 16, color: '#112117' },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, borderTopWidth: 1 },
  finalTotalRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalLabel: { fontSize: 14, fontWeight: 'bold', fontFamily: 'Cairo' },
  totalValue: { fontSize: 22, fontWeight: '900', fontFamily: 'Cairo' },
  payButton: { height: 60, borderRadius: 18, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center' },
  payButtonText: { fontSize: 18, fontWeight: '900', marginLeft: 12, fontFamily: 'Cairo' },
  payButtonIcon: { fontFamily: 'Material Icons Round', fontSize: 24 }
});

export default PaymentScreen;
