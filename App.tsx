
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, Platform, Text } from 'react-native';
import { Screen } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ConnectivityProvider, useConnectivity } from './context/ConnectivityContext';
import DashboardScreen from './screens/DashboardScreen';
import LoginScreen from './screens/LoginScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';
import ActiveTripScreen from './screens/ActiveTripScreen';
import PaymentScreen from './screens/PaymentScreen';
import ChatScreen from './screens/ChatScreen';
import ReviewPendingScreen from './screens/ReviewPendingScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';
import NotificationBanner from './components/NotificationBanner';

const { width } = Dimensions.get('window');
const MAX_WIDTH = 450;

const OfflineBanner: React.FC = () => {
  const { isOnline } = useConnectivity();
  const { colors } = useTheme();

  if (isOnline) return null;

  return (
    <View style={[styles.offlineBanner, { backgroundColor: '#f59e0b' }]}>
      <Text style={styles.offlineIcon}>cloud_off</Text>
      <Text style={styles.offlineText}>وضع العمل دون اتصال - سيتم المزامنة لاحقاً</Text>
    </View>
  );
};

const Main: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [isOnlineStatus, setIsOnlineStatus] = useState(false);
  const { colors } = useTheme();

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen onLogin={() => setCurrentScreen(Screen.DASHBOARD)} />;
      case Screen.DASHBOARD:
        return (
          <DashboardScreen 
            onNavigate={setCurrentScreen} 
            isOnline={isOnlineStatus} 
            setIsOnline={setIsOnlineStatus} 
          />
        );
      case Screen.ORDERS:
        return <OrdersScreen onNavigate={setCurrentScreen} />;
      case Screen.PROFILE:
        return <ProfileScreen onNavigate={setCurrentScreen} />;
      case Screen.ACTIVE_TRIP:
        return <ActiveTripScreen onNavigate={setCurrentScreen} />;
      case Screen.ORDER_DETAILS:
        return <OrderDetailsScreen onNavigate={setCurrentScreen} />;
      case Screen.PAYMENT:
        return <PaymentScreen onNavigate={setCurrentScreen} />;
      case Screen.CHAT:
        return <ChatScreen onNavigate={setCurrentScreen} />;
      case Screen.REVIEW_PENDING:
        return <ReviewPendingScreen onNavigate={setCurrentScreen} />;
      case Screen.NOTIFICATIONS:
        return <NotificationsScreen onNavigate={setCurrentScreen} />;
      default:
        return <DashboardScreen onNavigate={setCurrentScreen} isOnline={isOnlineStatus} setIsOnline={setIsOnlineStatus} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]}>
      <View style={[styles.screenWrapper, { backgroundColor: colors.background }]}>
        <OfflineBanner />
        <NotificationBanner onNavigate={setCurrentScreen} />
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <ConnectivityProvider>
      <NotificationProvider>
        <Main />
      </NotificationProvider>
    </ConnectivityProvider>
  </ThemeProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  screenWrapper: {
    flex: 1,
    width: width > MAX_WIDTH ? MAX_WIDTH : '100%',
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      }
    })
  },
  offlineBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 10000,
    gap: 8,
  },
  offlineIcon: {
    fontFamily: 'Material Icons Round',
    color: '#112117',
    fontSize: 16,
  },
  offlineText: {
    color: '#112117',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Cairo',
  }
});

export default App;
