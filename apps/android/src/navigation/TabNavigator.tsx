import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from '@react-native-community/blur';
import { Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'security';
          } else if (route.name === 'AI Assistant') {
            iconName = 'chat';
          }

          return <Icon name={iconName || 'help'} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4ade80',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(26,26,26,0.8)' : 'rgba(26,26,26,0.9)',
          borderTopWidth: 0,
          elevation: 0,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarBackground: () => Platform.OS === 'ios' ? (
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            blurType="dark"
            blurAmount={20}
          />
        ) : null,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AI Assistant" component={ChatScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;