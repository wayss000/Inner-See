import React from "react";
import { StyleSheet, View, Dimensions, Platform, StatusBar } from 'react-native';
import { Tabs } from "expo-router";
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryColors } from '../../src/constants/Colors';


export default function Layout() {
  // 为Android平台设置状态栏样式，帮助解决屏幕变暗问题
  if (Platform.OS === 'android') {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#ffffff');
  }

  return (
    <Tabs 
      backBehavior="order"
      screenOptions={{ 
          tabBarActiveTintColor: PrimaryColors.main,
          tabBarInactiveTintColor: "#6b7280",
          tabBarStyle: {
            backgroundColor: "#ffffffcc"
          }
      }}>

        <Tabs.Screen
            name="index"
            options={{href: null}}
        />

        <Tabs.Screen name="p-home" options={{
            title: '首页', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="house" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-test_category" options={{
            title: '分类', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome5 name="th-large" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-history" options={{
            title: '历史', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome5 name="history" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-personal_center" options={{
            title: '我的', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="user" size={20} color={color} />
            )
        }}/>
    </Tabs>
  );
}