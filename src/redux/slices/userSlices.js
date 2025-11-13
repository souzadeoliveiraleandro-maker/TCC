import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    isAuthenticated: false,
    name: '',
    email: '',
    isAdmin: false, // 🔑 O status de permissão que controlará o FAB
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isAdmin = action.payload.isAdmin || false; 
        },
        logout: (state) => {
            return initialState; // Limpa o estado
        },
        // Opcional: Ação para carregar dados do usuário logado (ex: do AsyncStorage)
        setUserData: (state, action) => {
            state.isAuthenticated = true;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isAdmin = action.payload.isAdmin || false;
        }
    },
});

export const { loginSuccess, logout, setUserData } = userSlice.actions;
export default userSlice.reducer;