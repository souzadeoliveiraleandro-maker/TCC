import React from "react";
// ✅ PASSO 1: Reintroduzindo o Autor
import { StyleSheet, View, Text, Image, Dimensions } from "react-native"; 

import Autor from './Autor' // ⬅️ 1. Descomente a importação do Autor
import Comente from './comente' // ✅ CORREÇÃO: O caminho da importação foi corrigido para corresponder ao nome do arquivo renomeado.
// import CommentInput from './AdcionarComente'

const Post = (props) => {
    const imageSource = { uri: props.image_url || 'https://placehold.co/600x450/cccccc/333333/png?text=Sem+Imagem' };

    return(
        <View style={styles.container}>
            {/* Reintroduzindo a imagem para um visual mais completo */}
            <Image source={imageSource} style={styles.image} />

            {/* ⬅️ 2. Descomente o componente Autor */}
            <Autor email={props.email} name={props.name} />

            {/* ✅ PASSO 2: Reintroduzindo a legenda (caption) */}
            <Text style={styles.caption}>{props.caption}</Text>

            {/* ✅ PASSO 3: Reintroduzindo o componente que exibe os comentários */}
            <Comente comments={props.comments} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
    },
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 3 / 4,
        resizeMode: 'cover'
    },
    caption: {
        marginVertical: 10,
        marginHorizontal: 15,
        fontSize: 16,
        color: '#333'
    },
});

export default Post;