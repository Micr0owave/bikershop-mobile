import { StyleSheet, Text, View, type ViewProps } from 'react-native';

const badgeStyles = {
  GOLD: { backgroundColor: '#E6C16B', color: '#3B2F0B' },
  SILVER: { backgroundColor: '#C9CAD4', color: '#2C2E33' },
  NORMAL: { backgroundColor: '#E6E6E6', color: '#4A4A4A' },
} as const;

type Membership = 'GOLD' | 'SILVER' | 'NORMAL';

export function Badge({ membership, style, ...props }: ViewProps & { membership: Membership }) {
  const colors = badgeStyles[membership];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]} {...props}>
      <Text style={[styles.label, { color: colors.color }]}>{membership}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: 'flex-start',
    minHeight: 32,
    minWidth: 88,
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
