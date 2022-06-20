/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({allowDeviceCredentials: true});

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [state, setState] = useState<string>();

  const onPress = async () => {
    const {biometryType, available, error} =
      await rnBiometrics.isSensorAvailable();
    console.log('biometryType', biometryType, 'available', available, error);

    if (
      (available && biometryType === BiometryTypes.TouchID) ||
      biometryType === BiometryTypes.FaceID ||
      biometryType === BiometryTypes.Biometrics
    ) {
      console.log('Biometrics Type is', biometryType);

      try {
        const {success} = await rnBiometrics.simplePrompt({
          promptMessage: 'Confirm fingerprint',
        });
        if (success) {
          console.log('successful biometrics provided');
          setState('successful biometrics provided');
        } else {
          console.log('user cancelled biometric prompt');
        }
      } catch {
        console.log('biometrics failed');
      }
    } else {
      console.log('Biometrics not supported');
    }
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {state ? (
          <View>
            <Text>{state}</Text>
          </View>
        ) : (
          <Button title="Biometrics" onPress={onPress} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
