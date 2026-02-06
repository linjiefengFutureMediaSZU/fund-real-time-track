import { Text, View, TouchableOpacity, StyleSheet, useColorScheme, Platform, ViewProps, TextProps, TouchableOpacityProps } from 'react-native';
import { Colors } from '@/constants/Colors';

export type ThemedProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ThemedTextProps = TextProps & ThemedProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption';
};

export type ThemedViewProps = ViewProps & ThemedProps;

export type AppleButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function ThemedText({ style, lightColor, darkColor, type = 'default', ...rest }: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'caption' ? styles.caption : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

export function ThemedView({ style, lightColor, darkColor, ...rest }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...rest} />;
}

export function AppleButton({ title, variant = 'primary', onPress, style, ...rest }: AppleButtonProps) {
  const theme = useColorScheme() ?? 'light';
  let bg = Colors[theme].tint;
  let text = '#FFFFFF';

  if (variant === 'secondary') {
    bg = theme === 'dark' ? '#3A3A3C' : '#E5E5EA'; // System Gray 5/6
    text = Colors[theme].tint;
  } else if (variant === 'danger') {
    bg = Colors[theme].danger;
    text = '#FFFFFF';
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.button, { backgroundColor: bg }, style]}
      {...rest}
    >
      <Text style={[styles.buttonText, { color: text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  defaultSemiBold: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    lineHeight: 41,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  link: {
    fontSize: 17,
    lineHeight: 22,
    color: '#007AFF',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  caption: {
    fontSize: 13,
    color: '#8E8E93',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
});
