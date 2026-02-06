import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Animated, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchMarketIndices, StockPrice } from '@/api';
import { Activity } from 'lucide-react-native';
import { ThemedText, ThemedView } from '@/components/Themed';

const SkeletonItem = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.skeletonCard, { opacity, backgroundColor: '#E1E9EE' }]} />
  );
};

export default function MarketScreen() {
  const [indices, setIndices] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const loadData = async () => {
    try {
      const data = await fetchMarketIndices();
      setIndices(Object.values(data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderIndexCard = (item: StockPrice) => {
    const isUp = item.percent >= 0;
    return (
      <View key={item.code} style={[styles.indexCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <ThemedText type="caption" style={{ color: theme.secondaryText, marginBottom: 8 }}>{item.name}</ThemedText>
        <ThemedText type="title" style={{ fontSize: 22, lineHeight: 26, marginBottom: 4 }}>
          {item.price.toFixed(2)}
        </ThemedText>
        <View style={styles.indexChangeRow}>
          <ThemedText style={{ fontSize: 13, fontWeight: '600', color: isUp ? theme.up : theme.down }}>
            {isUp ? '+' : ''}{item.change.toFixed(2)}
          </ThemedText>
          <ThemedText style={{ fontSize: 13, fontWeight: '600', color: isUp ? theme.up : theme.down }}>
            {isUp ? '+' : ''}{(item.percent * 100).toFixed(2)}%
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">市场行情</ThemedText>
        <Activity size={20} color={theme.secondaryText} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />}
      >
        <View style={styles.grid}>
          {loading ? (
            [1, 2, 3, 4].map(i => <SkeletonItem key={i} />)
          ) : (
            indices.map(renderIndexCard)
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>板块监控</ThemedText>
          <View style={[styles.placeholderCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
             <ThemedText style={{ color: theme.secondaryText }}>更多行情数据对接中...</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  indexCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 110,
    justifyContent: 'center',
  },
  skeletonCard: {
    width: '48%',
    height: 110,
    borderRadius: 16,
  },
  indexChangeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  placeholderCard: {
    padding: 30,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  }
});
