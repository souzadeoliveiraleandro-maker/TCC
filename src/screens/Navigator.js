import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, NavigationContainer } from '@react-navigation/native';

// 🔑 IMPORTAÇÕES DO REDUX
import { Provider } from 'react-redux';
import { store } from '../redux/store'; // ⚠️ Ajuste o caminho para a sua store.js

// Componentes das Telas (Certifique-se que os caminhos estão corretos)
import Feed from "./Feed";
import AddEventos from "./AddEventos";
import Profile from "./Profile";
import Registro from "./Registrar";
import Login from "./Login";
import Eventos from "./Eventos";


// Definição dos Navegadores
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();

// ------------------------------------------------------------------
// 1. Navegador de Autenticação (Login, Registro)
// ------------------------------------------------------------------
function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: true }}>
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
                headerShown: true,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#555',
            }}
        >
            <Tab.Screen name="Feed" component={Feed} options={{title: 'Feed', tabBarIcon: ({ color, size }) => <Icon name='home' size={size} color={color} /> }}/>
            <Tab.Screen name="AddEvento" component={AddEventos} options={{ title: 'Adicionar Evento', tabBarIcon: ({ color, size }) => <Icon name='camera' size={size} color={color} /> }}/>
            <Tab.Screen name="Profile" component={Profile} options={{title: 'Perfil', tabBarIcon: ({ color, size }) => <Icon name='user' size={size} color={color} /> }}/>
            <Tab.Screen name="Calendario" component={Eventos} options={{title: 'Eventos',tabBarIcon: ({ color, size }) => <Icon name='calendar' size={size} color={color} /> }}/>
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
            initialRouteName="Auth" 
        >
            <RootStack.Screen name="Auth" component={AuthNavigator} /> 
            <RootStack.Screen name="App" component={MenuNavigator} /> 
        </RootStack.Navigator>
    );
}


// ------------------------------------------------------------------
// 4. Exportação Principal com Conexão Global do Redux
// ------------------------------------------------------------------
export default () => (
    // 🔑 O Provider deve envolver o NavigationContainer
    <Provider store={store}> 
        <NavigationContainer>
            <RootNavigator /> 
        </NavigationContainer>
    </Provider>
);
