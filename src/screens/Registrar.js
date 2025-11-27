import React, { useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput, 
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView, // Para evitar que o teclado esconda inputs
    Platform,
    ScrollView 
} from "react-native";
import { useNavigation } from '@react-navigation/native'; 
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../redux/slices/userSlices'; 

// ------------------------------------------------------------------
// COMPONENTE DE REGISTRO
// ------------------------------------------------------------------
export default function RegistroScreen() {
    const navigation = useNavigation(); 
    const dispatch = useDispatch(); 
    // Certifique-se de que a fatia (slice) do Redux está correta, geralmente 'user'
    const { loading, error } = useSelector(state => state.user || { loading: false, error: null }); 

    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        // Remove espaços em branco antes de validar
        const trimmedEmail = email.trim();
        const trimmedNickname = nickname.trim();
        const trimmedName = name.trim();
        const trimmedPassword = password.trim();


        if (!trimmedName || !trimmedNickname || !trimmedEmail || !trimmedPassword) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
            return;
        }

        // 🚀 DISPATCH DO THUNK: Envia os dados limpos
        dispatch(signUpUser({ 
            name: trimmedName, 
            nickname: trimmedNickname, 
            email: trimmedEmail, 
            password: trimmedPassword 
        }))
            .unwrap()
            .then(() => {
                // Navegar para outra tela ou mostrar sucesso
                Alert.alert('Sucesso!', 'Seu registro foi concluído. Faça login agora.');
                navigation.navigate('Login');
            })
            .catch((backendError) => {
                // O erro deve ser a mensagem que o back-end retornou
                // Usamos o 'error' do Redux para exibir a mensagem na UI
                // O Thunk deve garantir que 'backendError' é uma string
                Alert.alert('Erro no Registro', backendError || 'Falha na comunicação com o servidor.');
            });
    };

    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.fullScreen}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Criar Nova Conta</Text>

                <TextInput 
                    placeholder="Nome Completo" 
                    style={styles.input}
                    placeholderTextColor='#A0A0A0'
                    value={name}
                    onChangeText={setName}
                    editable={!loading}
                />
                <TextInput 
                    placeholder="Nickname (Usuário)" 
                    style={styles.input}
                    placeholderTextColor='#A0A0A0'
                    value={nickname}
                    onChangeText={setNickname}
                    autoCapitalize="none"
                    editable={!loading}
                />
                <TextInput 
                    placeholder="Email" 
                    style={styles.input}
                    placeholderTextColor='#A0A0A0'
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                />
                <TextInput 
                    placeholder="Senha" 
                    style={styles.input}
                    placeholderTextColor='#A0A0A0'
                    secureTextEntry={true} 
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                />
                
                <TouchableOpacity 
                    onPress={handleRegister} 
                    style={[styles.button, loading && styles.buttonDisabled]}
                    disabled={loading} 
                > 
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Registrar</Text>
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Login')} 
                    style={styles.textLink}
                    disabled={loading}
                > 
                    <Text style={styles.textLinkText}>Já tenho conta</Text>
                </TouchableOpacity>
                
                {/* Exibe o erro vindo do Redux, que é a mensagem do Back-end */}
                {error && !loading && (
                    <Text style={styles.errorText}>Erro: {error}</Text>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: '#1E1E2F', // Fundo escuro
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFFFFF', // Título branco
        marginBottom: 30,
    },
    input: {
        width: '100%',
        maxWidth: 350,
        height: 50,
        backgroundColor: '#3A3A4A', // Fundo do input levemente mais claro
        borderRadius: 10,
        paddingHorizontal: 15,
        color: '#FFFFFF', // Cor do texto digitado
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#555',
    },
    button: {
        width: '100%',
        maxWidth: 350,
        height: 50,
        backgroundColor: '#00BFFF', // Azul vibrante para ação primária
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    buttonDisabled: {
        backgroundColor: '#007AA3', // Tom de azul mais escuro quando desabilitado
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textLink: {
        marginTop: 20,
        padding: 10,
    },
    textLinkText: {
        color: '#FFFFFF', // Texto branco para link
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: '#FF6347', // Vermelho coral para erros
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        paddingHorizontal: 10,
    }
});