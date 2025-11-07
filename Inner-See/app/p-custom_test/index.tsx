import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Page from "../../screens/p-custom_test";


export default function Index() {
  return (
    <SafeAreaProvider>
      <Page />
    </SafeAreaProvider>
  );
}