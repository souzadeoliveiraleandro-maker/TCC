import React, { useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput, 
    Alert,
    ActivityIndicator 
} from "react-native";
// ✅ IMPORTAÇÃO CORRIGIDA: Adicionando CommonActions
import { useNavigation, CommonActions } from '@react-navigation/native'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { signInUser } from '../redux/slices/userSlices'; 

// ------------------------------------------------------------------
// STYLES
// ------------------------------------------------------------------
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5', 
    },
    button:{ 
        marginTop:30,
        padding:10, 
        backgroundColor: '#007AFF', // Azul primário
        borderRadius: 8, 
        width: '90%',
        alignItems: 'center',
    },
    buttonText:{ 
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    input:{
        marginTop: 20,
        width: '90%',
        padding: 15,
        borderWidth: 1, 
        borderColor: '#ccc', 
        backgroundColor: '#fff', 
        height: 55, 
        borderRadius: 8, 
        fontSize: 16,
        color: '#333'
    },
    linkButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#555', // Cor secundária
        borderRadius: 8,
    },
    linkText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    errorText: {
        color: '#DC3545', // Vermelho de erro
        marginTop: 15,
        textAlign: 'center',
        paddingHorizontal: 20,
        fontSize: 14,
    }
});

// ------------------------------------------------------------------
// COMPONENTE DE LOGIN
// ------------------------------------------------------------------
export default function LoginScreen() {
    const navigation = useNavigation(); 
    const dispatch = useDispatch(); 
    const { loading, error } = useSelector(state => state.user); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Atenção', 'Você precisa informar e-mail e senha.');
            return;
        }

   // 🚀 DISPATCH DO THUNK: Envia credenciais
        dispatch(signInUser({ email, password }))
            .unwrap() 
            .then(() => { 
                // SUCESSO!
                // A navegação agora é tratada automaticamente pelo componente RootStackContent
                // em Navigator.js, que detecta a mudança no token e troca a tela.
                // Remover a navegação manual daqui resolve a condição de corrida.
            }) 
            .catch((backendError) => {
                // Falha: O erro já está no Redux
                Alert.alert('Erro no Login', backendError || 'Falha na comunicação com o servidor.');
            });
    };

    return(
        <View style={styles.container}> 
            <TextInput 
                placeholder="Email" 
                style={styles.input}
                placeholderTextColor='#999'
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
            />
            
            <TextInput 
                placeholder="Senha" 
                style={styles.input}
                placeholderTextColor='#999'
                secureTextEntry={true} 
                value={password}
                onChangeText={setPassword}
                editable={!loading}
            />
            
            <TouchableOpacity 
                onPress={handleLogin} 
                style={styles.button}
                disabled={loading} 
            > 
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Entrar</Text>
                )}
            </TouchableOpacity>
            
            <TouchableOpacity 
                onPress={() => navigation.navigate('Registro')} 
                style={[styles.button, styles.linkButton]}
                disabled={loading}
            > 
                <Text style={styles.linkText}>Criar nova conta</Text>
            </TouchableOpacity>

            {error && !loading && (
                // ✅ Garante que a mensagem de erro da API será exibida
                <Text style={styles.errorText}>Erro: {error}</Text>
            )}
        </View>
    );
}

// O restante do seu arquivo de navegação (App.js ou similar) permanece o mesmo.