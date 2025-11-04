import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Feed from "./Feed";
import addFoto from "./addFoto";
// TODO: Criar e importar as telas AddPhoto e Profile
// import AddPhoto from './screens/AddPhoto';
// import Profile from './screens/Profile';

const Tab = createBottomTabNavigator();

function MenuNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={{
                headerShown: false, // Oculta o header padrão se não for necessário
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#007AFF', // Cor para ícone ativo
                tabBarInactiveTintColor: '#000000ff', // Cor para ícone inativo
            }}
        >
            <Tab.Screen
                name="Feed"
                component={Feed}
                options={{ tabBarIcon: ({ color, size }) => <Icon name='home' size={size} color={color} /> }}
            />
            <Tab.Screen
                name="AddPhoto"
                component={Feed} // TODO: Trocar por AddPhoto quando o componente existir
                options={{ title: 'Add Picture', tabBarIcon: ({ color, size }) => <Icon name='camera' size={size} color={color} /> }}
            />
            <Tab.Screen
                name="Profile"
                component={Feed} // TODO: Trocar por Profile quando o componente existir
                options={{ tabBarIcon: ({ color, size }) => <Icon name='user' size={size} color={color} /> }}
            />
        </Tab.Navigator>
    );
}

export default () => (
    <NavigationContainer>
        <MenuNavigator />
    </NavigationContainer>
);