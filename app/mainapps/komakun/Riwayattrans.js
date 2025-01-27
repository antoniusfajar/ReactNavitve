// components/PinInput.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const Riwayattrans = ({ pinLength, onComplete }) => {
  const [pin, setPin] = useState('');

  const handleChange = (text) => {
    if (text.length <= pinLength) {
      setPin(text);
      if (text.length === pinLength) {
        onComplete(text);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={pin}
        onChangeText={handleChange}
        secureTextEntry
        maxLength={pinLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 24,
    borderBottomWidth: 1,
    textAlign: 'center',
    width: 200,
    padding: 10,
  },
});

export default Riwayattrans;
