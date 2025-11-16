import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/slices/userSlices'
import postsReducer from '../redux/slices/postsSlices'
import eventsReducer from '../redux/slices/eventos.Slices'



export const store = configureStore({
    reducer: {
        // Agora você acessará os dados do usuário usando state.user
        user: userReducer,
        posts: postsReducer,
        events: eventsReducer
    },
});