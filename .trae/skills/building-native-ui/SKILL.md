---
name: building-native-ui
description: Guidelines for building native UIs with Expo and React Native. Invoke when user asks about "Expo UI", "React Native styling", "Expo Router", or "building mobile interfaces".
metadata:
  author: expo (adapted)
  version: 1.0.0
  source: expo/skills (building-ui)
---

# Building Native UI with Expo

This skill provides guidelines for building robust, universal native UIs using Expo and React Native.

## Core Libraries

- **Navigation**: Use **Expo Router** (file-based routing) for all navigation.
- **Images**: Use `expo-image` for high-performance image loading and caching.
- **Icons**: Use `@expo/vector-icons`.
- **Linear Gradients**: Use `expo-linear-gradient`.
- **Blur**: Use `expo-blur`.

## Expo Router Best Practices

1.  **File Structure**:
    - `app/index.tsx` -> Root route (`/`)
    - `app/_layout.tsx` -> Root layout (Stack/Tabs configuration)
    - `app/[id].tsx` -> Dynamic route

2.  **Navigation**:
    - Use `<Link href="/path">` for declarative navigation.
    - Use `router.push('/path')` for imperative navigation.
    - Use `useLocalSearchParams()` to access route parameters.

## Styling & Layout

1.  **Universal Design**: Ensure UI works on Android, iOS, and Web.
2.  **Safe Areas**: Always use `SafeAreaView` (from `react-native-safe-area-context`) or handle insets manually.
3.  **Platform Specifics**:
    - Use `Platform.select({ ios: ..., android: ... })` for minor differences.
    - Use `.ios.tsx` and `.android.tsx` extensions for major component differences.
4.  **Flexbox**: Master Flexbox for layout. Remember `flexDirection` defaults to `column` in React Native.

## Performance

- **FlatList**: Use `FlatList` or `FlashList` (Shopify) for long lists. Never use `ScrollView` for large datasets.
- **Memoization**: Use `useMemo` and `useCallback` to prevent unnecessary re-renders, especially for styles or complex calculations.
- **Image Optimization**: Use `expo-image` with `placeholder` and `transition` props for smooth loading.

## Example: Expo Image

```tsx
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQ...';

export default function App() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source="https://picsum.photos/seed/696/3000/2000"
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0553',
  },
});
```
