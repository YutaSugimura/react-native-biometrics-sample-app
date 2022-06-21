import React, {useState} from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {useTheme} from './useTheme';

const rnBiometrics = new ReactNativeBiometrics({allowDeviceCredentials: true});

export const SimplePrompt: React.FC = () => {
  const isDarkMode = useTheme();
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

  const onReset = () => {
    setState(undefined);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{color: isDarkMode ? '#fff' : '#333'}}>Simple Prompt</Text>
      </View>

      {state ? (
        <View>
          <Text style={{color: isDarkMode ? '#fff' : '#333'}}>{state}</Text>
          <Button title="Reset" onPress={onReset} />
        </View>
      ) : (
        <Button title="Biometrics" onPress={onPress} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
