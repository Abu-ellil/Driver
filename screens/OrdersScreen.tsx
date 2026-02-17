
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal, TextInput, Animated, Image, Dimensions } from 'react-native';
import { Screen, Order } from '../types';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

const FEEDBACK_TAGS = ['ربح جيد', 'طريق سهل', 'استلام سريع', 'عميل متعاون', 'واضح المعالم'];

const getStoreIcon = (name: string) => {
  if (name.includes('برجر')) return 'lunch_dining';
  if (name.includes('كوفي')) return 'local_coffee';
  if (name.includes('بيتزا')) return 'local_pizza';
  if (name.includes('ماركت')) return 'shopping_basket';
  if (name.includes('كنتاكي')) return 'restaurant';
  if (name.includes('شاورما')) return 'fastfood';
  if (name.includes('عصير')) return 'local_drink';
  if (name.includes('ايكيا')) return 'inventory_2';
  return 'storefront';
};

// Mock coordinates for markers relative to the mock map image
const MOCK_MARKERS = [
  { id: '1', top: '30%', right: '20%' },
  { id: '2', top: '45%', right: '60%' },
  { id: '3', top: '70%', right: '35%' },
  { id: '4', top: '25%', right: '75%' },
  { id: '5', top: '60%', right: '15%' },
  { id: '6', top: '15%', right: '40%' },
];

const OrdersScreen: React.FC<OrdersScreenProps> = ({ onNavigate }) => {
  const { colors, mode } = useTheme();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'time'>('price');
  
  // Feedback state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [hasPendingFeedback, setHasPendingFeedback] = useState(true);

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...INITIAL_ORDERS];
    result.sort((a, b) => {
      if (sortBy === 'price') return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === 'time') return parseInt(a.time) - parseInt(b.time);
      return 0;
    });
    return result;
  }, [sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmitFeedback = () => {
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setHasPendingFeedback(false);
      setFeedbackSubmitted(false);
      setRating(0);
      setSelectedTags([]);
    }, 1500);
  };

  const renderOrderCard = (order: Order) => (
    <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.surface, borderRightColor: colors.primary }]}>
      <View style={styles.cardTop}>
        <View style={styles.storeIcons}>
          {order.stores.slice(0, 3).map((store, index) => (
            <View 
              key={`${order.id}-${store}`} 
              style={[
                styles.storeIcon, 
                { 
                  zIndex: 10 - index, 
                  backgroundColor: colors.background, 
                  borderColor: colors.border,
                  marginLeft: index === 0 ? 0 : -15 
                }
              ]}
            >
               <Text style={[styles.iconLunch, { color: colors.primary }]}>
                 {getStoreIcon(store)}
               </Text>
            </View>
          ))}
          {order.stores.length > 3 && (
            <View style={[styles.storeIconCount, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}>
               <Text style={[styles.storeCountText, { color: colors.primary }]}>+{order.stores.length - 3}</Text>
            </View>
          )}
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, { color: colors.primary }]}>{order.price} <Text style={styles.currencyText}>ر.س</Text></Text>
          <Text style={[styles.tipText, { color: colors.subtext }]}>صافي ربحك</Text>
        </View>
      </View>

      <View style={styles.cardMiddle}>
        <Text style={[styles.storeNameText, { color: colors.text }]}>{order.stores.join(' & ')}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaIcon, { color: colors.subtext }]}>near_me</Text>
            <Text style={[styles.metaText, { color: colors.subtext }]}>{order.distance} كم</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.primarySoft, borderColor: colors.primary, borderWidth: 1 }]} onPress={() => onNavigate(Screen.ORDER_DETAILS)}>
        <Text style={[styles.detailsButtonText, { color: colors.primary }]}>تفاصيل الطلب</Text>
        <Text style={[styles.detailsButtonIcon, { color: colors.primary }]}>info_outline</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMapView = () => (
    <View style={styles.mapViewContainer}>
      <Image 
        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZNpZ0yW6Jk_mbrQsUXjdhchRAaGGzpZHCJ87D3z3wP6DzEOyyUys0ZwivDdnCIylYt6zuAvmTeB_uREnwHQDN3zOCL3vpy_2zazDbOtOmmUpayjOI2fU52sK4OMGHHhaTvsmKOt4J12TJI1UlvWRR3fEWuVToiGYwT_yuEoPB9_OmjVKPSZoiSzQ5202hdMTfzRqc0JeQnOPqqwwJb1OuKvC1qVxtZgaWhmyUrVNLxxnDOWJGTZ2fGg-NZ-JO-hLzOIU2YaJAPA" }}
        style={styles.mapImageLarge}
      />
      <View style={styles.mapOverlay} />
      
      {filteredAndSortedOrders.map((order) => {
        const mockPos = MOCK_MARKERS.find(m => m.id === order.id) || MOCK_MARKERS[0];
        return (
          <TouchableOpacity 
            key={`marker-${order.id}`}
            style={[styles.markerContainer, { top: mockPos.top, right: mockPos.right }]}
            onPress={() => onNavigate(Screen.ORDER_DETAILS)}
          >
            <View style={[styles.markerBubble, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
               <Text style={[styles.markerPrice, { color: colors.primary }]}>{order.price}</Text>
               <View style={[styles.markerIconBox, { backgroundColor: colors.primary }]}>
                  <Text style={styles.markerIcon}>{getStoreIcon(order.stores[0])}</Text>
               </View>
            </View>
            <View style={[styles.markerTail, { borderTopColor: colors.primary }]} />
          </TouchableOpacity>
        );
      })}

      <View style={styles.mapFloatingInfo}>
        <View style={[styles.infoPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.infoPillText, { color: colors.text }]}>{filteredAndSortedOrders.length} طلبات متاحة حالياً</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>الطلبات</Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>أنت متصل وتبحث عن رحلات</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.viewToggle, { backgroundColor: colors.surface, borderColor: colors.border }]} 
              onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            >
              <Text style={[styles.toggleIcon, { color: colors.primary }]}>
                {viewMode === 'list' ? 'map' : 'view_list'}
              </Text>
              <Text style={[styles.toggleText, { color: colors.text }]}>
                {viewMode === 'list' ? 'الخريطة' : 'القائمة'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {viewMode === 'list' && (
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
            </ScrollView>
          </View>
        )}
      </View>

      {viewMode === 'list' ? (
        <ScrollView contentContainerStyle={styles.listContent}>
          {hasPendingFeedback && (
            <View style={[styles.feedbackTeaser, { backgroundColor: colors.surface, borderColor: colors.primarySoft }]}>
              <View style={styles.teaserHeader}>
                <View style={[styles.teaserIconBox, { backgroundColor: colors.primarySoft }]}>
                  <Text style={[styles.teaserIcon, { color: colors.primary }]}>reviews</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.teaserTitle, { color: colors.text }]}>كيف كانت رحلتك الأخيرة؟</Text>
                  <Text style={[styles.teaserSubtitle, { color: colors.subtext }]}>رأيك يهمنا لتحسين تجربة العمل</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.rateActionBtn, { backgroundColor: colors.primary }]}
                onPress={() => setShowFeedbackModal(true)}
              >
                <Text style={styles.rateActionText}>تقييم الآن</Text>
                <Text style={styles.rateActionIcon}>star</Text>
              </TouchableOpacity>
            </View>
          )}

          {filteredAndSortedOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyIcon, { color: colors.border }]}>search_off</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>لا توجد نتائج</Text>
            </View>
          ) : (
            filteredAndSortedOrders.map(renderOrderCard)
          )}
        </ScrollView>
      ) : renderMapView()}

      <Modal visible={showFeedbackModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowFeedbackModal(false)}>
                <Text style={[styles.closeModalIcon, { color: colors.subtext }]}>close</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>تقييم التجربة</Text>
              <View style={{ width: 24 }} />
            </View>

            {feedbackSubmitted ? (
              <View style={styles.successState}>
                <View style={[styles.successCircle, { backgroundColor: colors.primarySoft }]}>
                  <Text style={[styles.successIcon, { color: colors.primary }]}>check_circle</Text>
                </View>
                <Text style={[styles.successTitle, { color: colors.text }]}>شكراً لك!</Text>
                <Text style={[styles.successSubtitle, { color: colors.subtext }]}>تم إرسال تقييمك بنجاح</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.ratingSection}>
                  <Text style={[styles.ratingLabel, { color: colors.subtext }]}>كيف تقيم رحلتك الأخيرة؟</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <TouchableOpacity key={s} onPress={() => setRating(s)}>
                        <Text style={[
                          styles.starIconLarge, 
                          { color: s <= rating ? '#facc15' : colors.border }
                        ]}>
                          {s <= rating ? 'star' : 'star_border'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.tagsSection}>
                  <Text style={[styles.ratingLabel, { color: colors.subtext }]}>ما الذي أعجبك؟</Text>
                  <View style={styles.tagsGrid}>
                    {FEEDBACK_TAGS.map(tag => (
                      <TouchableOpacity 
                        key={tag} 
                        style={[
                          styles.tagChip, 
                          { borderColor: colors.border },
                          selectedTags.includes(tag) && { backgroundColor: colors.primarySoft, borderColor: colors.primary }
                        ]}
                        onPress={() => toggleTag(tag)}
                      >
                        <Text style={[
                          styles.tagText, 
                          { color: selectedTags.includes(tag) ? colors.primary : colors.subtext }
                        ]}>{tag}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.commentSection}>
                   <Text style={[styles.ratingLabel, { color: colors.subtext }]}>ملاحظات إضافية (اختياري)</Text>
                   <TextInput 
                     style={[styles.commentInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                     placeholder="اكتب تعليقك هنا..."
                     placeholderTextColor={colors.subtext}
                     multiline
                     numberOfLines={4}
                   />
                </View>

                <TouchableOpacity 
                  style={[styles.submitBtn, { backgroundColor: rating > 0 ? colors.primary : colors.border }]}
                  disabled={rating === 0}
                  onPress={handleSubmitFeedback}
                >
                  <Text style={[styles.submitBtnText, { color: rating > 0 ? '#112117' : colors.subtext }]}>إرسال التقييم</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

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
  headerActions: { flexDirection: 'row-reverse', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'right', fontFamily: 'Cairo' },
  subtitle: { fontSize: 13, textAlign: 'right', fontFamily: 'Cairo', marginTop: 2 },
  viewToggle: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, gap: 8 },
  toggleIcon: { fontFamily: 'Material Icons Round', fontSize: 18 },
  toggleText: { fontSize: 12, fontWeight: 'bold', fontFamily: 'Cairo' },
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
  listContent: { padding: 20, paddingBottom: 120 },
  feedbackTeaser: { borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderStyle: 'dashed' },
  teaserHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 16 },
  teaserIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  teaserIcon: { fontFamily: 'Material Icons Round', fontSize: 24 },
  teaserTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', fontFamily: 'Cairo' },
  teaserSubtitle: { fontSize: 12, textAlign: 'right', fontFamily: 'Cairo' },
  rateActionBtn: { height: 44, borderRadius: 12, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 8 },
  rateActionText: { color: '#112117', fontWeight: 'bold', fontSize: 14, fontFamily: 'Cairo' },
  rateActionIcon: { fontFamily: 'Material Icons Round', fontSize: 18, color: '#112117' },
  orderCard: { borderRadius: 24, padding: 20, borderRightWidth: 4, marginBottom: 16 },
  cardTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start' },
  storeIcons: { flexDirection: 'row' },
  storeIcon: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  storeIconCount: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginLeft: -15, zIndex: 1 },
  storeCountText: { fontSize: 12, fontWeight: 'bold' },
  iconLunch: { fontFamily: 'Material Icons Round', fontSize: 22 },
  priceContainer: { alignItems: 'flex-start' },
  priceText: { fontSize: 26, fontWeight: '900' },
  currencyText: { fontSize: 12, fontWeight: '400' },
  tipText: { fontSize: 10, marginTop: 2 },
  cardMiddle: { marginVertical: 15 },
  storeNameText: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', fontFamily: 'Cairo' },
  metaRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  metaItem: { flexDirection: 'row-reverse', alignItems: 'center' },
  metaIcon: { fontFamily: 'Material Icons Round', fontSize: 14, marginLeft: 6 },
  metaText: { fontSize: 12 },
  detailsButton: { height: 54, borderRadius: 16, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center' },
  detailsButtonText: { fontWeight: '900', fontSize: 16, marginLeft: 8, fontFamily: 'Cairo' },
  detailsButtonIcon: { fontFamily: 'Material Icons Round', fontSize: 20 },
  mapViewContainer: { flex: 1, position: 'relative' },
  mapImageLarge: { width: '100%', height: '100%', opacity: 0.5 },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  markerContainer: { position: 'absolute', alignItems: 'center', zIndex: 10 },
  markerBubble: { flexDirection: 'row-reverse', alignItems: 'center', padding: 4, paddingLeft: 12, borderRadius: 20, borderWidth: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
  markerPrice: { fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
  markerIconBox: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  markerIcon: { fontFamily: 'Material Icons Round', fontSize: 16, color: '#112117' },
  markerTail: { width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -2 },
  mapFloatingInfo: { position: 'absolute', bottom: 100, alignSelf: 'center' },
  infoPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 },
  infoPillText: { fontSize: 13, fontWeight: 'bold', fontFamily: 'Cairo' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  closeModalIcon: { fontFamily: 'Material Icons Round', fontSize: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', fontFamily: 'Cairo' },
  ratingSection: { alignItems: 'center', marginBottom: 32 },
  ratingLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 12, fontFamily: 'Cairo', textAlign: 'right', width: '100%' },
  starsRow: { flexDirection: 'row', gap: 12 },
  starIconLarge: { fontFamily: 'Material Icons Round', fontSize: 44 },
  tagsSection: { marginBottom: 32 },
  tagsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  tagChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: 'bold', fontFamily: 'Cairo' },
  commentSection: { marginBottom: 32 },
  commentInput: { borderRadius: 16, borderWidth: 1, padding: 16, textAlign: 'right', fontFamily: 'Cairo', minHeight: 100 },
  submitBtn: { height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { fontSize: 18, fontWeight: 'bold', fontFamily: 'Cairo' },
  successState: { alignItems: 'center', paddingVertical: 40 },
  successCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successIcon: { fontFamily: 'Material Icons Round', fontSize: 48 },
  successTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, fontFamily: 'Cairo' },
  successSubtitle: { fontSize: 14, fontFamily: 'Cairo' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyIcon: { fontFamily: 'Material Icons Round', fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', fontFamily: 'Cairo' },
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
