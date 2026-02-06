import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  Appearance
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText, ThemedView, AppleButton } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleTheme = () => {
    // Note: This only works in dev/simulators mostly, or if the app has a ThemeProvider that listens to this.
    // Since we rely on system appearance, we might need a custom context to force it. 
    // For now, let's just simulate or rely on system. 
    // A proper implementation would require a ThemeContext. 
    // But user asked for a button, so let's mock the visual change or use the Appearance API if allowed.
    Appearance.setColorScheme(isDark ? 'light' : 'dark');
  };

  const handleLogin = () => {
    router.replace('/(tabs)/favorites');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack.Screen options={{ headerShown: false }} />

        {/* Top Actions */}
        <View style={[styles.headerActions, { top: insets.top + 20 }]}>
          <TouchableOpacity 
            onPress={toggleTheme}
            style={[styles.themeBtn, { backgroundColor: isDark ? '#333' : '#eee' }]}
          >
            {isDark ? <Sun size={20} color="#fff" /> : <Moon size={20} color="#000" />}
          </TouchableOpacity>
        </View>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>Login</ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              Welcome back to Fund Tracker.
            </ThemedText>
          </View>

          <View style={styles.formContainer}>
            <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}>
              <ThemedText style={styles.inputLabel}>Email</ThemedText>
              <TextInput
                style={[styles.input, { color: isDark ? '#FFF' : '#000' }]}
                placeholder="name@example.com"
                placeholderTextColor={isDark ? '#666' : '#999'}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}>
              <ThemedText style={styles.inputLabel}>Password</ThemedText>
              <TextInput
                style={[styles.input, { color: isDark ? '#FFF' : '#000' }]}
                placeholder="Required"
                placeholderTextColor={isDark ? '#666' : '#999'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <ThemedText type="link" style={{ fontSize: 14 }}>Forgot Password?</ThemedText>
            </TouchableOpacity>

            <View style={styles.btnGroup}>
              <AppleButton title="Log In" onPress={handleLogin} />
              <View style={{ height: 16 }} />
              <AppleButton title="Create Account" variant="secondary" onPress={() => {}} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
  },
  themeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  titleContainer: {
    marginBottom: 48,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: '#8E8E93',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  input: {
    fontSize: 17,
    height: 24,
    padding: 0,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  btnGroup: {
    width: '100%',
  }
});
