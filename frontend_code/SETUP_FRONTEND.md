# Frontend Setup Guide

Because the automated initialization encountered network/environment issues, I have generated the source code for you in the `frontend_code` directory. Follow these steps to set up the React Native project and integrate the code.

## 1. initialize React Native Project
Open a terminal in `d:/VTN` and run:
```bash
npx react-native init VelaivaaypuTN
```
*If this fails again, try clearing cache `npm cache clean --force` or checking your internet connection.*

## 2. Install Dependencies
Once the project is created, go into the directory:
```bash
cd VelaivaaypuTN
npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler @react-native-async-storage/async-storage @reduxjs/toolkit react-redux axios react-native-paper react-native-vector-icons
```
*Note: You may need to follow additional setup instructions for `react-native-vector-icons` and `react-native-gesture-handler` (editing MainActivity.java).*

## 3. Copy Source Code
Copy the contents of `d:/VTN/frontend_code/src` into `d:/VTN/VelaivaaypuTN/src`.
You may need to create the `src` folder first.

## 4. Update App.js
Replace `App.tsx` (or `App.js`) in `VelaivaaypuTN` with the following:

```javascript
import React from 'react';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import store from './src/redux/store'; // You need to create this store file or I can provide it
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </Provider>
  );
};

export default App;
```

## 5. Run the App
```bash
npx react-native run-android
```
Make sure your backend is running on port 5000.
