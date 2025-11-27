// postsSlices.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logout } from './userSlices'; // ✅ 1. Importar a ação de logout
import { API_URL } from '../../config/apiConfig'; 

const initialState = {
    posts: [],
    postAdded: false, // ✅ 1. Novo estado para sinalizar a adição de um post
    loading: false, 
    error: null,
};

// =======================================================
// THUNK: Carregar Posts (GET /api/posts)
// =======================================================
// Esta rota não exige token, pois o feed é público (mas o usuário deve estar logado
// para o App funcionar, o que é gerenciado na tela de login).
export const loadPosts = createAsyncThunk(
    'posts/loadPosts',
    async (_, { getState, rejectWithValue }) => { 
        try {
            // 1. Pega o ID da comunidade do estado do usuário
            const { comunidadeId } = getState().user;

            // 2. Faz a requisição GET passando 'comunidadeId' como um parâmetro de query.
            // O Axios faz isso automaticamente quando usamos a propriedade 'params'.
            const response = await axios({
                method: 'get',
                url: `${API_URL}/posts`,
                params: { comunidadeId: comunidadeId } // ✅ CORREÇÃO: Usar 'params' em vez de 'data'
            });
            // A API já retorna os posts formatados com comentários aninhados
            return response.data; 
        } catch (error) {
            console.error("Erro ao carregar posts:", error);
            return rejectWithValue(error.response?.data?.message || 'Falha ao carregar o feed.');
        }
    }
);

// =======================================================
// THUNK: Adicionar Comentário (POST /api/posts/:postId/comments)
// =======================================================
export const saveComment = createAsyncThunk(
    'posts/saveComment',
    async (payload, { getState, rejectWithValue }) => { 
        const { postId, text } = payload;
        // 1. OBTÉM O TOKEN DO ESTADO REDUX
        const token = getState().user.token; 

        try {
            const response = await axios.post(
                `${API_URL}/posts/${postId}/comments`,
                { text },
                {
                    // 2. ANEXA O TOKEN NO HEADER (Proteção da rota)
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                }
            );
            
            // A API retorna { comment: { nickname, comment, created_at } }
            // O comentário já vem com o nickname do usuário logado (pego pelo backend via JWT)
            return {
                postId,
                comment: response.data.comment 
            }; 
        } catch (error) {
            console.error("Erro ao salvar comentário:", error);
            return rejectWithValue(error.response?.data?.message || 'Falha ao adicionar comentário.');
        }
    }
);

// =======================================================
// THUNK: Criar Novo Post (POST /api/posts)
// =======================================================
export const savePost = createAsyncThunk(
    'posts/savePost',
    async (postData, { getState, rejectWithValue }) => {
        // 1. OBTÉM O TOKEN DO ESTADO REDUX
        const { token, comunidadeId } = getState().user; // ✅ Pega o token e o ID da comunidade
        const { image, caption } = postData; // Pega a imagem e a legenda

        // 2. CRIA UM OBJETO FORMDATA
        const formData = new FormData();
        formData.append('caption', caption); // Adiciona a legenda
        if (comunidadeId) {
            formData.append('comunidadeId', comunidadeId); // ✅ Adiciona o ID da comunidade
        }
        // Adiciona a imagem. O backend espera um campo chamado 'image'.
        formData.append('image', {
            uri: image.uri,
            type: image.type, // ex: 'image/jpeg'
            name: image.fileName || `post-image-${Date.now()}.jpg` // nome do arquivo
        });
        
        try {
            const response = await axios.post(
                `${API_URL}/posts`,
                formData, // ✅ Envia o FormData em vez de um JSON simples
                {
                    // 3. ANEXA O TOKEN E DEFINE O CONTENT-TYPE CORRETO
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data', // Essencial para o envio de arquivos
                    }
                }
            );
            
            // A API retorna o post completo, incluindo o ID e o nickname do autor
            return response.data; 
        } catch (error) {
            console.error("Erro ao criar post:", error);
            return rejectWithValue(error.response?.data?.message || 'Falha ao criar o post.');
        }
    }
);


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
         setPosts: (state, action) => { 
             state.posts = action.payload; 
             state.loading = false;
             state.error = null;
         },
         resetPostAdded: (state) => { // ✅ 2. Novo reducer para resetar o sinalizador
            state.postAdded = false;
         },
         // ... (outros reducers)
    },
    extraReducers: (builder) => {
        builder
            // loadPosts
            .addCase(loadPosts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loadPosts.fulfilled, (state, action) => { postsSlice.caseReducers.setPosts(state, action); })
            .addCase(loadPosts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
        
            // saveComment
            .addCase(saveComment.fulfilled, (state, action) => {
                const { postId, comment } = action.payload;
                const post = state.posts.find(p => p.id === postId);
                // Adiciona o novo comentário ao array local do post
                if (post) {
                    post.comments.push(comment); 
                }
            })
            
            // savePost
            .addCase(savePost.fulfilled, (state, action) => {
                // ✅ 3. Em vez de adicionar o post, apenas sinalizamos que um novo post foi adicionado.
                // Isso evita a re-renderização do Feed em segundo plano.
                state.postAdded = true;
            });

            // ✅ 2. Adicionar um caso para limpar os posts no logout
            builder.addCase(logout.fulfilled, (state) => {
                state.posts = [];
                state.error = null;
            });
    }
});

export const { setPosts, resetPostAdded } = postsSlice.actions; // ✅ 4. Exportar o novo reducer
export default postsSlice.reducer;