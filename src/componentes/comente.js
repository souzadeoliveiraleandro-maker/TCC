import react, { Component } from "react"
import { View, Text, StyleSheet} from "react-native"

class Comente extends Component {
    render() {
        let view = null
        if (this.props.comments){
            view = this.props.comments.map((item, index) => {
                return(
                    <View style={StyleSheet.commentsContainer} key={index}>
                        <Text style={styles.nickname}> {item.nickname}</Text>
                        <Text style={styles.comente}> {item.comments}</Text>
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
        color: '#fdf8f8ff'
    },
    comente: {
        color: '#faf6f6ff'
    }
})

export default Comente