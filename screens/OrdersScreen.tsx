
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Screen, Order } from '../types';
import { useTheme } from '../context/ThemeContext';

interface OrdersScreenProps {
  onNavigate: (s: Screen) => void;
}

const INITIAL_ORDERS: Order[] = [
  { id: '1', price: '45.50', stores: ['برجر بالاس', 'ستار كوفي'], distance: '3.2', time: '25', type: 'Multi', status: 'Available' },
  { id: '2', price: '12.00', stores: ['ماما ميا بيتزا'], distance: '1.5', time: '12', type: 'Single', status: 'Available' },
  { id: '3', price: '68.20', stores: ['فريش ماركت'], distance: '8.4', time: '40', type: 'Heavy', status: 'Available' },
  { id: '4', price: '22.00', stores: ['كنتاكي'], distance: '2.1', time: '18', type: 'Single', status: 'Available' },
  { id: '5', price: '35.00', stores: ['شاورما جليمر', 'عصيرات الريان'], distance: '4.5', time: '30', type: 'Multi', status: 'Available' },
  { id: '6', price: '95.00', stores: ['ايكيا - توصيل خاص'], distance: '12.0', time: '55', type: 'Heavy', status: 'Available' },
];

type SortBy = 'price' | 'distance' | 'time';
type FilterType = 'All' | 'Single' | 'Multi' | 'Heavy';
type DistanceLimit = 'All' | '5' | '10' | '20';

const OrdersScreen: React.FC<OrdersScreenProps> = ({ onNavigate }) => {
  const { colors } = useTheme();
  const [filterType, setFilterType] = useState<FilterType>('All');
  const [sortBy, setSortBy] = useState<SortBy>('price');
  const [maxDistance, setMaxDistance] = useState<DistanceLimit>('All');

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...INITIAL_ORDERS];

    // Filtering by type
    if (filterType !== 'All') {
      result = result.filter(order => order.type === filterType);
    }

    // Filtering by distance
    if (maxDistance !== 'All') {
      const limit = parseFloat(maxDistance);
      result = result.filter(order => parseFloat(order.distance) <= limit);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'price') return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === 'time') return parseInt(a.time) - parseInt(b.time);
      return 0;
    });

    return result;
  }, [filterType, sortBy, maxDistance]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>طلبات متاحة</Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>أنت متصل وتبحث عن رحلات</Text>
          </View>
          <View style={[styles.onlineBadge, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}>
            <View style={[styles.onlineDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.onlineText, { color: colors.primary }]}>متصل</Text>
          </View>
        </View>

        {/* Sorting Options */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: colors.subtext }]}>ترتيب حسب</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ flexDirection: 'row-reverse' }}>
            <TouchableOpacity 
              style={[styles.sortPill, sortBy === 'price' && { backgroundColor: colors.primary, borderColor: colors.primary }]} 
              onPress={() => setSortBy('price')}
            >
              <Text style={[styles.sortIcon, { color: sortBy === 'price' ? '#112117' : colors.subtext }]}>payments</Text>
              <Text style={[styles.sortText, { color: sortBy === 'price' ? '#112117' : colors.subtext }]}>الأعلى سعراً</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortPill, sortBy === 'distance' && { backgroundColor: colors.primary, borderColor: colors.primary }]} 
              onPress={() => setSortBy('distance')}
            >
              <Text style={[styles.sortIcon, { color: sortBy === 'distance' ? '#112117' : colors.subtext }]}>near_me</Text>
              <Text style={[styles.sortText, { color: sortBy === 'distance' ? '#112117' : colors.subtext }]}>الأقرب مسافة</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortPill, sortBy === 'time' && { backgroundColor: colors.primary, borderColor: colors.primary }]} 
              onPress={() => setSortBy('time')}
            >
              <Text style={[styles.sortIcon, { color: sortBy === 'time' ? '#112117' : colors.subtext }]}>schedule</Text>
              <Text style={[styles.sortText, { color: sortBy === 'time' ? '#112117' : colors.subtext }]}>الأسرع وقتاً</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Distance Filter */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: colors.subtext }]}>أقصى مسافة للطلب</Text>
          <View style={styles.typeRow}>
            {(['All', '5', '10', '20'] as DistanceLimit[]).map((dist) => (
              <TouchableOpacity 
                key={dist}
                style={[
                  styles.typePill, 
                  maxDistance === dist && { backgroundColor: colors.primarySoft, borderColor: colors.primary }
                ]}
                onPress={() => setMaxDistance(dist)}
              >
                <Text style={[
                  styles.typeText, 
                  { color: maxDistance === dist ? colors.primary : colors.subtext }
                ]}>
                  {dist === 'All' ? 'الكل' : `${dist} كم`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Type Filters */}
        <View style={[styles.filterSection, { marginBottom: 0 }]}>
          <Text style={[styles.filterLabel, { color: colors.subtext }]}>نوع الطلب</Text>
          <View style={styles.typeRow}>
            {(['All', 'Single', 'Multi', 'Heavy'] as FilterType[]).map((type) => (
              <TouchableOpacity 
                key={type}
                style={[
                  styles.typePill, 
                  filterType === type && { backgroundColor: colors.primarySoft, borderColor: colors.primary }
                ]}
                onPress={() => setFilterType(type)}
              >
                <Text style={[
                  styles.typeText, 
                  { color: filterType === type ? colors.primary : colors.subtext }
                ]}>
                  {type === 'All' ? 'الكل' : type === 'Single' ? 'فردي' : type === 'Multi' ? 'متعدد' : 'ثقيل'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredAndSortedOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyIcon, { color: colors.border }]}>search_off</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>لا توجد نتائج</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>جرب تغيير خيارات التصفية أو توسيع نطاق المسافة للبحث عن طلبات أخرى</Text>
          </View>
        ) : (
          filteredAndSortedOrders.map((order) => (
            <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.surface, borderRightColor: colors.primary }]}>
              <View style={styles.cardTop}>
                <View style={styles.storeIcons}>
                  <View style={[styles.storeIcon, { zIndex: 2, backgroundColor: colors.background, borderColor: colors.border }]}>
                     <Text style={[styles.iconLunch, { color: colors.primary }]}>lunch_dining</Text>
                  </View>
                  {order.type === 'Multi' && (
                    <View style={[styles.storeIcon, styles.storeIconOffset, { backgroundColor: colors.background, borderColor: colors.border }]}>
                       <Text style={[styles.iconCafe, { color: colors.primary }]}>local_cafe</Text>
                    </View>
                  )}
                </View>
                <View style={styles.priceContainer}>
                  <Text style={[styles.priceText, { color: colors.primary }]}>{order.price} <Text style={styles.currencyText}>ر.س</Text></Text>
                  <Text style={[styles.tipText, { color: colors.subtext }]}>{order.type === 'Heavy' ? 'رسوم حمل ثقيل' : 'صافي ربحك'}</Text>
                </View>
              </View>

              <View style={styles.cardMiddle}>
                <View style={styles.storeNamesRow}>
                  {order.type === 'Multi' && (
                    <View style={[styles.multiBadge, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                      <Text style={[styles.multiBadgeText, { color: '#818cf8' }]}>متعدد</Text>
                    </View>
                  )}
                  {order.type === 'Heavy' && (
                    <View style={[styles.multiBadge, { backgroundColor: 'rgba(249, 115, 22, 0.2)' }]}>
                      <Text style={[styles.multiBadgeText, { color: '#fb923c' }]}>ثقيل</Text>
                    </View>
                  )}
                  <Text style={[styles.storeNameText, { color: colors.text }]}>{order.stores.join(' & ')}</Text>
                </View>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaIcon, { color: colors.subtext }]}>near_me</Text>
                    <Text style={[styles.metaText, { color: colors.subtext }]}>{order.distance} كم</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaIcon, { color: colors.subtext }]}>schedule</Text>
                    <Text style={[styles.metaText, { color: colors.subtext }]}>~{order.time} دقيقة</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.primary }]} onPress={() => onNavigate(Screen.ORDER_DETAILS)}>
                <Text style={styles.detailsButtonText}>قبول الطلب</Text>
                <Text style={styles.detailsButtonIcon}>arrow_back</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        {filteredAndSortedOrders.length > 0 && (
          <Text style={[styles.searchingText, { color: colors.subtext }]}>جاري البحث عن المزيد من الطلبات...</Text>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={[styles.navBar, { backgroundColor: colors.nav, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(Screen.DASHBOARD)}>
          <Text style={[styles.navIcon, { color: colors.subtext }]}>dashboard</Text>
          <Text style={[styles.navText, { color: colors.subtext }]}>الرئيسية</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(Screen.ORDERS)}>
          <View style={[styles.navItemActive, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.navIconActive, { color: colors.primary }]}>receipt_long</Text>
          </View>
          <Text style={[styles.navTextActive, { color: colors.primary }]}>الطلبات</Text>
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
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1 },
  headerTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'right', fontFamily: 'Cairo' },
  subtitle: { fontSize: 13, textAlign: 'right', fontFamily: 'Cairo', marginTop: 2 },
  onlineBadge: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  onlineText: { fontSize: 10, fontWeight: 'bold' },
  filterSection: { marginBottom: 15 },
  filterLabel: { fontSize: 11, fontWeight: 'bold', fontFamily: 'Cairo', textAlign: 'right', marginBottom: 8, opacity: 0.8 },
  filterScroll: { marginBottom: 0 },
  sortPill: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 10 
  },
  sortIcon: { fontFamily: 'Material Icons Round', fontSize: 14, marginLeft: 6 },
  sortText: { fontSize: 12, fontWeight: '900', fontFamily: 'Cairo' },
  typeRow: { flexDirection: 'row-reverse', gap: 10 },
  typePill: { 
    flex: 1, 
    paddingVertical: 8, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: 'transparent', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    alignItems: 'center' 
  },
  typeText: { fontSize: 12, fontWeight: 'bold', fontFamily: 'Cairo' },
  listContent: { padding: 20, paddingBottom: 120 },
  orderCard: { borderRadius: 24, padding: 20, borderRightWidth: 4, marginBottom: 16, elevation: 2 },
  cardTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start' },
  storeIcons: { flexDirection: 'row' },
  storeIcon: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  storeIconOffset: { marginLeft: -15 },
  iconLunch: { fontFamily: 'Material Icons Round', fontSize: 22 },
  iconCafe: { fontFamily: 'Material Icons Round', fontSize: 22 },
  priceContainer: { alignItems: 'flex-start' },
  priceText: { fontSize: 26, fontWeight: '900' },
  currencyText: { fontSize: 12, fontWeight: '400' },
  tipText: { fontSize: 10, marginTop: 2 },
  cardMiddle: { marginVertical: 15 },
  storeNamesRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 8 },
  storeNameText: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', flex: 1, fontFamily: 'Cairo' },
  multiBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  multiBadgeText: { fontSize: 9, fontWeight: 'bold' },
  metaRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  metaItem: { flexDirection: 'row-reverse', alignItems: 'center', marginLeft: 20 },
  metaIcon: { fontFamily: 'Material Icons Round', fontSize: 14, marginLeft: 6 },
  metaText: { fontSize: 12 },
  detailsButton: { height: 54, borderRadius: 16, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center' },
  detailsButtonText: { color: '#112117', fontWeight: '900', fontSize: 16, marginLeft: 8, fontFamily: 'Cairo' },
  detailsButtonIcon: { fontFamily: 'Material Icons Round', fontSize: 20, color: '#112117' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyIcon: { fontFamily: 'Material Icons Round', fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Cairo' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, fontFamily: 'Cairo' },
  searchingText: { textAlign: 'center', marginTop: 20, fontSize: 12 },
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

export default OrdersScreen;
