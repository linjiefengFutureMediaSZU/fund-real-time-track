import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { 
  Palette, 
  RefreshCw, 
  ChevronRight, 
  Download, 
  Upload, 
  Trash2,
} from 'lucide-react-native';
import { ThemedText, ThemedView } from '@/components/Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  
  const [themeMode, setThemeMode] = useState('system'); 

  const SettingRow = ({ icon: Icon, title, value, onPress, showArrow = true, destructive = false }: any) => (
    <TouchableOpacity 
      style={[styles.row, { borderBottomColor: isDark ? '#38383A' : '#C6C6C8' }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconContainer, { backgroundColor: destructive ? theme.up : theme.tint }]}>
          <Icon size={18} color="#FFFFFF" />
        </View>
        <ThemedText style={[styles.rowTitle, destructive && { color: theme.up }]}>{title}</ThemedText>
      </View>
      <View style={styles.rowRight}>
        {value && <ThemedText style={styles.rowValue}>{value}</ThemedText>}
        {showArrow && <ChevronRight size={16} color={theme.secondaryText} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container} lightColor="#F2F2F7" darkColor="#000000">
      <ScrollView contentContainerStyle={[styles.contentContainer, { paddingTop: 20 }]}>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>GENERAL</ThemedText>
          <View style={[styles.sectionBody, { backgroundColor: theme.card }]}>
            <SettingRow 
              icon={Palette} 
              title="Appearance" 
              value={themeMode === 'system' ? 'Automatic' : themeMode === 'light' ? 'Light' : 'Dark'} 
              onPress={() => {}} 
            />
            <SettingRow 
              icon={RefreshCw} 
              title="Refresh Rate" 
              value="15s" 
              onPress={() => {}} 
              showArrow={false} // Make it look like a toggle/value only if needed
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>DATA</ThemedText>
          <View style={[styles.sectionBody, { backgroundColor: theme.card }]}>
            <SettingRow 
              icon={Download} 
              title="Backup Data" 
              onPress={() => Alert.alert('Success', 'Data backed up locally.')} 
            />
            <SettingRow 
              icon={Upload} 
              title="Restore Data" 
              onPress={() => {}} 
            />
            <SettingRow 
              icon={Trash2} 
              title="Clear Cache" 
              onPress={() => Alert.alert('Cleared', 'Cache cleared successfully.')} 
              destructive
            />
          </View>
          <ThemedText style={styles.sectionFooter}>
            Clearing cache will remove all historical valuation data but keep your portfolio intact.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionBody, { backgroundColor: theme.card }]}>
             <TouchableOpacity style={styles.logoutBtn} onPress={() => {}}>
                <ThemedText style={{ color: theme.up, fontSize: 17, fontWeight: '600' }}>Log Out</ThemedText>
             </TouchableOpacity>
          </View>
        </View>

        <ThemedText style={styles.versionText}>v1.0.0 (Build 102)</ThemedText>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 16,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sectionFooter: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 6,
  },
  sectionBody: {
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 17,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 17,
    color: '#8E8E93',
    marginRight: 6,
  },
  logoutBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  versionText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 20,
  }
});
