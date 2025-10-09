import React, {Component} from "react";
import Header from './src/componentes/Header'
import Post from './src/componentes/Post'
import { View } from "react-native";

export default class App extends Component{
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