// userSlices.js (Caminho: '../redux/slices/userSlices')

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
// Importa a URL base para construir os endpoints
import { API_URL } from '../../config/apiConfig'; 

const TOKEN_KEY = '@app_user_token';

// ----------------------------------------------------------------------
// FUNÇÃO AUXILIAR: CONFIGURAÇÃO GLOBAL DO HEADER DE AUTORIZAÇÃO
// ----------------------------------------------------------------------
const setAuthHeader = (token) => {
         if (token) {
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
         } else {
              delete axios.defaults.headers.common['Authorization'];
         }
};

// ----------------------------------------------------------------------
// ESTADO INICIAL
// ----------------------------------------------------------------------
const initialState = {
         token: null,
         isRestoring: true, // Indica se o token está sendo carregado do armazenamento
         isAuthenticated: false,
         name: '',
         email: '',
         isAdmin: false,
         comunidadeId: null, // ✅ Adicionado para armazenar o ID da comunidade
         nickname: '',
         loading: false, // Loading para login/registro
         error: null,
};

// ----------------------------------------------------------------------
// FUNÇÃO AUXILIAR PARA TRATAR ERROS DO AXIOS
// ----------------------------------------------------------------------
const getErrorMessage = (error) => {
         if (error.code === 'ERR_NETWORK') {
              return 'Erro de rede. Verifique sua conexão ou o endereço IP da API.';
         }
         if (error.response && error.response.data) {
              return error.response.data.message || 
                           error.response.data.error || 
                           (typeof error.response.data === 'string' ? error.response.data : 'Erro desconhecido do servidor.');
         }
         return error.message || 'Falha na comunicação com o servidor.';
};

// ----------------------------------------------------------------------
// THUNKS ASSÍNCRONOS (Integração com API + Persistência)
// ----------------------------------------------------------------------
export const restoreToken = createAsyncThunk(
         'user/restoreToken',
         async () => {
              try {
                       const userToken = await AsyncStorage.getItem(TOKEN_KEY);
                       if (userToken) {
                            setAuthHeader(userToken);
                       }
                       return userToken; 
              } catch (e) {
                       console.error("Erro ao restaurar o token:", e);
                       return null;
              }
         }
);

export const signInUser = createAsyncThunk(
         'user/signInUser',
         async (credentials, { rejectWithValue }) => { 
              try {
                       const response = await axios.post(`${API_URL}/login`, credentials);
        
                       const { token, ...userData } = response.data;

                       await AsyncStorage.setItem(TOKEN_KEY, token);
                       setAuthHeader(token);
        
                       return response.data; 
              } catch (error) {
                       console.error("Erro no Login (Axios):", error.response?.data || error.message);
                       setAuthHeader(null);
                       await AsyncStorage.removeItem(TOKEN_KEY);
                       return rejectWithValue(getErrorMessage(error));
              }
         }
);

export const signUpUser = createAsyncThunk(
         'user/signUpUser',
         async (credentials, { rejectWithValue }) => {
              try {
                       const response = await axios.post(`${API_URL}/signup`, credentials);
        
                       const { token, ...userData } = response.data;

                       await AsyncStorage.setItem(TOKEN_KEY, token);
                       setAuthHeader(token);
        
                       return response.data;
              } catch (error) {
                       console.error("Erro no Registro (Axios):", error.response?.data || error.message);
                       setAuthHeader(null);
                       await AsyncStorage.removeItem(TOKEN_KEY);
                       return rejectWithValue(getErrorMessage(error));
              }
         }
);

export const logout = createAsyncThunk(
         'user/logout',
         async () => {
              try {
                       await AsyncStorage.removeItem(TOKEN_KEY);
                       setAuthHeader(null); 
                       return null;
              } catch (e) {
                       console.error("Erro ao fazer logout:", e);
                       return null;
              }
         }
);


// ----------------------------------------------------------------------
// SLICE (REDUCERS E EXTRAREDUCERS)
// ----------------------------------------------------------------------

const userSlice = createSlice({
         name: 'user',
         initialState,
         reducers: {
              // Reducers síncronos, se houver necessidade
         },
         extraReducers: (builder) => {
              builder
                       // --- RESTORE TOKEN ---
                       .addCase(restoreToken.pending, (state) => { state.isRestoring = true; })
                       .addCase(restoreToken.fulfilled, (state, action) => {
                            state.token = action.payload;
                            state.isAuthenticated = !!action.payload; 
                            state.isRestoring = false; 
                       })
                       .addCase(restoreToken.rejected, (state) => { state.token = null; state.isAuthenticated = false; state.isRestoring = false; })

                       // --- PENDING (Login/Registro) ---
                       .addCase(signInUser.pending, (state) => { state.loading = true; state.error = null; })
                       .addCase(signUpUser.pending, (state) => { state.loading = true; state.error = null; })

                       // --- FULFILLED (Login/Registro Sucesso) ---
                       .addCase(signInUser.fulfilled, (state, action) => {
                            state.loading = false;
                            state.isAuthenticated = true;
                            state.token = action.payload.token;
                            state.name = action.payload.name;
                            state.email = action.payload.email;
                            state.nickname = action.payload.nickname;
                            state.isAdmin = action.payload.isAdmin || false; 
                            state.comunidadeId = action.payload.comunidadeId || null; // ✅ Salva o ID
                            state.error = null;
                       })
                       .addCase(signUpUser.fulfilled, (state, action) => {
                            state.loading = false;
                            state.isAuthenticated = true;
                            state.token = action.payload.token;
                            state.name = action.payload.name;
                            state.email = action.payload.email;
                            state.nickname = action.payload.nickname;
                            state.isAdmin = action.payload.isAdmin || false; 
                            state.comunidadeId = action.payload.comunidadeId || null; // ✅ Salva o ID
                            state.error = null;
                       })

                       // --- REJECTED (Login/Registro Falha) ---
                       .addCase(signInUser.rejected, (state, action) => { 
                            state.loading = false; 
                            state.error = action.payload; 
                            state.isAuthenticated = false; 
                            state.token = null;
                       })
                       .addCase(signUpUser.rejected, (state, action) => { 
                            state.loading = false; 
                            state.error = action.payload; 
                            state.isAuthenticated = false; 
                            state.token = null;
                       })

                       // --- LOGOUT FULFILLED (CORRIGIDO) ---
                       .addCase(logout.fulfilled, (state) => {
                            // Limpa explicitamente o estado do usuário (garantindo que isRestoring não seja reintroduzido).
                            state.token = null;
                            state.isAuthenticated = false;
                            state.name = '';
                            state.email = '';
                            state.isAdmin = false;
                            state.comunidadeId = null; // ✅ Limpa o ID no logout
                            state.nickname = '';
                            state.loading = false;
                            state.error = null;
                       });
         },
});

export default userSlice.reducer;