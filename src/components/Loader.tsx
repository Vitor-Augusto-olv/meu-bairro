import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';

export function Loader() {
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color={colors.asfalto} />
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
