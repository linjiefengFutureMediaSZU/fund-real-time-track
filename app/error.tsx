import React from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { AlertTriangle, RefreshCcw, FileText, Home } from 'lucide-react-native';
import { ThemedText, ThemedView } from '@/components/Themed';

export default function ErrorScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconBox, { backgroundColor: theme.danger + '15' }]}>
          <AlertTriangle size={60} color={theme.danger} />
        </View>
        
        <ThemedText type="title" style={styles.title}>系统运行异常</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.secondaryText }]}>
          检测到数据库可能已损坏或运行环境异常。建议尝试重新加载或导出日志反馈。
        </ThemedText>

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: theme.tint }]}
            onPress={() => router.replace('/')}
            activeOpacity={0.8}
          >
            <RefreshCcw size={20} color="#FFF" />
            <ThemedText style={styles.primaryButtonText}>重新加载系统</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: theme.border }]}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <FileText size={20} color={theme.text} />
            <ThemedText style={{ color: theme.text, fontWeight: '600' }}>查看错误日志</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.textButton}
            onPress={() => router.replace('/')}
          >
            <Home size={18} color={theme.secondaryText} />
            <ThemedText style={[styles.textButtonText, { color: theme.secondaryText }]}>返回首页</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText style={[styles.footerText, { color: theme.secondaryText }]}>错误代码: DB_CORRUPTION_0x01</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  content: {
    alignItems: 'center',
  },
  iconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  buttonGroup: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
  },
  textButton: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  textButtonText: {
    fontSize: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Courier',
  },
});
