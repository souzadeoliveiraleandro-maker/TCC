// /src/Feed.js
import React, { Component } from "react";
import { StyleSheet, FlatList, View, TouchableOpacity, Text } from "react-native";
// 🔑 Importações Redux e Navigation
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Post from "../componentes/Post";

// Componente de Classe Pura para o Feed
class Feed extends Component{
    // ❌ REMOVER: O estado agora está no Redux
    /* state = { posts: [...] } */

    // 🔑 NOVO: Configura o botão do Header para navegar para a tela de Adicionar Post
    componentDidMount() {
        this.setNavigationOptions();
    }

    setNavigationOptions = () => {
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('AddPost')} 
                    style={styles.headerButton}
                >
                    {/* ℹ️ Assumindo que AddPost é uma tela na sua FeedStack */}
                    <Icon name="plus" size={24} color="#4286f4" />
                </TouchableOpacity>
            ),
            title: 'Feed Principal', // Título que definimos no Navigator.js
        });
    }

    render(){
        return(
            <View style={styles.container}>
                <FlatList 
                    data={this.props.posts} // 🔑 Dados vêm das props (Redux)
                    keyExtractor={item => `${item.id}`} 
                    renderItem={({item}) => <Post key={item.id} {...item} />}
                    contentContainerStyle={{paddingBottom: 100}}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>Nenhuma postagem ainda. Crie a primeira!</Text>
                    )}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#F5FCFF'
    },
    headerButton: {
        marginRight: 15,
        padding: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    }
})

// 🔑 Mapeia o estado do Redux para as propriedades do componente
const mapStateToProps = ({ posts }) => {
    return {
        posts: posts.posts // Acessa o array 'posts' dentro do slice 'posts'
    }
}

// 🔑 Wrapper para injetar a navegação e o Redux
function FeedWithRedux(props) {
    const navigation = useNavigation();
    return <Feed {...props} navigation={navigation} />;
}

export default connect(mapStateToProps)(FeedWithRedux);