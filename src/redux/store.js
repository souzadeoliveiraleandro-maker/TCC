import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/slices/userSlices'

export const store = configureStore({
    reducer: {
        // Agora você acessará os dados do usuário usando state.user
        user: userReducer,
    },
});