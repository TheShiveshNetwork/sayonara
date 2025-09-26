import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import TabNavigator from './src/navigation/TabNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={['#0a0a0a', '#1a2f1a', '#2a4a2a', '#1a3a1a', '#0a0a0a']}
        locations={[0, 0.2, 0.4, 0.7, 1]}
        style={styles.gradientContainer}
      >
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <TabNavigator />
        </NavigationContainer>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
});

export default App;
