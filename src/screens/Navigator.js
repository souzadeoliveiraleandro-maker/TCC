import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, NavigationContainer } from '@react-navigation/native'; 

// 🔑 IMPORTAÇÕES DO REDUX
import { Provider } from 'react-redux';
import { store } from '../redux/store'; 

// Componentes das Telas
import Feed from "./Feed";
import AddEventos from "./AddEventos";
import Profile from "./Profile";
import Registro from "./Registrar";
import Login from "./Login";
import Eventos from "./Eventos"; 
import AddPost from "./AddPost";
// 🔑 NOVO: Importe a tela de Detalhes
import EventDetail from "./EventsDetalhe"; 


// Definição dos Navegadores
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();

// 🔑 NOVOS Stack Navigators para as abas
const FeedStack = createStackNavigator(); 
const EventosStack = createStackNavigator(); 
const ProfileStack = createStackNavigator();

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
// 2. Stacks de Abas (Cada aba é uma Stack para ter seu próprio Header)
// ------------------------------------------------------------------

// A. Stack do Feed
function FeedStackScreen() {
         return (
              <FeedStack.Navigator screenOptions={{ headerShown: true }}>
                       <FeedStack.Screen 
                            name="FeedHome" 
                            component={Feed} 
                            options={{ title: 'Feed Principal' }}
                       />
                       <FeedStack.Screen
                            name="AddPost"
                            component={AddPost}
                            options={{ title: 'Nova Postagem' }}
                       />
              </FeedStack.Navigator>

         );
}

// B. Stack de Eventos (Permite que a tela 'AddEventos' e 'EventDetail' sejam abertas)
function EventosStackScreen() {
         return (
              <EventosStack.Navigator screenOptions={{ headerShown: true }}>
                       <EventosStack.Screen 
                            name="Eventos" 
                            component={Eventos} 
                            options={{ title: 'Eventos' }}
                       />
                       <EventosStack.Screen 
                            name="AddEvento" 
                            component={AddEventos} 
                            options={{ title: 'Criar Evento' }}
                       />
            
            {/* 🔑 NOVO: Rota para os detalhes do Evento */}
            <EventosStack.Screen 
                name="EventDetail" 
                component={EventDetail} 
                // 💡 Define o título da tela dinamicamente com o nome do evento
                options={({ route }) => ({ 
                    title: route.params?.event?.title || 'Detalhes do Evento',
                })}
            />
              </EventosStack.Navigator>
         );
}

// C. Stack do Perfil
function ProfileStackScreen() {
         return (
              <ProfileStack.Navigator screenOptions={{ headerShown: true }}>
                       <ProfileStack.Screen 
                            name="ProfileHome" 
                            component={Profile} 
                            options={{ title: 'Seu Perfil' }}
                       />
              </ProfileStack.Navigator>
         );
}

// ------------------------------------------------------------------
// 3. Navegador Principal (Abas - App Logado)
// ------------------------------------------------------------------
function MenuNavigator() {
         return (
              <Tab.Navigator
                       initialRouteName="FeedTab"
                       screenOptions={({ route }) => ({
                            // 🔑 Desabilita o cabeçalho do Tab Navigator.
                            // Agora as Stacks internas (FeedStackScreen, etc.) mostrarão o header.
                            headerShown: false, 
                            tabBarShowLabel: true,
                            tabBarActiveTintColor: '#007AFF',
                            tabBarInactiveTintColor: '#555',
                            // Lógica para definir o ícone
                            tabBarIcon: ({ color, size }) => {
                                     let iconName;

                                     if (route.name === 'FeedTab') { // Usa o nome da Rota Tab
                                          iconName = 'home';
                                     } else if (route.name === 'ProfileTab') { // Usa o nome da Rota Tab
                                          iconName = 'user';
                                     } else if (route.name === 'EventosTab') { 
                                          iconName = 'calendar';
                                     }
                                     return <Icon name={iconName} size={size} color={color} />;
                            },
                       })}
              >
                       <Tab.Screen 
                            name="FeedTab" 
                            component={FeedStackScreen} // 🔑 Usando a nova Stack
                            options={{ title: 'Feed' }}
                       />

                       <Tab.Screen 
                            name="EventosTab" 
                            component={EventosStackScreen} // Mantendo a Stack de Eventos
                            options={{ title: 'Eventos' }}
                       />

                       <Tab.Screen 
                            name="ProfileTab" 
                            component={ProfileStackScreen} // 🔑 Usando a nova Stack
                            options={{ title: 'Perfil' }}
                       />

              </Tab.Navigator>
         );
}

// ------------------------------------------------------------------
// 4. Navegador Raiz (Root Navigator - Ponto de Início)
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
// 5. Exportação Principal com Conexão Global do Redux
// ------------------------------------------------------------------
export default () => (
         <Provider store={store}> 
              <NavigationContainer>
                       <RootNavigator /> 
              </NavigationContainer>
         </Provider>
);