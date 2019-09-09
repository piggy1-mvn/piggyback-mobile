import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import LoginPage from './src/components/LoginPage.js'
import RegisterPage from './src/components/RegisterPage.js'
import HomePage from './src/components/HomePage.js'

const AppNavigator = createStackNavigator ({
    Login : LoginPage,
    Register : RegisterPage,
    Home : HomePage
     });

export default createAppContainer(AppNavigator);

//export default AppNavigator;