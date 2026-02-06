import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, useColorScheme, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { ThemedText, ThemedView, AppleButton } from '@/components/Themed';
import { useFunds } from '@/store/FundContext';
import { Fund } from '@/types';
import { fetchFundHistory, searchFunds } from '@/api';
import { LineChart } from 'react-native-chart-kit';
import { useFundValuation } from '@/hooks/useFundValuation';

const { width } = Dimensions.get('window');

export default function FundDetailScreen() {
  const { id, name, type } = useLocalSearchParams<{ id: string, name?: string, type?: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  
  const { isFavorite, addFavorite, removeFavorite } = useFunds();
  const { funds, loading } = useFundValuation(id ? [id] : []);
  
  const fund = funds[0];
  const [historyData, setHistoryData] = useState<{date: string, value: number}[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Load history data
  useEffect(() => {
    if (id) {
      setHistoryLoading(true);
      fetchFundHistory(id).then(data => {
        setHistoryData(data);
        setHistoryLoading(false);
      });
    }
  }, [id]);

  const handleToggleFavorite = () => {
    if (!id) return;
    if (isFavorite(id)) {
        removeFavorite(id);
    } else {
        addFavorite(id);
    }
  };

  // Construct display fund object
  const displayFund = fund || {
      code: id,
      name: name || 'Loading...',
      type: type || 'Fund',
      valuation: 0,
      change: 0,
      changePercent: 0,
      valuationTime: '--:--'
  };

  if (loading && !fund) return <ThemedView style={styles.loadingContainer}><ActivityIndicator /></ThemedView>;

  const isUp = (displayFund.change || 0) >= 0;
  const changeColor = isUp ? theme.success : theme.danger;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: displayFund.name,
        headerLargeTitle: true,
        headerBlurEffect: 'regular',
        headerTransparent: Platform.OS === 'ios',
        headerStyle: { backgroundColor: Platform.OS === 'android' ? theme.background : undefined }
      }} />
      
      <ScrollView 
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scrollContent, { paddingTop: Platform.OS === 'android' ? 20 : 0 }]}
      >
        {/* Main Price Card */}
        <View style={styles.mainHeader}>
          <ThemedText type="caption" style={{ fontSize: 14, marginBottom: 4 }}>{displayFund.code} · {displayFund.type}</ThemedText>
          <View style={styles.priceRow}>
             <ThemedText type="title" style={{ fontSize: 42, lineHeight: 48 }}>
                {displayFund.valuation?.toFixed(4)}
             </ThemedText>
          </View>
          <View style={styles.changeRow}>
            <ThemedText style={{ fontSize: 18, fontWeight: '600', color: changeColor }}>
              {displayFund.change && displayFund.change > 0 ? '+' : ''}{displayFund.change?.toFixed(4)} ({displayFund.changePercent?.toFixed(2)}%)
            </ThemedText>
            <ThemedText style={{ fontSize: 14, color: theme.icon, marginLeft: 8 }}>
              {displayFund.valuationTime}
            </ThemedText>
          </View>
        </View>

        {/* Chart */}
        <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
           <ThemedText type="defaultSemiBold" style={{ marginBottom: 16 }}>Performance</ThemedText>
           {historyLoading ? (
               <ActivityIndicator />
           ) : (
               <LineChart
                 data={{
                   labels: historyData.map(d => d.date.slice(5)), // MM-DD
                   datasets: [{ data: historyData.map(d => d.value) }]
                 }}
                 width={width - 60}
                 height={220}
                 yAxisLabel=""
                 yAxisSuffix=""
                 chartConfig={{
                   backgroundColor: theme.card,
                   backgroundGradientFrom: theme.card,
                   backgroundGradientTo: theme.card,
                   decimalPlaces: 4,
                   color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 122, 255, ${opacity})`,
                   labelColor: (opacity = 1) => theme.icon,
                   style: { borderRadius: 16 },
                   propsForDots: { r: "0" }
                 }}
                 bezier
                 style={{ marginVertical: 8, borderRadius: 16 }}
                 withInnerLines={false}
                 withOuterLines={false}
               />
           )}
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
            <AppleButton 
              title={isFavorite(id!) ? "Remove from Favorites" : "Add to Favorites"} 
              variant={isFavorite(id!) ? "secondary" : "primary"}
              onPress={handleToggleFavorite} 
              style={{ flex: 1, marginRight: 8 }}
            />
            <AppleButton 
              title="Set Alert" 
              variant="secondary" 
              onPress={() => {}}
              style={{ flex: 1, marginLeft: 8 }}
            />
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  mainHeader: {
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
