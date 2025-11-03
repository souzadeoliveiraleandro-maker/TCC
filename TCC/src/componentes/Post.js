import React, {Component} from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";

import Autor from './Autor'
import Comente from './comente';
import AdicionarComentario from "./AdcionarComente";
class Post extends Component {
    render() {
        return(
            <View style={styles.container}>
                <Image source={this.props.image} style={styles.image}></Image>
                <Autor email={this.props.email} nickname={this.props.nickname}></Autor>
                <Comente comments={this.props.comments}></Comente>
                <AdicionarComentario></AdicionarComentario>
            </View>
        )
    }
}

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