import React from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {
  deletePublicKeyFromServer,
  sendPublicKeyToServer,
  verifySignatureWithServer,
} from './serverActions';
import {useTheme} from './useTheme';

const rnBiometrics = new ReactNativeBiometrics({allowDeviceCredentials: true});

let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
let payload = epochTimeSeconds + 'some message';

export const Signature: React.FC = () => {
  const isDarkMode = useTheme();

  const onCreateKeys = async () => {
    const {available, biometryType, error} =
      await rnBiometrics.isSensorAvailable();
    console.log('biometryType', biometryType, 'available', available, error);

    if (
      (available && biometryType === BiometryTypes.TouchID) ||
      biometryType === BiometryTypes.FaceID ||
      biometryType === BiometryTypes.Biometrics
    ) {
      console.log('Biometrics Type is', biometryType);

      try {
        const {keysExist} = await rnBiometrics.biometricKeysExist();

        if (keysExist) {
          console.log('Keys exist');
        } else {
          const {publicKey} = await rnBiometrics.createKeys();
          const result = await sendPublicKeyToServer(publicKey);
          result && console.log('result public key: ', publicKey);
        }
      } catch {
        console.log('biometrics failed');
      }
    } else {
      console.log('Biometrics not supported');
    }
  };

  const onCreateSignature = async () => {
    const {keysExist} = await rnBiometrics.biometricKeysExist();

    if (keysExist) {
      const {success, signature} = await rnBiometrics.createSignature({
        promptMessage: 'Sign in',
        payload,
      });

      if (success && signature) {
        console.log('signature: ', signature);
        const result = await verifySignatureWithServer(signature, payload);
        console.log('result: ', result);

        if (result) {
          Alert.alert('Verified', '');
        }
      }
    } else {
      console.log('Keys do not exist or were deleted');
    }
  };

  const onDeleteKeys = async () => {
    const {keysExist} = await rnBiometrics.biometricKeysExist();

    if (keysExist) {
      const {keysDeleted} = await rnBiometrics.deleteKeys();
      if (keysDeleted) {
        await deletePublicKeyFromServer();
        console.log('Successful deletion');
      } else {
        console.log(
          'Unsuccessful deletion because there were no keys to delete',
        );
      }
    } else {
      console.log('Keys do not exist or were deleted');
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{color: isDarkMode ? '#fff' : '#333'}}>Signature</Text>
      </View>

      <Button title="createKeys" onPress={onCreateKeys} />
      <Button title="createSignature" onPress={onCreateSignature} />
      <Button title="deleteKeys" onPress={onDeleteKeys} />
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
