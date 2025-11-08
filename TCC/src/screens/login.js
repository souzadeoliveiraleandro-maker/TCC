import React, { Component } from "react";
import { View, Text, StyleSheet,TouchableOpacity, TextInput } from "react-native";

class Login extends Component{ 
    state = {
        email: '',
        password: ''
    }
    
    // Método de login: Navega para o App principal
    login = () => {
        // CORREÇÃO: Navega para a rota principal 'App'
        this.props.navigation.navigate('login');
    }
    
    // Método de registro: Navega para a rota 'Register' dentro do AuthStack
    register = () => {
        this.props.navigation.navigate('Register')
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
                
                <TouchableOpacity onPress={this.register} style={styles.button}> 
                    <Text style={styles.buttonText}> Criar nova conta..</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button:{ 
        marginTop:30,
        padding:10, 
        backgroundColor: '#4286f4', 
    },
    buttonText:{    
        fontSize: 20,
        color: '#fff',
    },
    input:{
        marginTop: 20,
        width:  '90%',
        padding: 10,
        borderWidth: 1,     
        borderColor: '#333',
        backgroundColor: '#EEE',
        height: 40,
    }
})
export default Login