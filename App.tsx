/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Provider } from 'react-redux';
import MapScreen from './src/screens/Map';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './src/redux/store';


const Stack = createStackNavigator();

function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={"Map"} component={MapScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default function () {
  return (
        <Provider store={store}>
          <App/>
        </Provider>
      )
}
