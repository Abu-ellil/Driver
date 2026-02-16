
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { mode, colors, toggleTheme } = useTheme();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.blob, { backgroundColor: colors.primarySoft }]} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={toggleTheme} 
          style={[styles.themeToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.themeIcon, { color: colors.primary }]}>
            {mode === 'dark' ? 'light_mode' : 'dark_mode'}
          </Text>
        </TouchableOpacity>

        <View style={[styles.logoContainer, { backgroundColor: colors.surface, borderColor: colors.primarySoft }]}>
          <Text style={[styles.logoIcon, { color: colors.primary }]}>local_shipping</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>أهلاً بك مجدداً</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>سجل دخولك لمتابعة طلبات التوصيل</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.subtext }]}>رقم الهاتف أو البريد الإلكتروني</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.inputIcon, { color: colors.subtext }]}>person_outline</Text>
            <TextInput 
              style={[styles.input, { color: colors.text }]} 
              placeholder="مثال: 0551234567" 
              placeholderTextColor={colors.subtext}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.subtext }]}>كلمة المرور</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.inputIcon, { color: colors.subtext }]}>lock_outline</Text>
            <TextInput 
              style={[styles.input, { color: colors.text }]} 
              placeholder="••••••••" 
              placeholderTextColor={colors.subtext}
              secureTextEntry
            />
            <Text style={[styles.inputIconLeft, { color: colors.subtext }]}>visibility_off</Text>
          </View>
          <TouchableOpacity style={styles.forgotPass}>
            <Text style={[styles.forgotPassText, { color: colors.primary }]}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.primary }]} onPress={onLogin}>
          <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.subtext }]}>أو</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      <TouchableOpacity style={[styles.registerButton, { borderColor: colors.border }]}>
        <Text style={[styles.registerButtonText, { color: colors.text }]}>إنشاء حساب جديد</Text>
      </TouchableOpacity>

      <Text style={[styles.footerText, { color: colors.subtext }]}>
        بمتابعة التسجيل، أنت توافق على <Text style={[styles.link, { color: colors.subtext }]}>الشروط والأحكام</Text> و <Text style={[styles.link, { color: colors.subtext }]}>سياسة الخصوصية</Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  themeToggle: {
    position: 'absolute',
    top: -20,
    right: 0,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeIcon: {
    fontFamily: 'Material Icons Round',
    fontSize: 20,
  },
  blob: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontFamily: 'Material Icons Round',
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Cairo',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    fontFamily: 'Cairo',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 56,
  },
  inputIcon: {
    fontFamily: 'Material Icons Round',
    fontSize: 20,
    marginLeft: 10,
  },
  inputIconLeft: {
    fontFamily: 'Material Icons Round',
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  forgotPass: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  forgotPassText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Cairo',
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#112117',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Cairo',
  },
  registerButton: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Cairo',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 32,
    fontFamily: 'Cairo',
  },
  link: {
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;
