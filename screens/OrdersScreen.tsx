
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal, TextInput, Animated, Image, Dimensions, Easing, LayoutChangeEvent } from 'react-native';
import { Screen, Order } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useWebSocket } from '../context/WebSocketContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const INITIAL_ORDERS: Order[] = [
  { id: '1', price: '45.50', stores: ['برجر بالاس'], distance: '3.2', time: '25', type: 'Multi', status: 'Available' },
  { id: '1b', price: '32.00', stores: ['برجر بالاس'], distance: '3.2', time: '20', type: 'Single', status: 'Available' },
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

const MOCK_MARKER_POSITIONS: Record<string, { top: number, right: number }> = {
  '1': { top: 30, right: 20 },
  '1b': { top: 30, right: 20 },
  '2': { top: 45, right: 62 },
  '3': { top: 72, right: 35 },
  '4': { top: 25, right: 75 },
  '5': { top: 62, right: 18 },
  '6': { top: 15, right: 42 },
};

interface OrdersScreenProps {
  onNavigate: (s: Screen) => void;
}

const OrdersScreen: React.FC<OrdersScreenProps> = ({ onNavigate }) => {
  const { colors, mode } = useTheme();
  const { socket } = useWebSocket();
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'time'>('price');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(null);
  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [hasPendingFeedback, setHasPendingFeedback] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tooltipScale = useRef(new Animated.Value(0)).current;
  const mapScale = useRef(new Animated.Value(1)).current;
  const mapTranslateX = useRef(new Animated.Value(0)).current;
  const mapTranslateY = useRef(new Animated.Value(0)).current;
  
  const mapLayout = useRef({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }).current;

  // Real-time WebSocket Listeners
  useEffect(() => {
    const handleOrderTaken = (data: { orderId: string }) => {
      setOrders(current => current.filter(o => o.id !== data.orderId));
      if (selectedMarkerIndex !== null) {
        setSelectedMarkerIndex(null);
      }
    };

    const handleNewOrder = (newOrder: Order) => {
      setOrders(current => {
        if (current.find(o => o.id === newOrder.id)) return current;
        return [newOrder, ...current];
      });
    };

    const offOrderTaken = socket.on('order_taken', handleOrderTaken);
    const offNewOrder = socket.on('new_order', handleNewOrder);

    return () => {
      offOrderTaken();
      offNewOrder();
    };
  }, [socket, selectedMarkerIndex]);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [viewMode]);

  useEffect(() => {
    if (selectedMarkerIndex !== null) {
      tooltipScale.setValue(0);
      Animated.spring(tooltipScale, { toValue: 1, friction: 8, tension: 120, useNativeDriver: true }).start();
    }
  }, [selectedMarkerIndex]);

  const onMapLayout = (e: LayoutChangeEvent) => {
    mapLayout.width = e.nativeEvent.layout.width;
    mapLayout.height = e.nativeEvent.layout.height;
  };

  const animateMap = (toScale: number, toX: number, toY: number) => {
    Animated.parallel([
      Animated.spring(mapScale, { 
        toValue: toScale, 
        friction: 9, 
        tension: 35, 
        useNativeDriver: true 
      }),
      Animated.spring(mapTranslateX, { 
        toValue: toX, 
        friction: 9, 
        tension: 35, 
        useNativeDriver: true 
      }),
      Animated.spring(mapTranslateY, { 
        toValue: toY, 
        friction: 9, 
        tension: 35, 
        useNativeDriver: true 
      }),
    ]).start();
  };

  const toggleView = () => {
    fadeAnim.setValue(0);
    setSelectedMarkerIndex(null);
    if (viewMode === 'map') {
      animateMap(1, 0, 0);
      setZoomLevel(1);
    }
    setViewMode(prev => prev === 'list' ? 'map' : 'list');
  };

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];
    result.sort((a, b) => {
      if (sortBy === 'price') return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === 'time') return parseInt(a.time) - parseInt(b.time);
      return 0;
    });
    return result;
  }, [orders, sortBy]);

  const clusters = useMemo(() => {
    const CLUSTER_THRESHOLD = 15 / zoomLevel; 
    const groups: { orders: Order[], top: number, right: number, isSameStore: boolean, storeName: string }[] = [];

    filteredAndSortedOrders.forEach(order => {
      const pos = MOCK_MARKER_POSITIONS[order.id] || { 
        top: 20 + (parseInt(order.id, 36) % 60), 
        right: 15 + (parseInt(order.id, 36) % 70) 
      };
      
      let addedToCluster = false;
      for (const group of groups) {
        const dx = Math.abs(group.right - pos.right);
        const dy = Math.abs(group.top - pos.top);
        if (dx < CLUSTER_THRESHOLD && dy < CLUSTER_THRESHOLD) {
          group.orders.push(order);
          group.isSameStore = group.orders.every(o => o.stores[0] === group.orders[0].stores[0]);
          group.storeName = group.orders[0].stores[0];
          addedToCluster = true;
          break;
        }
      }

      if (!addedToCluster) {
        groups.push({ 
          orders: [order], 
          top: pos.top, 
          right: pos.right, 
          isSameStore: true, 
          storeName: order.stores[0] 
        });
      }
    });

    return groups;
  }, [filteredAndSortedOrders, zoomLevel]);

  const handleMarkerPress = (index: number) => {
    const cluster = clusters[index];
    const isCluster = cluster.orders.length > 1;

    if (selectedMarkerIndex === index && !isCluster) {
      setSelectedMarkerIndex(null);
      animateMap(zoomLevel, 0, 0);
    } else {
      setSelectedMarkerIndex(index);
      
      // If it's a cluster, zoom in significantly to "expand" it
      const targetZoom = isCluster ? Math.min(zoomLevel + 0.8, 3) : Math.max(zoomLevel, 1.3);
      
      const markerX = mapLayout.width - (mapLayout.width * cluster.right / 100);
      const markerY = mapLayout.height * cluster.top / 100;
      
      const targetX = (mapLayout.width / 2) / targetZoom - markerX;
      const targetY = (mapLayout.height / 2) / targetZoom - markerY;

      setZoomLevel(targetZoom);
      animateMap(targetZoom, targetX, targetY);
    }
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(1, Math.min(zoomLevel + delta, 3));
    setZoomLevel(newZoom);
    setSelectedMarkerIndex(null);
    animateMap(newZoom, 0, 0);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
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
            <View key={`${order.id}-${store}`} style={[styles.storeIcon, { zIndex: 10 - index, backgroundColor: colors.background, borderColor: colors.border, marginLeft: index === 0 ? 0 : -15 }]}>
               <Text style={[styles.iconLunch, { color: colors.primary }]}>{getStoreIcon(store)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, { color: colors.primary }]}>{order.price} <Text style={styles.currencyText}>ر.س</Text></Text>
          <Text style={[styles.tipText, { color: colors.subtext }]}>صافي ربحك</Text>
        </View>
      </View>
      <View style={styles.cardMiddle}>
        <Text style={[styles.storeNameText, { color: colors.text }]}>{order.stores.join(' & ')}</Text>
        <View style={styles.metaRow}><View style={styles.metaItem}><Text style={[styles.metaIcon, { color: colors.subtext }]}>near_me</Text><Text style={[styles.metaText, { color: colors.subtext }]}>{order.distance} كم</Text></View></View>
      </View>
      <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.primarySoft, borderColor: colors.primary, borderWidth: 1 }]} onPress={() => onNavigate(Screen.ORDER_DETAILS)}>
        <Text style={[styles.detailsButtonText, { color: colors.primary }]}>تفاصيل الطلب</Text>
        <Text style={[styles.detailsButtonIcon, { color: colors.primary }]}>info_outline</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMapView = () => (
    <Animated.View 
      style={[styles.mapViewContainer, { opacity: fadeAnim }]}
      onLayout={onMapLayout}
    >
      <Animated.View style={[
        styles.mapContentWrapper, 
        { 
          transform: [
            { scale: mapScale },
            { translateX: mapTranslateX },
            { translateY: mapTranslateY }
          ] 
        }
      ]}>
        <Image 
          source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZNpZ0yW6Jk_mbrQsUXjdhchRAaGGzpZHCJ87D3z3wP6DzEOyyUys0ZwivDdnCIylYt6zuAvmTeB_uREnwHQDN3zOCL3vpy_2zazDbOtOmmUpayjOI2fU52sK4OMGHHhaTvsmKOt4J12TJI1UlvWRR3fEWuVToiGYwT_yuEoPB9_OmjVKPSZoiSzQ5202hdMTfzRqc0JeQnOPqqwwJb1OuKvC1qVxtZgaWhmyUrVNLxxnDOWJGTZ2fGg-NZ-JO-hLzOIU2YaJAPA" }} 
          style={styles.mapImageLarge} 
        />
        <View style={styles.mapOverlay} />
        
        {clusters.map((cluster, index) => {
          const isCluster = cluster.orders.length > 1;
          const totalEarning = cluster.orders.reduce((sum, o) => sum + parseFloat(o.price), 0);
          const mainOrder = cluster.orders[0];
          const isSelected = selectedMarkerIndex === index;

          const counterScale = mapScale.interpolate({
            inputRange: [1, 3],
            outputRange: [1, 0.6],
            extrapolate: 'clamp'
          });

          return (
            <TouchableOpacity 
              key={`marker-group-${index}`}
              activeOpacity={0.9}
              style={[styles.markerContainer, { top: `${cluster.top}%`, right: `${cluster.right}%` }]}
              onPress={() => handleMarkerPress(index)}
            >
              {isSelected && (
                <Animated.View style={[
                  styles.calloutContainer, 
                  { 
                    backgroundColor: colors.surface, 
                    borderColor: colors.primary, 
                    transform: [
                      { scale: tooltipScale }, 
                      { translateY: -85 },
                      { scale: counterScale }
                    ] 
                  }
                ]}>
                  <View style={styles.calloutContent}>
                    <Text style={[styles.calloutStoreName, { color: colors.text }]}>{isCluster ? (cluster.isSameStore ? `من متجر ${cluster.storeName}` : 'مجموعة طلبات') : mainOrder.stores[0]}</Text>
                    <View style={styles.calloutPriceRow}>
                      <Text style={[styles.calloutPrice, { color: colors.primary }]}>{totalEarning.toFixed(2)} <Text style={styles.calloutCurrency}>ر.س</Text></Text>
                      {isCluster && <Text style={[styles.calloutCount, { color: colors.subtext }]}>{cluster.orders.length} طلبات</Text>}
                    </View>
                    <TouchableOpacity style={[styles.calloutAction, { backgroundColor: colors.primary }]} onPress={() => onNavigate(Screen.ORDER_DETAILS)}>
                      <Text style={styles.calloutActionText}>عرض التفاصيل</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.tooltipArrow, { borderTopColor: colors.primary }]} />
                </Animated.View>
              )}

              <Animated.View style={{ transform: [{ scale: counterScale }] }}>
                {isCluster ? (
                  <View style={[
                    styles.clusterMarker, 
                    { 
                      backgroundColor: cluster.isSameStore ? colors.primary : '#2563eb', 
                      borderColor: colors.surface,
                      transform: [{ scale: isSelected ? 1.2 : 1 }]
                    }
                  ]}>
                    <Text style={styles.clusterText}>{cluster.orders.length}</Text>
                    {cluster.isSameStore && (
                      <Text style={[styles.miniStoreIcon, { color: '#112117' }]}>{getStoreIcon(cluster.storeName)}</Text>
                    )}
                    <View style={[styles.clusterPulse, { borderColor: cluster.isSameStore ? colors.primary : '#2563eb' }]} />
                  </View>
                ) : (
                  <View style={[styles.markerBubble, { backgroundColor: colors.surface, borderColor: isSelected ? colors.primary : colors.border, transform: [{ scale: isSelected ? 1.15 : 1 }] }]}>
                    <Text style={[styles.markerPrice, { color: isSelected ? colors.primary : colors.text }]}>{mainOrder.price}</Text>
                    <View style={[styles.markerIconBox, { backgroundColor: isSelected ? colors.primary : colors.surfaceAlt }]}>
                        <Text style={[styles.markerIcon, { color: isSelected ? '#112117' : colors.primary }]}>{getStoreIcon(mainOrder.stores[0])}</Text>
                    </View>
                    <View style={[styles.markerTail, { borderTopColor: isSelected ? colors.primary : colors.border }]} />
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      <View style={styles.mapControls}>
        <TouchableOpacity style={[styles.mapCtrlBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => handleZoom(0.5)}><Text style={[styles.mapCtrlIcon, { color: colors.text }]}>add</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.mapCtrlBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => handleZoom(-0.5)}><Text style={[styles.mapCtrlIcon, { color: colors.text }]}>remove</Text></TouchableOpacity>
      </View>
      <View style={styles.mapFloatingInfo}><View style={[styles.infoPill, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.infoPillText, { color: colors.text }]}>{filteredAndSortedOrders.length} طلبات متاحة</Text></View></View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <View><Text style={[styles.title, { color: colors.text }]}>الطلبات</Text><Text style={[styles.subtitle, { color: colors.subtext }]}>أنت متصل وتبحث عن رحلات</Text></View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.viewToggle, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={toggleView}>
              <Text style={[styles.toggleIcon, { color: colors.primary }]}>{viewMode === 'list' ? 'map' : 'view_list'}</Text>
              <Text style={[styles.toggleText, { color: colors.text }]}>{viewMode === 'list' ? 'الخريطة' : 'القائمة'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {viewMode === 'list' && (
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.subtext }]}>ترتيب حسب</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ flexDirection: 'row-reverse' }}>
              <TouchableOpacity style={[styles.sortPill, sortBy === 'price' && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => setSortBy('price')}><Text style={[styles.sortIcon, { color: sortBy === 'price' ? '#112117' : colors.subtext }]}>payments</Text><Text style={[styles.sortText, { color: sortBy === 'price' ? '#112117' : colors.subtext }]}>الأعلى سعراً</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.sortPill, sortBy === 'distance' && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => setSortBy('distance')}><Text style={[styles.sortIcon, { color: sortBy === 'distance' ? '#112117' : colors.subtext }]}>near_me</Text><Text style={[styles.sortText, { color: sortBy === 'distance' ? '#112117' : colors.subtext }]}>الأقرب مسافة</Text></TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </View>

      {viewMode === 'list' ? (
        <Animated.ScrollView contentContainerStyle={styles.listContent} style={{ opacity: fadeAnim }}>
          {hasPendingFeedback && (
            <View style={[styles.feedbackTeaser, { backgroundColor: colors.surface, borderColor: colors.primarySoft }]}>
              <View style={styles.teaserHeader}><View style={[styles.teaserIconBox, { backgroundColor: colors.primarySoft }]}><Text style={[styles.teaserIcon, { color: colors.primary }]}>reviews</Text></View><View style={{ flex: 1 }}><Text style={[styles.teaserTitle, { color: colors.text }]}>كيف كانت رحلتك الأخيرة؟</Text><Text style={[styles.teaserSubtitle, { color: colors.subtext }]}>رأيك يهمنا لتحسين تجربة العمل</Text></View></View>
              <TouchableOpacity style={[styles.rateActionBtn, { backgroundColor: colors.primary }]} onPress={() => setShowFeedbackModal(true)}><Text style={styles.rateActionText}>تقييم الآن</Text><Text style={styles.rateActionIcon}>star</Text></TouchableOpacity>
            </View>
          )}
          {filteredAndSortedOrders.length === 0 ? (
            <View style={styles.emptyState}><Text style={[styles.emptyIcon, { color: colors.border }]}>search_off</Text><Text style={[styles.emptyTitle, { color: colors.text }]}>لا توجد نتائج</Text></View>
          ) : (
            filteredAndSortedOrders.map(renderOrderCard)
          )}
        </Animated.ScrollView>
      ) : renderMapView()}

      <Modal visible={showFeedbackModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}><TouchableOpacity onPress={() => setShowFeedbackModal(false)}><Text style={[styles.closeModalIcon, { color: colors.subtext }]}>close</Text></TouchableOpacity><Text style={[styles.modalTitle, { color: colors.text }]}>تقييم التجربة</Text><View style={{ width: 24 }} /></View>
            {feedbackSubmitted ? (
              <View style={styles.successState}><View style={[styles.successCircle, { backgroundColor: colors.primarySoft }]}><Text style={[styles.successIcon, { color: colors.primary }]}>check_circle</Text></View><Text style={[styles.successTitle, { color: colors.text }]}>شكراً لك!</Text><Text style={[styles.successSubtitle, { color: colors.subtext }]}>تم إرسال تقييمك بنجاح</Text></View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.ratingSection}><Text style={[styles.ratingLabel, { color: colors.subtext }]}>كيف تقيم رحلتك الأخيرة؟</Text><View style={styles.starsRow}>{[1, 2, 3, 4, 5].map((s) => (<TouchableOpacity key={s} onPress={() => setRating(s)}><Text style={[styles.starIconLarge, { color: s <= rating ? '#facc15' : colors.border }]}>{s <= rating ? 'star' : 'star_border'}</Text></TouchableOpacity>))}</View></View>
                <View style={styles.tagsSection}><Text style={[styles.ratingLabel, { color: colors.subtext }]}>ما الذي أعجبك؟</Text><View style={styles.tagsGrid}>{FEEDBACK_TAGS.map(tag => (<TouchableOpacity key={tag} style={[styles.tagChip, { borderColor: colors.border }, selectedTags.includes(tag) && { backgroundColor: colors.primarySoft, borderColor: colors.primary }]} onPress={() => toggleTag(tag)}><Text style={[styles.tagText, { color: selectedTags.includes(tag) ? colors.primary : colors.subtext }]}>{tag}</Text></TouchableOpacity>))}</View></View>
                <View style={styles.commentSection}><Text style={[styles.ratingLabel, { color: colors.subtext }]}>ملاحظات إضافية (اختياري)</Text><TextInput style={[styles.commentInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]} placeholder="اكتب تعليقك هنا..." placeholderTextColor={colors.subtext} multiline numberOfLines={4} /></View>
                <TouchableOpacity style={[styles.submitBtn, { backgroundColor: rating > 0 ? colors.primary : colors.border }]} disabled={rating === 0} onPress={handleSubmitFeedback}><Text style={[styles.submitBtnText, { color: rating > 0 ? '#112117' : colors.subtext }]}>إرسال التقييم</Text></TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <View style={[styles.navBar, { backgroundColor: colors.nav, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(Screen.DASHBOARD)}><Text style={[styles.navIcon, { color: colors.subtext }]}>dashboard</Text><Text style={[styles.navText, { color: colors.subtext }]}>الرئيسية</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(Screen.ORDERS)}><View style={[styles.navItemActive, { backgroundColor: colors.primarySoft }]}><Text style={[styles.navIconActive, { color: colors.primary }]}>receipt_long</Text></View><Text style={[styles.navTextActive, { color: colors.primary }]}>الطلبات</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary, borderColor: colors.background }]}><Text style={styles.fabIcon}>qr_code_scanner</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(Screen.PAYMENT)}><Text style={[styles.navIcon, { color: colors.subtext }]}>payments</Text><Text style={[styles.navText, { color: colors.subtext }]}>الأرباح</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate(Screen.PROFILE)}><Text style={[styles.navIcon, { color: colors.subtext }]}>person</Text><Text style={[styles.navText, { color: colors.subtext }]}>حسابي</Text></TouchableOpacity>
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
  sortPill: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'transparent', backgroundColor: 'rgba(255,255,255,0.05)', marginLeft: 10 },
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
  mapViewContainer: { flex: 1, position: 'relative', overflow: 'hidden' },
  mapContentWrapper: { flex: 1, position: 'relative' },
  mapImageLarge: { width: '100%', height: '100%', opacity: 0.5 },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  markerContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  markerBubble: { flexDirection: 'row-reverse', alignItems: 'center', padding: 4, paddingLeft: 12, borderRadius: 20, borderWidth: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
  markerPrice: { fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
  markerIconBox: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  markerIcon: { fontFamily: 'Material Icons Round', fontSize: 16 },
  markerTail: { position: 'absolute', bottom: -8, right: '50%', transform: [{translateX: 6}], width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  clusterMarker: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 5, elevation: 8 },
  miniStoreIcon: { fontFamily: 'Material Icons Round', fontSize: 12, position: 'absolute', bottom: -5 },
  clusterText: { color: '#112117', fontSize: 18, fontWeight: '900' },
  clusterPulse: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 2, opacity: 0.3 },
  calloutContainer: { position: 'absolute', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 20, borderWidth: 1.5, alignItems: 'center', minWidth: 200, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 15, zIndex: 100 },
  calloutContent: { width: '100%', alignItems: 'center' },
  calloutStoreName: { fontSize: 14, fontWeight: 'bold', fontFamily: 'Cairo', marginBottom: 4, textAlign: 'center' },
  calloutPriceRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  calloutPrice: { fontSize: 20, fontWeight: '900', fontFamily: 'Cairo' },
  calloutCurrency: { fontSize: 10 },
  calloutCount: { fontSize: 10, fontFamily: 'Cairo', opacity: 0.7 },
  calloutAction: { width: '100%', height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  calloutActionText: { color: '#112117', fontSize: 12, fontWeight: 'bold', fontFamily: 'Cairo' },
  tooltipArrow: { position: 'absolute', bottom: -9, width: 0, height: 0, borderLeftWidth: 9, borderRightWidth: 9, borderTopWidth: 9, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  mapControls: { position: 'absolute', right: 20, top: 20, gap: 10, zIndex: 20 },
  mapCtrlBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  mapCtrlIcon: { fontFamily: 'Material Icons Round', fontSize: 24 },
  mapFloatingInfo: { position: 'absolute', bottom: 100, alignSelf: 'center', zIndex: 20 },
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
