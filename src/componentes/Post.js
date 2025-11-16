import React, {Component} from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";

import Autor from './Autor'
import Comente from './comente';
import AdicionarComentario from "./AdcionarComente";
// /src/componentes/Post.js
class Post extends Component {
    render() {
        return(
            <View style={styles.container}>
                <Image source={this.props.image} style={styles.image}></Image>
                {/* 🔑 O componente Autor recebe email e nickname */}
                <Autor email={this.props.email} nickname={this.props.nickname}></Autor> 
                <Comente comments={this.props.comments}></Comente>
                {/* 🔑 Passa o ID do Post para o componente de adição de comentário */}
                <AdicionarComentario postId={this.props.id}></AdicionarComentario> 
            </View>
        )
    }
}
// ... (exports)

const styles = StyleSheet.create({
    container: {
        paddingHorizonta: 10,
        marginBottom: 20,
    },
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 3 / 4,
        resizeMode: 'contain'
    }
})

export default Post