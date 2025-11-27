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
import { useNavigation } from '@react-navigation/native'; 
import { useDispatch, useSelector } from 'react-redux';
import { saveEvent } from '../redux/slices/eventos.Slices'; // 🔑 Importa o Thunk
import { launchImageLibrary } from 'react-native-image-picker'; // ✅ Importar a função da galeria

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
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top'
    },
    button: {
        marginTop: 20,
        padding: 15, 
        backgroundColor: '#FFC107', 
        borderRadius: 8, 
        alignItems: 'center',
    },
    buttonText: { 
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
    },
});

// ------------------------------------------------------------------
// 2. O COMPONENTE DE CRIAÇÃO DE EVENTO
// ------------------------------------------------------------------
export default function CriarEventoScreen() {
    const navigation = useNavigation(); 
    const dispatch = useDispatch(); 
    const { loading: eventsLoading } = useSelector(state => state.events); 

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState(null); // ✅ Alterado para armazenar o objeto da imagem
    const [location, setLocation] = useState(''); // ✅ 1. Novo estado para o local
    const [description, setDescription] = useState(''); 
    
    const [isSending, setIsSending] = useState(false);

    // ✅ Função para abrir a galeria e selecionar a imagem
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

    // 🔑 FUNÇÃO PRINCIPAL: Chama o Thunk saveEvent
    const handleSaveEvent = () => {
        // ✅ 2. Validação atualizada para incluir o local
        if (!title || !date || !image || !location || !description) {
            Alert.alert('Atenção', 'Todos os campos, incluindo imagem e local, são obrigatórios.');
            return;
        }

        setIsSending(true);

        // ✅ 3. Formata a data para o padrão do banco de dados (yyyy-MM-dd hh:mm:ss)
        // Adiciona os segundos se o usuário não os digitou.
        const formattedDate = date.length === 16 ? `${date}:00` : date;
        
        // 🚀 DISPATCH DO THUNK: Envia os dados (incluindo o objeto da imagem)
        dispatch(saveEvent({ 
            title: title, 
            date: formattedDate, // Envia a data formatada
            image: image, // ✅ Envia o objeto da imagem
            localizacao: location, // ✅ CORREÇÃO: Enviando com a chave correta para o Thunk
            description: description,
        }))
            .unwrap()
            .then(() => {
                // Sucesso: O Redux foi sinalizado.
                Alert.alert('Sucesso!', 'Evento agendado com sucesso!');
                // Usamos um setTimeout para garantir que a navegação ocorra após
                // a renderização do estado do Redux, evitando a condição de corrida.
                setTimeout(() => {
                    navigation.goBack(); 
                }, 100);
            })
            .catch((backendError) => {
                // Falha: Exibe o erro
                Alert.alert('Erro ao Agendar', backendError || 'Não foi possível agendar o evento.');
            })
            .finally(() => {
                setIsSending(false);
            });
    };
    
    const finalLoading = eventsLoading || isSending;

    return(
        <View style={styles.container}> 
            <Text style={styles.title}>Agendar Novo Evento</Text>

            {/* ✅ Área de pré-visualização que também é um botão */}
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
                placeholder="Título do Evento" 
                style={styles.input}
                placeholderTextColor='#666'
                value={title}
                onChangeText={setTitle}
                editable={!finalLoading}
            />
            <TextInput 
                placeholder="Data e Hora (Ex: 2024-12-31 18:00)" 
                style={styles.input}
                placeholderTextColor='#666'
                value={date}
                onChangeText={setDate}
                editable={!finalLoading}
            />
            {/* ✅ 4. Novo campo de texto para o Local do Evento */}
            <TextInput 
                placeholder="Local do Evento (Ex: Online, Auditório Principal)" 
                style={styles.input}
                placeholderTextColor='#666'
                value={location}
                onChangeText={setLocation}
                editable={!finalLoading}
            />
            <TextInput 
                placeholder="Descrição Detalhada do Evento" 
                style={[styles.input, styles.multilineInput]}
                placeholderTextColor='#666'
                multiline={true}
                value={description}
                onChangeText={setDescription}
                editable={!finalLoading}
            />
            
            <TouchableOpacity 
                onPress={handleSaveEvent} 
                style={styles.button}
                disabled={finalLoading}
            > 
                {finalLoading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text style={styles.buttonText}>Agendar Evento</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}