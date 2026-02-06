import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Eye, EyeOff, Shield } from 'lucide-react-native';
import { ThemedText, ThemedView } from '@/components/Themed';

export default function PasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isMatch = password === confirmPassword && password.length >= 6;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: theme.tint + '20' }]}>
            <Shield size={40} color={theme.tint} />
          </View>
          <ThemedText type="title" style={styles.title}>设置加密密码</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.secondaryText }]}>
            密码将用于加密本地 Core Data 数据库，确保数据安全。
          </ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <ThemedText style={[styles.label, { color: theme.secondaryText }]}>新密码 (6-12位)</ThemedText>
            <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="请输入密码"
                placeholderTextColor={theme.secondaryText}
                maxLength={12}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color={theme.secondaryText} /> : <Eye size={20} color={theme.secondaryText} />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <ThemedText style={[styles.label, { color: theme.secondaryText }]}>确认密码</ThemedText>
            <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                placeholder="请再次输入密码"
                placeholderTextColor={theme.secondaryText}
                maxLength={12}
              />
            </View>
          </View>

          {password.length > 0 && confirmPassword.length > 0 && !isMatch && (
            <ThemedText style={[styles.errorText, { color: theme.danger }]}>两次密码输入不一致</ThemedText>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: isMatch ? theme.tint : theme.border }]}
            disabled={!isMatch}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>确认设置</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 17,
    height: '100%',
  },
  errorText: {
    fontSize: 14,
    marginTop: -10,
    marginLeft: 4,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
