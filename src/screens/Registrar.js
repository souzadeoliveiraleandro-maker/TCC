import React, { Component } from "react"; 
import { View, Text, StyleSheet,TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
// 🔑 Importações necessárias
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux'; 
import { loginSuccess } from '../../src/redux/slices/userSlices'

// ------------------------------------------------------------------
// 1. A CLASSE Register (AGORA CHAMA A PROPS onRegister)
// ------------------------------------------------------------------
class Registrar extends Component{ 
    state = {
        nome: '',
        sobrenome: '',
        email: '',
        password: '',
        cpf: '',
        datanacimento: '',
        numerocelular: '',
        confirmPassword: ''
    } 
    
    // 🔑 NOVA FUNÇÃO: Chama a prop onRegister injetada pelo wrapper
    register = () => {
        const { nome, email, password, confirmPassword } = this.state;

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        // ⚠️ Aqui seria o local para fazer a chamada à API/Firebase para criar a conta.
        // Se a chamada for bem-sucedida, o wrapper chama o login automático.
        this.props.onRegister({
            nome,
            email,
            password,
            // ... outros campos
        });
    }

    render (){
        return( 
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>     
                <Text style={styles.header}>Criar Nova Conta</Text>

                <TextInput placeholder="Nome:" style={styles.input} placeholderTextColor='#333'
                value={this.state.nome}
                onChangeText={nome => this.setState({nome})} /> 
                
                <TextInput placeholder="Sobrenome:" style={styles.input} placeholderTextColor='#333'
                value={this.state.sobrenome}
                onChangeText={sobrenome => this.setState({sobrenome})} />
                
                <TextInput placeholder="Email:" style={styles.input} placeholderTextColor='#333'
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={email => this.setState({email})} />
                
                <TextInput placeholder="Senha:" style={styles.input} placeholderTextColor='#333'
                secureTextEntry={true} value={this.state.password}  
                onChangeText={password => this.setState({password})} />
                
                <TextInput placeholder="Confirmar Senha:" style={styles.input} placeholderTextColor='#333'
                secureTextEntry={true} value={this.state.confirmPassword}
                onChangeText={confirmPassword => this.setState({confirmPassword})} />
                
                <TextInput placeholder="CPF:" style={styles.input} placeholderTextColor='#333'        
                value={this.state.cpf}
                onChangeText={cpf => this.setState({cpf})} />
                
                <TextInput placeholder="Data de Nascimento:" style={styles.input} placeholderTextColor='#333'    
                value={this.state.datanacimento}
                onChangeText={datanacimento => this.setState({datanacimento})} />
                
                <TextInput placeholder="Número de Celular:" style={styles.input} placeholderTextColor='#333'
                value={this.state.numerocelular}
                onChangeText={numerocelular => this.setState({numerocelular})} />
                
                {/* 🔑 CHAMADA AO NOVO MÉTODO register */}
                <TouchableOpacity onPress={this.register} style={styles.Button}>  
                    <Text style={styles.ButtonText}>Cadastrar</Text>
                </TouchableOpacity> 

                <TouchableOpacity 
                    onPress={ () => this.props.navigation.navigate('Login') } 
                    style={styles.backButton}>
                    <Text style={styles.backButtonText}>Já tenho conta...</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }  
}

// ------------------------------------------------------------------
// 2. O WRAPPER QUE INJETA REDUX E NAVEGAÇÃO
// ------------------------------------------------------------------
function RegistrarWithRedux(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // 🔑 FUNÇÃO DE REGISTRO E LOGIN AUTOMÁTICO
    const handleReduxRegister = (userData) => {
        // --- SIMULAÇÃO: Registro bem-sucedido na API ---
        Alert.alert("Sucesso", "Cadastro realizado com sucesso! Você será logado automaticamente.");
        
        // 🔑 DISPATCH: Faz o login automático do novo usuário
        const newUserData = {
            token: 'NEW_USER_TOKEN', // Token gerado pelo backend
            name: userData.nome,
            email: userData.email,
            isAdmin: false, // Novos usuários são sempre padrão
        };

        dispatch(loginSuccess(newUserData));

        // Navega para a parte autenticada do app
        navigation.navigate('App');
    };

    // 🔑 Injeta a navegação e a nova função de registro
    return <Registrar 
        {...props} 
        navigation={navigation}
        onRegister={handleReduxRegister} // Injeta a função que contém o Dispatch
    />;
}

// ------------------------------------------------------------------
// 3. ESTILOS ATUALIZADOS
// ------------------------------------------------------------------
const styles = StyleSheet.create({ 
    container:{ 
        flexGrow: 1, // Permite ScrollView
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    Button:{    
        marginTop:30,
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: '#4286f4',
        borderRadius: 8,
        elevation: 3,
    },
    ButtonText:{     
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    input:{
        marginTop: 15,
        width: '90%',
        backgroundColor: '#fff',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingLeft: 15,
        fontSize: 16,
        color: '#333'
    },
    backButton: {
        marginTop: 15,
        padding: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: '#4286f4',
    }
})

// ------------------------------------------------------------------
// 4. EXPORTAÇÃO FINAL
// ------------------------------------------------------------------
export default RegistrarWithRedux;