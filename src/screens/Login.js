import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native'; 

// 🔑 IMPORTAÇÕES DO REDUX
import { useDispatch } from 'react-redux'; 
import { loginSuccess } from '../../src/redux/slices/userSlices'


// ------------------------------------------------------------------
// 1. DEFINIÇÃO DO STYLES
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
        backgroundColor: '#4286f4', 
        borderRadius: 5, 
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
        padding: 10,
        borderWidth: 1, 
        borderColor: '#ccc', 
        backgroundColor: '#fff', 
        height: 50, 
        borderRadius: 5, 
        fontSize: 16,
    }
});
// ------------------------------------------------------------------


// 2. A CLASSE Login (AGORA CHAMA A PROPS INJETADA)
class Login extends Component{ 
    state = {
        email: '',
        password: ''
    }
    
    // 🔑 O método LOGIN AGORA CHAMA A PROPS onLogin INJETADA PELO WRAPPER
    login = () => {
        // Envia o email e a senha para a função no wrapper que contém o dispatch do Redux
        this.props.onLogin(this.state.email, this.state.password); 
    }
    
    registro = () => {
        this.props.navigation.navigate('Registro')
    }
    
    render(){
        return(
            <View style={styles.container}> 
                <TextInput placeholder="Email" style={styles.input}
                autoFocus={true} keyboardType="email-address"
                value={this.state.email}
                onChangeText={email => this.setState({email})} />
                
                <TextInput placeholder="Senha" style={styles.input}
                secureTextEntry={true} value={this.state.password}
                onChangeText={password => this.setState({password})} />
                
                <TouchableOpacity onPress={this.login} style={styles.button}> 
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={this.registro} style={styles.button}> 
                    <Text style={styles.buttonText}> Criar nova conta..</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


// ------------------------------------------------------------------
// 3. O WRAPPER QUE INJETA REDUX E NAVEGAÇÃO
// ------------------------------------------------------------------
function LoginWithNavigation(props) {
    const navigation = useNavigation(); 
    const dispatch = useDispatch(); // 🔑 Inicializa o Dispatch para Redux

    // 🔑 FUNÇÃO DE AÇÃO DE LOGIN: Simula a resposta da API e dispara a Action
    const handleReduxLogin = (email, password) => {
        
        // ⚠️ Aqui é onde você fará a chamada de autenticação REAL (API / Firebase)
        console.log(`Tentativa de Login com Email: ${email}`);
        
        // 🔑 Dados de Exemplo (SIMULAÇÃO): 
        // Se o email for 'admin@app.com', definimos isAdmin como true.
        const isAdminUser = email === 'admin@app.com'; 

        const mockUserData = {
            token: 'TOKEN_MOCK_XYZ',
            name: isAdminUser ? 'Admin Master' : 'Usuário Padrão',
            email: email,
            isAdmin: isAdminUser, // Informação de Permissão
        };

        // 🚀 DISPATCH: Armazena o usuário e as permissões na Store do Redux
        dispatch(loginSuccess(mockUserData));

        // Navega para a parte autenticada do app
        navigation.navigate('App');
    };

    // 🔑 Injeta a navegação e a nova função de login no componente de classe
    return <Login 
        {...props} 
        navigation={navigation}
        onLogin={handleReduxLogin} // Injeta a função que contém o Dispatch
    />;
}

// ------------------------------------------------------------------
// 4. EXPORTAÇÃO FINAL
// ------------------------------------------------------------------
export default LoginWithNavigation;