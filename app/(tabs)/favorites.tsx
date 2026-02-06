import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, useColorScheme, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Search } from 'lucide-react-native';
import { useFunds } from '@/store/FundContext';
import { Fund } from '@/types';
import { searchFunds } from '@/api';
import { ThemedText, ThemedView } from '@/components/Themed';
import { useFundValuation } from '@/hooks/useFundValuation';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  
  const { favorites } = useFunds();
  const { funds, loading, refetch } = useFundValuation(favorites);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{code: string, name: string, type: string}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchingLoading, setSearchingLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setSearchingLoading(true);
      const delayDebounceFn = setTimeout(async () => {
        try {
          const results = await searchFunds(searchQuery);
          // Mock code generation if missing
          const resultsWithCode = results.map((r, i) => ({ 
              code: (r as any).code || `s_sh00000${i}`, 
              name: r.name, 
              type: r.type 
          }));
          setSearchResults(resultsWithCode);
        } catch (error) {
          console.error(error);
        } finally {
          setSearchingLoading(false);
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
      setSearchingLoading(false);
    }
  }, [searchQuery]);

  const renderItem = ({ item }: { item: Fund }) => {
    const isUp = (item.change || 0) >= 0;
    
    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/fund/[id]', params: { id: item.code, name: item.name, type: item.type } })}
        activeOpacity={0.7}
      >
        <View style={[styles.itemContainer, { borderBottomColor: theme.border }]}>
          <View style={styles.itemLeft}>
            <View style={[styles.codeBadge, { backgroundColor: theme.background }]}>
              <ThemedText style={[styles.fundCode, { color: theme.icon }]}>{item.code}</ThemedText>
            </View>
            <View style={styles.nameContainer}>
              <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.fundName}>
                {item.name}
              </ThemedText>
              <ThemedText type="caption" style={styles.fundType}>
                {item.type || 'Fund'}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.itemRight}>
            <View style={[
              styles.changeBadge, 
              { backgroundColor: isUp ? theme.success : theme.danger }
            ]}>
              <ThemedText style={styles.changeText}>
                {item.change ? (item.change > 0 ? '+' : '') + (item.changePercent?.toFixed(2)) + '%' : '0.00%'}
              </ThemedText>
            </View>
            <ThemedText style={styles.valuationText}>
              {item.valuation?.toFixed(4) || '--'}
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchResult = ({ item }: { item: {code: string, name: string, type: string} }) => (
    <TouchableOpacity
      style={[styles.searchResultItem, { borderBottomColor: theme.border }]}
      onPress={() => {
        setSearchQuery('');
        setIsSearching(false);
        router.push({
          pathname: '/fund/[id]',
          params: { id: item.code, name: item.name, type: item.type }
        });
      }}
    >
      <View>
        <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
        <ThemedText type="caption">{item.code} - {item.type}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: theme.border }]}>
        <ThemedText type="title" style={styles.headerTitle}>Favorites</ThemedText>
        <View style={[styles.searchBar, { backgroundColor: theme.background }]}>
          <Search size={20} color={theme.icon} style={{ marginLeft: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search Funds / Stocks"
            placeholderTextColor={theme.icon}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setIsSearching(text.length > 0);
            }}
          />
        </View>
      </View>

      {isSearching ? (
        <View style={styles.content}>
           {searchingLoading ? <ActivityIndicator style={{ marginTop: 20 }} /> : (
             <FlatList
               data={searchResults}
               keyExtractor={(item) => item.code}
               renderItem={renderSearchResult}
               contentContainerStyle={{ padding: 16 }}
             />
           )}
        </View>
      ) : (
        <FlatList
          data={funds}
          keyExtractor={(item) => item.code}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
               <ThemedText style={{ color: theme.icon }}>No favorites added yet.</ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  codeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 12,
  },
  fundCode: {
    fontSize: 12,
  },
  nameContainer: {
    flex: 1,
  },
  fundName: {
    fontSize: 16,
    marginBottom: 2,
  },
  fundType: {
    fontSize: 12,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  changeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  valuationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchResultItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emptyContainer: {
      padding: 40,
      alignItems: 'center',
  }
});
