// eventos.Slices.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logout } from './userSlices'; // ✅ 1. Importar a ação de logout
import { API_URL } from '../../config/apiConfig'; 

const initialState = {
    eventos: [], 
    eventAdded: false, // ✅ 1. Novo estado para sinalizar a adição de um evento
    loading: false,
    error: null,
};

// =======================================================
// THUNK: Carregar Eventos (GET /api/events)
// =======================================================
export const loadEvents = createAsyncThunk(
    'events/loadEvents',
    async (_, { getState, rejectWithValue }) => { 
        try {
            const { comunidadeId } = getState().user;
            const response = await axios.get(`${API_URL}/events`, {
                params: {
                    comunidadeId: comunidadeId
                }
            });
            // A API retorna a lista de eventos com o nickname do criador
            return response.data; 
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
            return rejectWithValue(error.response?.data?.message || 'Falha ao carregar eventos.');
        }
    }
);

// =======================================================
// THUNK: Criar Novo Evento (POST /api/events)
// =======================================================
export const saveEvent = createAsyncThunk(
    'events/saveEvent',
    async (eventData, { getState, rejectWithValue }) => { 
        // 1. OBTÉM O TOKEN DO ESTADO REDUX
        const { token, comunidadeId } = getState().user; // ✅ Pega o token e o ID da comunidade
        const { title, date, image, localizacao, description } = eventData; // ✅ CORREÇÃO: Pega o campo 'localizacao'

        // 2. CRIA UM OBJETO FORMDATA PARA ENVIAR O ARQUIVO
        const formData = new FormData();
        formData.append('title', title);
        formData.append('date', date);
        formData.append('localizacao', localizacao); // Agora a variável e a chave têm o mesmo nome
        formData.append('description', description);
        if (comunidadeId) {
            formData.append('comunidadeId', comunidadeId); // ✅ Adiciona o ID da comunidade
        }
        // Adiciona a imagem. O backend deve esperar um campo chamado 'image'.
        formData.append('image', {
            uri: image.uri,
            type: image.type, // ex: 'image/jpeg'
            name: image.fileName || `event-image-${Date.now()}.jpg`,
        });
        
        try {
            const response = await axios.post(
                `${API_URL}/events`,
                formData, // ✅ Envia o FormData
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data', // ✅ Essencial para envio de arquivos
                    }
                }
            );
            
            // A API retorna o evento completo, incluindo o ID e o nickname do criador
            return response.data; 
        } catch (error) {
            console.error("Erro ao criar evento:", error);
            return rejectWithValue(error.response?.data?.message || 'Falha ao criar evento.');
        }
    }
);


const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents: (state, action) => { state.eventos = action.payload; state.loading = false; state.error = null; },
        resetEventAdded: (state) => { // ✅ 2. Novo reducer para resetar o sinalizador
            state.eventAdded = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // loadEvents
            .addCase(loadEvents.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loadEvents.fulfilled, (state, action) => { eventsSlice.caseReducers.setEvents(state, action); })
            .addCase(loadEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // saveEvent
            .addCase(saveEvent.fulfilled, (state, action) => {
                // ✅ 3. Em vez de adicionar o evento, apenas sinalizamos que um novo evento foi adicionado.
                // Isso evita a re-renderização da lista em segundo plano.
                state.eventAdded = true;
            });

            // ✅ 2. Adicionar um caso para limpar os eventos no logout
            builder.addCase(logout.fulfilled, (state) => {
                state.eventos = [];
                state.error = null;
            });
    }
});

export const { setEvents, resetEventAdded } = eventsSlice.actions; // ✅ 4. Exportar o novo reducer
export default eventsSlice.reducer;