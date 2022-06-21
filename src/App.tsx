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
import {Button, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Signature} from './signature';
import {SimplePrompt} from './simplePrompt';
import {useTheme} from './useTheme';

const App: React.FC = () => {
  const isDarkMode = useTheme();
  const [state, setState] = useState<'simplePrompt' | 'signature'>(
    'simplePrompt',
  );

  const onChange = (newState: 'simplePrompt' | 'signature') => () => {
    setState(newState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View>
        <Button title="Simple Prompt" onPress={onChange('simplePrompt')} />
        <Button title="Signature" onPress={onChange('signature')} />
      </View>

      {state === 'simplePrompt' && <SimplePrompt />}
      {state === 'signature' && <Signature />}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
