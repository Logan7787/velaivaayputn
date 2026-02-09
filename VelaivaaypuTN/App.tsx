import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';
import GlobalToast from './src/components/common/GlobalToast';

import { LogLevel, OneSignal } from 'react-native-onesignal';

// OneSignal Initialization
OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize("1d1b325b-d77b-4845-adc8-d99b072d98a6");

// Request Permission
OneSignal.Notifications.requestPermission(true);

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={theme.colors.background}
            translucent={true}
          />
          <AppNavigator />
          <GlobalToast />
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
