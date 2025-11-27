import React from "react"
import { View, Text, StyleSheet} from "react-native"

// ------------------------------------------------------------------
// 2. O COMPONENTE DE LISTAGEM DE COMENTÁRIOS (Funcional)
// ------------------------------------------------------------------
// Recebe a lista de comentários como prop, tipicamente do Redux Store.
const Comente = ({ comments = [] }) => {
    // Renderiza a lista de comentários se a prop 'comments' existir e tiver itens.
    const commentViews = comments.map((item, index) => (
        <View style={styles.comenteContainer} key={index}>
            {/* O campo nickname deve existir no objeto de comentário vindo do backend */}
            <Text style={styles.nickname}> {item.nickname}:</Text>
            
            {/* O campo 'comment' (ou 'text') armazena o conteúdo do comentário */}
            <Text style={styles.comment}> {item.comment}</Text> 
        </View>
    ));
    
    return (
        <View style={styles.container}>
            {commentViews}
        </View>
    )
}

// ------------------------------------------------------------------
// 1. DEFINIÇÃO DO STYLES
// ------------------------------------------------------------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    comenteContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    nickname: {
        marginLeft: 5,
        fontWeight: 'bold',
        color: '#444' // Cor escura para melhor contraste
    },
    comment: { 
        color: '#555', // Cor escura para melhor contraste
        marginLeft: 5, // Adiciona um pequeno espaço após o nickname
    }
})

export default Comente