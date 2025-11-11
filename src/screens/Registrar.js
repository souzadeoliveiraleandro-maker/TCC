import React from "react";  
import { Button } from "react-native";  
import { View, Text, StyleSheet,TouchableOpacity, TextInput } from "react-native";

class register extends React.Component{ 
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
     render (){
        return( 
            <View style={styles.container}>     
                <TextInput placeholder="Nome:" style={styles.input} placeholderTextColor='#000'
                autoFocus={true} 
                value={this.state.nome}
                onChangeText={nome => this.setState({nome})} /> 
                <TextInput placeholder="Sobrenome:" style={styles.input} placeholderTextColor='#000'
                autoFocus={true} 
                value={this.state.sobrenome}
                onChangeText={sobrenome => this.setState({sobrenome})} />
                <TextInput placeholder="Email:" style={styles.input} placeholderTextColor='#000'
                autoFocus={true} keyboardType="email-address"
                value={this.state.email}
                onChangeText={email => this.setState({email})} />
                <TextInput placeholder="Senha:" style={styles.input} placeholderTextColor='#000'
                secureTextEntry={true} value={this.state.password}  
                onChangeText={password => this.setState({password})} />
                <TextInput placeholder="Confirmar Senha:" style={styles.input} placeholderTextColor='#000'
                secureTextEntry={true} value={this.state.confirmPassword}
                onChangeText={confirmPassword => this.setState({confirmPassword})} />
                <TextInput placeholder="CPF:" style={styles.input} placeholderTextColor='#000'
                autoFocus={true}        
                value={this.state.cpf}
                onChangeText={cpf => this.setState({cpf})} />
                <TextInput placeholder="Data de Nascimento:" style={styles.input} placeholderTextColor='#000'    
                autoFocus={true}
                value={this.state.datanacimento}
                onChangeText={datanacimento => this.setState({datanacimento})} />
                <TextInput placeholder="Número de Celular:" style={styles.input} placeholderTextColor='#000'
                autoFocus={true}
                value={this.state.numerocelular}
                onChangeText={numerocelular => this.setState({numerocelular})} />
                <TouchableOpacity onPress={ () => {
                    this.props.navigation.navigate('Login') 
                }} style={styles.Button}>  
                    <Text style={styles.ButtonText}>Cadastrar</Text>
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
    Button:{    
        marginTop:30,
        padding:10,
        backgroundColor: '#4286f4ff',
    },
    ButtonText:{     
        fontSize: 20,
        color: '#f7f4f4ff',
    },
    input:{
        marginTop: 20,
        width: '90%',
        backgroundColor: '#f6f8fcff',
        height: 40,
        borderWidth: 1,
        borderColor: '#333',
        paddingLeft: 15,
        
    }
    })
export default register