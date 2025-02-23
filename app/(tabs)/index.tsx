import { Text, Image, StyleSheet, Platform } from 'react-native';
import * as Device from 'expo-device';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
      <>
          <ThemedView>
              <ThemedText type="title">Statistics</ThemedText>
              <ThemedText>

              </ThemedText>
          </ThemedView>
          {/*<ThemedView>*/}
          {/*    <ThemedText type="subtitle">Step 1: Try it</ThemedText>*/}
          {/*    <ThemedText>*/}
          {/*    </ThemedText>*/}
          {/*</ThemedView>*/}
          {/*<ThemedView>*/}
          {/*    <ThemedText type="subtitle">Step 2: Explore</ThemedText>*/}
          {/*    <ThemedText>*/}
          {/*        Tap the Explore tab to learn more about what's included in this starter app.*/}
          {/*    </ThemedText>*/}
          {/*</ThemedView>*/}
          {/*<ThemedView>*/}
          {/*    <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>*/}
          {/*    <ThemedText>*/}
          {/*        When you're ready, run{' '}*/}
          {/*        <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}*/}
          {/*        <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}*/}
          {/*        <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}*/}
          {/*        <ThemedText type="defaultSemiBold">app-example</ThemedText>.*/}
          {/*    </ThemedText>*/}
          {/*</ThemedView>*/}
      </>

  );
}

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });
