import React, { useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput, 
    Alert,
    ActivityIndicator,
    Image // Para pré-visualizar a imagem
} from "react-native";
import { launchImageLibrary } from 'react-native-image-picker'; // ✅ 1. Importar a função da galeria
import { useNavigation } from '@react-navigation/native'; 
import { useDispatch, useSelector } from 'react-redux';
import { savePost } from '../redux/slices/postsSlices'; // 🔑 Importa o Thunk de Criar Post

// ------------------------------------------------------------------
// 1. DEFINIÇÃO DO STYLES
// ------------------------------------------------------------------
const styles = StyleSheet.create({
    container:{
        flex:1,
        padding: 20,
        backgroundColor: '#f5f5f5', 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    imagePreview: {
        width: '100%',
        height: 200,
        backgroundColor: '#ccc',
        marginBottom: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1, 
        borderColor: '#ccc', 
        backgroundColor: '#fff', 
        minHeight: 50, 
        borderRadius: 8, 
        fontSize: 16,
        marginBottom: 15,
        textAlignVertical: 'top' // Útil para TextInput multiline
    },
    button: {
        marginTop: 20,
        padding: 15, 
        backgroundColor: '#FF6347', // Cor vibrante para o post
        borderRadius: 8, 
        alignItems: 'center',
    },
    buttonText: { 
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
});

// ------------------------------------------------------------------
// 2. O COMPONENTE DE CRIAÇÃO DE POST
// ------------------------------------------------------------------
export default function CriarPostScreen() {
    const navigation = useNavigation(); 
    const dispatch = useDispatch(); 
    // Acessa o estado de loading de posts (para saber se savePost está em execução)
    const { loading } = useSelector(state => state.posts); 

    const [image, setImage] = useState(null); // ✅ 2. Alterado para armazenar o objeto da imagem
    const [caption, setCaption] = useState('');
    const [isPosting, setIsPosting] = useState(false); // Estado de loading local

    // ✅ 3. Função para abrir a galeria e selecionar a imagem
    const handleSelectImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.8,
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('Seleção de imagem cancelada');
            } else if (response.errorCode) {
                Alert.alert('Erro', `Falha ao selecionar imagem: ${response.errorMessage}`);
            } else if (response.assets && response.assets.length > 0) {
                // Armazena o objeto completo do asset da imagem
                setImage(response.assets[0]);
            }
        });
    };

    // 🔑 FUNÇÃO PRINCIPAL: Chama o Thunk savePost
    const handleSavePost = () => {
        // Agora a imagem é obrigatória.
        if (!image) {
            Alert.alert('Atenção', 'Você precisa selecionar uma imagem para o post.');
            return;
        }

        setIsPosting(true); // Ativa o loading local antes de despachar
        
        // 🚀 DISPATCH DO THUNK: Envia os dados para a rota /api/posts (protegida)
        // O thunk agora receberá o objeto da imagem e a legenda
        dispatch(savePost({
            image: image, 
            caption: caption 
        }))
            .unwrap()
            .then(() => {
                // Sucesso! O Redux já atualizou o Feed.
                Alert.alert('Sucesso!', 'Postagem publicada na comunidade.');
                // Usamos um setTimeout para garantir que a navegação ocorra após
                // a renderização do estado do Redux, evitando a condição de corrida.
                setTimeout(() => {
                    navigation.goBack(); 
                }, 100); // Um pequeno atraso é suficiente.
            })
            .catch((backendError) => {
                // Falha: Exibe o erro
                Alert.alert('Erro ao Publicar', backendError || 'Não foi possível completar a postagem.');
            })
            .finally(() => {
                setIsPosting(false); // Desativa o loading local
            });
    };
    
    // O loading deve ser a junção do loading do Redux e o loading local
    const finalLoading = loading || isPosting;

    return(
        <View style={styles.container}> 
            <Text style={styles.title}>Nova Publicação</Text>

            {/* ✅ 4. Área de pré-visualização agora é um botão */}
            <TouchableOpacity style={styles.imagePreview} onPress={handleSelectImage} disabled={finalLoading}>
                {image?.uri ? (
                    <Image 
                        source={{ uri: image.uri }} 
                        style={{ width: '100%', height: '100%', borderRadius: 8 }}
                        resizeMode="cover"
                    />
                ) : (
                    <Text style={{ color: '#666' }}>Clique aqui para escolher uma imagem</Text>
                )}
            </TouchableOpacity>

            <TextInput 
                placeholder="Escreva uma legenda..." 
                style={[styles.input, { minHeight: 100 }]}
                placeholderTextColor='#666'
                multiline={true}
                value={caption}
                onChangeText={setCaption}
                editable={!finalLoading}
            />
            
            <TouchableOpacity 
                onPress={handleSavePost} 
                style={styles.button}
                disabled={finalLoading} // Desabilita durante o envio
            > 
                {finalLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Publicar</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}