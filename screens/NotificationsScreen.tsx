
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Screen } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

interface NotificationsScreenProps {
  onNavigate: (s: Screen) => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onNavigate }) => {
  const { colors } = useTheme();
  const { notifications, markAsRead, syncing, manualSync, lastSynced } = useNotifications();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => onNavigate(Screen.DASHBOARD)} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Text style={[styles.backIcon, { color: colors.text }]}>arrow_forward</Text>
        </TouchableOpacity>
        <View style={styles.titleCol}>
          <Text style={[styles.title, { color: colors.text }]}>الإشعارات</Text>
          {lastSynced && (
            <Text style={[styles.syncTime, { color: colors.subtext }]}>آخر مزامنة: {lastSynced}</Text>
          )}
        </View>
        <TouchableOpacity 
          onPress={manualSync} 
          disabled={syncing}
          style={[styles.syncBtn, { backgroundColor: colors.surface }]}
        >
          {syncing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[styles.syncIcon, { color: colors.primary }]}>sync</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {notifications.length === 0 && !syncing ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyIcon, { color: colors.border }]}>notifications_off</Text>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>لا توجد إشعارات حالياً</Text>
          </View>
        ) : (
          notifications.map(n => (
            <TouchableOpacity 
              key={n.id} 
              style={[styles.item, { backgroundColor: colors.surface, opacity: n.read ? 0.7 : 1 }]}
              onPress={() => markAsRead(n.id)}
            >
              <View style={[styles.typeIconBox, { backgroundColor: colors.primarySoft }]}>
                <Text style={[styles.typeIcon, { color: colors.primary }]}>
                  {n.type === 'order' ? 'local_shipping' : n.type === 'payment' ? 'payments' : n.type === 'system' ? 'security' : 'info'}
                </Text>
              </View>
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTime, { color: colors.subtext }]}>{n.timestamp}</Text>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{n.title}</Text>
                </View>
                <Text style={[styles.itemBody, { color: colors.subtext }]}>{n.body}</Text>
              </View>
              {!n.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          ))
        )}
        {syncing && notifications.length > 0 && (
          <View style={styles.syncOverlay}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.syncOverlayText, { color: colors.primary }]}>جاري تحديث البيانات...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  titleCol: { alignItems: 'flex-end', flex: 1, marginRight: 15 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncIcon: {
    fontFamily: 'Material Icons Round',
    fontSize: 20,
  },
  syncTime: {
    fontSize: 9,
    fontFamily: 'Cairo',
    marginTop: 2,
  },
  backIcon: {
    fontFamily: 'Material Icons Round',
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
  },
  emptyIcon: {
    fontFamily: 'Material Icons Round',
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Cairo',
  },
  item: {
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  typeIcon: {
    fontFamily: 'Material Icons Round',
    fontSize: 24,
  },
  itemContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itemHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo',
  },
  itemTime: {
    fontSize: 10,
  },
  itemBody: {
    fontSize: 12,
    fontFamily: 'Cairo',
    textAlign: 'right',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  syncOverlay: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10
  },
  syncOverlayText: {
    fontSize: 12,
    fontFamily: 'Cairo',
    fontWeight: 'bold'
  }
});

export default NotificationsScreen;
