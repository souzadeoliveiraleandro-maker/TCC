import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator,
    Alert 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { saveComment } from '../redux/slices/postsSlices'; // 🔑 Importa o Thunk de Comentário

// ------------------------------------------------------------------
// 1. DEFINIÇÃO DO STYLES
// ------------------------------------------------------------------
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        fontSize: 14,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        width: 70,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

// ------------------------------------------------------------------
// 2. O COMPONENTE DE INPUT DE COMENTÁRIO
// ------------------------------------------------------------------
export default function AdcionarComente({ postId }) {
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState('');
    const [isSending, setIsSending] = useState(false);

    // O Thunk saveComment usa o estado do usuário (token) para autenticar
    // e o estado de posts para saber se já há outro post sendo enviado
    const { loading: postsLoading } = useSelector(state => state.posts);

    const handleSendComment = () => {
        if (!commentText.trim()) return; // Ignora comentários vazios

        setIsSending(true);

        // 🚀 DISPATCH DO THUNK: Envia o comentário para a rota protegida
        dispatch(saveComment({ 
            postId: postId,
            text: commentText.trim() 
        }))
            .unwrap()
            .then(() => {
                // Sucesso: O comentário já foi adicionado ao array local (postsSlices)
                setCommentText(''); // Limpa o input
            })
            .catch((backendError) => {
                Alert.alert('Erro', backendError || 'Falha ao enviar comentário. Tente novamente.');
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    const isDisabled = isSending || postsLoading;

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Adicione um comentário..."
                placeholderTextColor="#999"
                value={commentText}
                onChangeText={setCommentText}
                editable={!isDisabled}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleSendComment}
                disabled={isDisabled}
            >
                {isDisabled ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={styles.buttonText}>Enviar</Text>
                )}
            </TouchableOpacity>*//
        </View>
    );
}