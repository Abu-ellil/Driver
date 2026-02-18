
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Text from './IconText';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { Screen } from '../types';

interface NotificationBannerProps {
  onNavigate: (s: Screen) => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ onNavigate }) => {
  const { activeBanner, clearBanner } = useNotifications();
  const { colors } = useTheme();

  if (!activeBanner) return null;

  const handlePress = () => {
    if (activeBanner.type === 'order') onNavigate(Screen.ORDERS);
    if (activeBanner.type === 'message') onNavigate(Screen.CHAT);
    if (activeBanner.type === 'payment') onNavigate(Screen.PAYMENT);
    clearBanner();
  };

  const getIcon = () => {
    switch (activeBanner.type) {
      case 'order': return 'local_shipping';
      case 'message': return 'chat_bubble';
      case 'payment': return 'payments';
      default: return 'notifications';
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.primary }]} 
      onPress={handlePress}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
        <Text style={[styles.icon, { color: colors.primary }]}>{getIcon()}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{activeBanner.title}</Text>
        <Text style={[styles.body, { color: colors.subtext }]} numberOfLines={1}>{activeBanner.body}</Text>
      </View>
      <TouchableOpacity onPress={clearBanner} style={styles.closeBtn}>
        <Text style={[styles.closeIcon, { color: colors.subtext }]}>close</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderBottomWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  icon: {
    fontFamily: 'Material Icons Round',
    fontSize: 24,
  },
  content: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo',
  },
  body: {
    fontSize: 12,
    fontFamily: 'Cairo',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
    marginRight: 8,
  },
  closeIcon: {
    fontFamily: 'Material Icons Round',
    fontSize: 18,
  }
});

export default NotificationBanner;

