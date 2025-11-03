import react,{Component} from "react";
import { StyleSheet, FlatList, View } from "react-native";
import Header from "../componentes/Header";
import Post from "../componentes/Post";

class Feed extends Component{
    state = {
        posts: [{
            id: Math.random(),
            nickname: 'Rafael Pereira',
            email: 'rafael@gmail.com',
            image: require('../../android/assets/imgs/pos1.jpg'),
            comments: [{
                nickname: 'Lyvia Otavia',
                comments: 'Vai Flamengo'
            },
            {
                nickname: 'Leandro Souza',
                comments: 'isso ai Lyvia',
            }]
        }, {
             id: Math.random(),
             nickname: 'Araujo Da Silva',
             email: 'araja.@gmail.com',
             image : require('../../android/assets/imgs/post2.jpg'),
             comments: [{
                nickname: 'Leandro souza',
                comments: 'Agora é guerra.'             }
             ]
        }]
    }

    render(){
        return(
            <View style={StyleSheet.container}>
                <Header></Header>
                <FlatList data={this.state.posts}
                keyExtractor={item => `${item.id}`} 
                renderItem={({item}) => <Post {...item}></Post>}
                contentContainerStyle={{paddingBottom: 100}}></FlatList>
            </View>
        )
    }
}

const styles =StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#000000ff'
    }
})

export default Feed