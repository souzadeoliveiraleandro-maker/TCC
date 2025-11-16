// /redux/slices/postsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // 🔑 O array de posts está vazio.
    posts: [] 
    // Você pode adicionar um loading state aqui para controle:
    // loading: false,
    // error: null,
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
        addComment: (state, action) => {
            const { postId, comment } = action.payload;
            
            const post = state.posts.find(p => p.id === postId);

            if (post) {
                post.comments.push(comment);
            }
        },
        // 💡 Opcional: Adicionar uma action para popular os posts via API
            setPosts: (state, action) => {
             state.posts = action.payload;
         }
    },
});

export const { addPost, addComment, setPosts } = postsSlice.actions; 
export default postsSlice.reducer;