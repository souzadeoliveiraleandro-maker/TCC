import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
    

// Componentes das Telas (Certifique-se que os caminhos estão corretos)
import Feed from "./Feed";
import AddFoto from "./AddFoto";
import Profile from "./Profile";
import Registro from "./Registrar";
import Login from "./Login";

// Definição dos Navegadores
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const RootStack = createStackNavigator(); // 💡 NOVO: Stack para gerenciar a troca Auth <-> App

// ------------------------------------------------------------------
// 1. Navegador de Autenticação (Login, Registro)
// ------------------------------------------------------------------
function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            {/* O Login será a primeira tela a ser exibida dentro desta pilha */}
            <AuthStack.Screen name="Login" component={Login} /> 
            <AuthStack.Screen name="Registro" component={Registro} />
        </AuthStack.Navigator>
    );
}

// ------------------------------------------------------------------
// 2. Navegador Principal (Abas - App Logado)
// ------------------------------------------------------------------
function MenuNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#555',
            }}
        >
            {/* ... Suas rotas de abas (Feed, AddPhoto, Profile, Calendario) ... */}
            <Tab.Screen name="Feed" component={Feed} options={{ tabBarIcon: ({ color, size }) => <Icon name='home' size={size} color={color} /> }}/>
            <Tab.Screen name="AddPhoto" component={AddFoto} options={{ title: 'Add Picture', tabBarIcon: ({ color, size }) => <Icon name='camera' size={size} color={color} /> }}/>
            <Tab.Screen name="Profile" component={Profile} options={{ tabBarIcon: ({ color, size }) => <Icon name='user' size={size} color={color} /> }}/>
            <Tab.Screen name="Calendario" component={Feed} options={{ tabBarIcon: ({ color, size }) => <Icon name='calendar' size={size} color={color} /> }}/>
        </Tab.Navigator>
    );
}

// ------------------------------------------------------------------
// 3. Navegador Raiz (Root Navigator - Ponto de Início)
// ------------------------------------------------------------------
function RootNavigator() {
    return (
        <RootStack.Navigator 
            screenOptions={{ headerShown: false }}
            // 🎯 O PONTO PRINCIPAL: Define a rota 'Auth' como a primeira a ser carregada.
            initialRouteName="Auth" 
        >
            <RootStack.Screen name="Auth" component={AuthNavigator} /> 
            <RootStack.Screen name="App" component={MenuNavigator} /> 
        </RootStack.Navigator>
    );
}


// ------------------------------------------------------------------
// Exportação Principal (Renderiza o Navegador Raiz)
// ------------------------------------------------------------------
export default () => (
    <NavigationContainer>
        <RootNavigator /> 
    </NavigationContainer>
);