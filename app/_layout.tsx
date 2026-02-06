import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { FundProvider } from '@/store/FundContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <FundProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors[colorScheme ?? 'light'].card,
              },
              headerTintColor: Colors[colorScheme ?? 'light'].tint,
              headerTitleStyle: {
                fontWeight: '600',
              },
              headerShadowVisible: false,
              contentStyle: {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
              },
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
                animation: 'fade', // 淡入淡出效果更适合玻璃质感
              }}
            />
            <Stack.Screen
              name="index"
              options={{
                title: '自选基金',
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="fund/[id]"
              options={{
                title: '基金详情',
                headerBackTitle: '返回',
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                title: '设置',
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="password"
              options={{
                title: '密码设置',
                headerBackTitle: '取消',
              }}
            />
            <Stack.Screen
              name="error"
              options={{
                title: '系统异常',
                headerShown: false,
              }}
            />
          </Stack>
        </ThemeProvider>
      </FundProvider>
    </SafeAreaProvider>
  );
}
