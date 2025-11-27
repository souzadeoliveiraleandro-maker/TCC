// Arquivo de Navegação (onde está RootStackContent)

import React, { useEffect, useState } from "react"; // ⬅️ Adicionado useState
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { NavigationContainer } from '@react-navigation/native'; 
import { View, ActivityIndicator, StyleSheet } from 'react-native'; 

// 🔑 IMPORTAÇÕES DO REDUX
import { Provider, useSelector, useDispatch } from 'react-redux'; 
import { store } from '../redux/store'; 
import { restoreToken } from '../redux/slices/userSlices' 


// Componentes das Telas
import Feed from "./Feed";
import AddEventos from "./AddEventos";
import Profile from "./Profile";
import Registro from "./Registrar";
import Login from "./Login";
import Eventos from "./Eventos"; 
import AddPost from "./AddPost";
import EventDetail from "./EventsDetalhe"; 

// 🛑 DEFINIÇÃO DOS NAVEGADORES ATUALIZADA
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const FeedStack = createNativeStackNavigator(); 
const EventosStack = createNativeStackNavigator(); 
const ProfileStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator(); 

// ------------------------------------------------------------------
// STYLES PARA A TELA DE LOADING
// ------------------------------------------------------------------
const styles = StyleSheet.create({
         loadingScreen: {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
         }
});


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
                            options={{ 
                                     title: 'Feed Principal',
                            }}
                       />
                       <FeedStack.Screen
                            name="AddPost"
                            component={AddPost}
                            options={{ title: 'Nova Postagem' }}
                       />
              </FeedStack.Navigator>
         );
}

// B. Stack de Eventos
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
                       <EventosStack.Screen 
                            name="EventDetail" 
                            component={EventDetail} 
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
                            headerShown: false, 
                            tabBarShowLabel: true,
                            tabBarActiveTintColor: '#007AFF',
                            tabBarInactiveTintColor: '#555',
                            tabBarIcon: ({ color, size }) => {
                                     let iconName;

                                     if (route.name === 'FeedTab') {
                                          iconName = 'home';
                                     } else if (route.name === 'ProfileTab') {
                                          iconName = 'user';
                                     } else if (route.name === 'EventosTab') { 
                                          iconName = 'calendar';
                                     }
                                     return <Icon name={iconName} size={size} color={color} />;
                            },
                       })}
              >
                       <Tab.Screen name="FeedTab" options={{ title: 'Feed' }}>
                            {() => <FeedStackScreen />}
                       </Tab.Screen>

                       <Tab.Screen name="EventosTab" options={{ title: 'Eventos' }}>
                            {() => <EventosStackScreen />}
                       </Tab.Screen>

                       <Tab.Screen name="ProfileTab" options={{ title: 'Perfil' }}>
                            {() => <ProfileStackScreen />}
                       </Tab.Screen>
              </Tab.Navigator>
         );
}

// ------------------------------------------------------------------
// 4. Componente que define o fluxo (Autenticado vs. Não Autenticado) - CORRIGIDO
// ------------------------------------------------------------------
function RootStackContent() {
         const dispatch = useDispatch();
         const { token, isRestoring } = useSelector(state => state.user);
    
    // 🔑 NOVO ESTADO: Garante que o useEffect termine
    const [initialLoadComplete, setInitialLoadComplete] = useState(false); 

         useEffect(() => {
        // Dispara a restauração e usa .finally para marcar o fim do processo
              dispatch(restoreToken()).finally(() => {
            setInitialLoadComplete(true);
        });
         }, [dispatch]);
         
    // 🛑 Modificação na condição de Loading
         if (isRestoring || !initialLoadComplete) { 
              return (
                       <View style={styles.loadingScreen}>
                            <ActivityIndicator size="large" color="#007AFF" />
                       </View>
              );
         }
         
         return (
              <RootStack.Navigator 
                    screenOptions={{ headerShown: false }}
              >
                    {token ? (
                         // Se o token existe, renderiza a tela principal do App
                         <RootStack.Screen name="App" component={MenuNavigator} />
                    ) : (
                         // Se o token NÃO existe, renderiza a tela de autenticação
                         <RootStack.Screen name="Auth" component={AuthNavigator} />
                    )}
              </RootStack.Navigator>
         );
}


// ------------------------------------------------------------------
// 5. Exportação Principal com Conexão Global do Redux
// ------------------------------------------------------------------
export default () => (
         <Provider store={store}> 
              <NavigationContainer>
                       <RootStackContent /> 
              </NavigationContainer>
         </Provider>
);