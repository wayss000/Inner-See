import React, { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, usePathname, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from 'react-native';
import { LazyLoadingAppInitializer } from '../src/LazyLoadingAppInitializer';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
  // 添加其它想暂时忽略的错误或警告信息
]);

// 全局应用初始化
let appInitialized = false;

export default function RootLayout() {
  const pathname = usePathname();
  const searchParams = useGlobalSearchParams();

  // 应用初始化
  useEffect(() => {
    if (!appInitialized) {
      initializeApp();
      appInitialized = true;
    }
  }, []);

  const initializeApp = async () => {
    try {
      console.log('开始应用初始化...');
      await LazyLoadingAppInitializer.getInstance().initializeApp();
      console.log('应用初始化完成');
    } catch (error) {
      console.error('应用初始化失败:', error);
    }
  };

  useEffect(() => {
    if (!pathname) {
      return;
    }
    let searchString = '';
    if (Object.keys(searchParams).length > 0) {
      const queryString = Object.keys(searchParams)
        .map(key => {
          const value = searchParams[key];
          if (typeof value === 'string') {
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          }
          return '';
        }).filter(Boolean).join('&');

      searchString = '?' + queryString;
    }

    const pageId = pathname.replace('/', '').toUpperCase();
    console.log('当前pageId:', pageId, ', pathname:', pathname, ', search:', searchString);
    if (typeof window === 'object' && window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'chux-path-change',
        pageId: pageId,
        pathname: pathname,
        search: searchString,
      }, '*');
    }
  }, [pathname, searchParams])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark"></StatusBar>
      <Stack screenOptions={{
        // 设置所有页面的切换动画为从右侧滑入，适用于iOS 和 Android
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        // 隐藏自带的头部
        headerShown: false 
      }}>
        <Stack.Screen name="(tabs)" options={{ title: "底部导航栏" }} />
        <Stack.Screen name="p-test_detail" options={{ title: "测试详情页" }} />
        <Stack.Screen name="p-test_question" options={{ title: "测试答题页" }} />
        <Stack.Screen name="p-result_display" options={{ title: "结果展示页" }} />
        <Stack.Screen name="p-feedback" options={{ title: "反馈建议页" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
