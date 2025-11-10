import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
// 💡 Importação necessária para o wrapper
import { useNavigation } from '@react-navigation/native'; 

// ------------------------------------------------------------------
// 1. DEFINIÇÃO DO STYLES (NO ESCOPO CORRETO)
// ------------------------------------------------------------------
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5', // Adicionando cor de fundo
    },
    button:{ 
        marginTop:30,
        padding:10, 
        backgroundColor: '#4286f4', 
        borderRadius: 5, // Borda arredondada
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
        borderColor: '#ccc', // Cor de borda mais suave
        backgroundColor: '#fff', // Input branco
        height: 50, // Altura ajustada
        borderRadius: 5, // Borda arredondada
        fontSize: 16,
    }
});
// ------------------------------------------------------------------


// 2. A CLASSE Login PERMANECE A MESMA
class Login extends Component{ 
    state = {
        email: '',
        password: ''
    }
    
    // Mudando para minúsculas (login e registro) para seguir a convenção
    login = () => {
        // Lógica de login real aqui
        this.props.navigation.navigate('App'); 
    }
    
    registro = () => {
        this.props.navigation.navigate('Registro')
    }
    
    render(){
        return(
            <View style={styles.container}> 
                
                {/* 💡 INPUTS COMPLETOS */}
                <TextInput placeholder="Email" style={styles.input}
                autoFocus={true} keyboardType="email-address"
                value={this.state.email}
                onChangeText={email => this.setState({email})} />
                
                <TextInput placeholder="Senha" style={styles.input}
                secureTextEntry={true} value={this.state.password}
                onChangeText={password => this.setState({password})} />
                {/* 💡 FIM DOS INPUTS */}
                
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
// 3. O WRAPPER QUE INJETA AS PROPS DE NAVEGAÇÃO
// ------------------------------------------------------------------
function LoginWithNavigation(props) {
  const navigation = useNavigation(); 
  return <Login {...props} navigation={navigation} />;
}

// ------------------------------------------------------------------
// 4. EXPORTAÇÃO FINAL
// ------------------------------------------------------------------
export default LoginWithNavigation;