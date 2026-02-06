import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, useColorScheme, Pressable, Dimensions, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFunds } from '@/store/FundContext';
import { FundData, Holding } from '@/types';
import { Eye, EyeOff, Wallet, PieChart as PieChartIcon } from 'lucide-react-native';
import { PieChart } from 'react-native-chart-kit';
import { ThemedText, ThemedView } from '@/components/Themed';

const { width } = Dimensions.get('window');

export default function HoldingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { holdings } = useFunds();

  const [showAmounts, setShowAmounts] = useState(true);
  const [showChart, setShowChart] = useState(false);

  const summary = useMemo(() => {
    let totalAssets = 0;
    let totalDailyProfit = 0;
    let totalHoldingProfit = 0;

    holdings.forEach(fund => {
      totalAssets += fund.holdingValue || 0;
      totalDailyProfit += fund.dailyProfit || 0;
      totalHoldingProfit += fund.holdingProfit || 0;
    });

    return { totalAssets, totalDailyProfit, totalHoldingProfit };
  }, [holdings]);

  const pieData = useMemo(() => {
    const typeGroups: Record<string, number> = {};
    holdings.forEach(h => {
      const type = h.type || '其他';
      typeGroups[type] = (typeGroups[type] || 0) + (h.holdingValue || 0);
    });

    const colors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5856D6'];
    return Object.keys(typeGroups).map((type, index) => ({
      name: type,
      population: typeGroups[type],
      color: colors[index % colors.length],
      legendFontColor: theme.text,
      legendFontSize: 12,
    }));
  }, [holdings, theme.text]);

  const renderItem = ({ item }: { item: Holding }) => {
    const isDailyUp = (item.dailyProfit || 0) >= 0;
    const isHoldingUp = (item.holdingProfit || 0) >= 0;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
          pressed && { opacity: 0.7 }
        ]}
        onPress={() => router.push(`/fund/${item.code}`)}
      >
        <View style={styles.cardHeader}>
          <ThemedText type="defaultSemiBold" style={styles.fundName} numberOfLines={1}>{item.name || item.code}</ThemedText>
          <ThemedText type="caption" style={{ color: theme.secondaryText }}>{item.code}</ThemedText>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.cardItem}>
            <ThemedText type="caption" style={{ color: theme.secondaryText, marginBottom: 4 }}>持有金额</ThemedText>
            <ThemedText type="defaultSemiBold">
              {showAmounts ? (item.holdingValue || 0).toFixed(2) : '****'}
            </ThemedText>
          </View>
          <View style={[styles.cardItem, { alignItems: 'center' }]}>
             <ThemedText type="caption" style={{ color: theme.secondaryText, marginBottom: 4 }}>持有收益</ThemedText>
             <ThemedText type="defaultSemiBold" style={{ color: isHoldingUp ? theme.up : theme.down }}>
               {showAmounts ? (item.holdingProfit || 0).toFixed(2) : '****'}
             </ThemedText>
          </View>
          <View style={[styles.cardItem, { alignItems: 'flex-end' }]}>
            <ThemedText type="caption" style={{ color: theme.secondaryText, marginBottom: 4 }}>当日收益</ThemedText>
            <ThemedText type="defaultSemiBold" style={{ color: isDailyUp ? theme.up : theme.down }}>
              {showAmounts ? (item.dailyProfit || 0).toFixed(2) : '****'}
            </ThemedText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">持有资产</ThemedText>
        <View style={styles.headerActions}>
          <Pressable onPress={() => setShowChart(!showChart)} style={styles.headerActionBtn}>
            <PieChartIcon size={22} color={showChart ? theme.tint : theme.text} />
          </Pressable>
          <Pressable onPress={() => setShowAmounts(!showAmounts)} style={styles.headerActionBtn}>
            {showAmounts ? <Eye size={22} color={theme.text} /> : <EyeOff size={22} color={theme.text} />}
          </Pressable>
        </View>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: theme.tint }]}>
        <View style={styles.summaryHeader}>
           <ThemedText style={styles.summaryLabel}>总资产 (元)</ThemedText>
           <Wallet size={20} color="white" opacity={0.8} />
        </View>
        <ThemedText type="title" style={styles.totalAssets}>
          {showAmounts ? summary.totalAssets.toFixed(2) : '****'}
        </ThemedText>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabelSmall}>当日盈亏</ThemedText>
            <ThemedText style={styles.summaryValueSmall}>
              {showAmounts ? (summary.totalDailyProfit > 0 ? '+' : '') + summary.totalDailyProfit.toFixed(2) : '****'}
            </ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabelSmall}>持有盈亏</ThemedText>
            <ThemedText style={styles.summaryValueSmall}>
              {showAmounts ? (summary.totalHoldingProfit > 0 ? '+' : '') + summary.totalHoldingProfit.toFixed(2) : '****'}
            </ThemedText>
          </View>
        </View>
      </View>

      <FlatList
        data={holdings}
        renderItem={renderItem}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          showChart && holdings.length > 0 ? (
            <View style={[styles.chartContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <ThemedText type="defaultSemiBold" style={{ marginBottom: 12 }}>资产分布</ThemedText>
              <PieChart
                data={pieData}
                width={width - 64} // Adjusted width
                height={160}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute={false}
                hasLegend={true}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
             <ThemedText style={{ color: theme.secondaryText, marginBottom: 8 }}>暂无持仓</ThemedText>
             <ThemedText type="caption" style={{ color: theme.secondaryText }}>请在自选详情中添加持仓</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerActionBtn: {
    padding: 4,
  },
  summaryCard: {
    margin: 16,
    borderRadius: 20, // Apple style rounded corners
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  totalAssets: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  summaryLabelSmall: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValueSmall: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fundName: {
    flex: 1,
    marginRight: 8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardItem: {
    flex: 1,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
