import React, { Component } from 'react'
import {RSA} from 'react-native-rsa-native';

export const generateKeys4096Demo = async () => {
  console.log('generateKeys4096Demo')
  const keys = await RSA.generateKeys(4096)
  console.log('4096 private:', keys.private) // the private key
  console.log('4096 public:', keys.public) // the public key
  const encodedMessage = await RSA.encrypt('my message', keys.public)
  console.log('4096 encoded message:', encodedMessage)
  const message = await RSA.decrypt(encodedMessage, keys.private)
  console.log('4096 decoded message:', message);
}