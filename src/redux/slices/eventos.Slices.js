// /redux/slices/eventsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // ✅ CORREÇÃO: Inicializa o array 'eventos' como vazio
    eventos: [], 
};

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        addEvent: (state, action) => {
            // Adiciona o novo evento (payload) ao início do array 'eventos'
            state.eventos.unshift(action.payload);
        },
        setEvents: (state, action) => {
            state.eventos = action.payload;
        },
    },
});

export const { addEvent, setEvents } = eventsSlice.actions; 
export default eventsSlice.reducer;