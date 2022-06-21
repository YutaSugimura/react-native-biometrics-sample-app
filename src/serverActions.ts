import AsyncStorage from '@react-native-async-storage/async-storage';
import {RSA} from 'react-native-rsa-native';

const KEY = '@PUBLIC_KEY';

export const sendPublicKeyToServer = async (publicKey: string) => {
  try {
    await AsyncStorage.setItem(KEY, publicKey);
    return true;
  } catch {
    return false;
  }
};

export const deletePublicKeyFromServer = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
};

export const verifySignatureWithServer = async (
  signature: string,
  payload: string,
) => {
  try {
    const publicKey = await AsyncStorage.getItem(KEY);
    if (!publicKey) {
      return false;
    }

    const result = await RSA.verify64(signature, payload, RSA.SHA256withRSA);

    return result;
  } catch {
    return false;
  }
};
