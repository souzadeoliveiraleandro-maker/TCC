// [Local do seu App.js ou index.js]

// 1. Imports do React e RN
import React, { Component } from "react";
import { View } from "react-native";

// 2. Imports de terceiros/bibliotecas
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

// 3. Chamada da função de inicialização APÓS todos os imports
enableScreens();

// 4. Imports de componentes locais
import Header from './src/componentes/Header'
import Post from './src/componentes/Post'


export default class App extends Component{
    // ... restante da classe

    render() {
        const comments = [{
            nickname: 'Leandro Souza',
            comment: 'Bela foto'
        },  {
            nickname: 'Lyvia Souza',
            comment : 'YURI ALBERTOOO'
        }
        
    ]
        return(
            <View style={{flex: 1}}>
                <Header/>
                <Post image={require('./android/assets/imgs/chat.png')}
                    comments={comments}/>
            </View>
        )
    }
}