// /src/componentes/Comente.js
import react, { Component } from "react"
import { View, Text, StyleSheet} from "react-native"

class Comente extends Component {
    render() {
        let view = null
        if (this.props.comments){
            view = this.props.comments.map((item, index) => {
                return(
                    <View style={styles.comenteContainer} key={index}>
                        <Text style={styles.nickname}> {item.nickname}</Text>
                        {/* 🔑 Usando item.comment, que é o campo que definimos no Redux */}
                        <Text style={styles.comment}> {item.comment}</Text> 
                    </View>
                )
            })
        }    
    return (
    <View style={styles.container}>
        {view}
    </View>
    )
    }
}

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
    comment: { // Renomeado de 'comente' para 'comment'
        color: '#555' // Cor escura para melhor contraste
    }
})

export default Comente