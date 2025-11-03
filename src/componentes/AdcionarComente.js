import react, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback as TWF, Alert } from "react-native"
import { FontAwesome } from '@react-native-vector-icons/fontawesome';

class AdicionarComentario extends Component {
    state = {
        comments: '',
        editMode: false
    }
    HandleAddComentario = () => {
        Alert.alert('Adicionado!', this.state.comments)
    }
    render() {
        let commentsNaArea = null
        if (this.state.editMode) {
            commentsNaArea = (
                <View style={styles.container}>
                    <TextInput
                        placeholder='Pode comentar..'
                        style={styles.input}
                        autoFocus={true}
                        value={this.state.comments}
                        onChangeText={comments => this.setState({ comments })}
                        onSubmitEditing={this.HandleAddComentario}
                    />
                    <TWF onPress={() => this.setState({ editMode: false })}>
                        <FontAwesome name='times' size={15} color='#555'></FontAwesome>
                    </TWF>
                </View>
            )
        } else {
            commentsNaArea = (
                <TWF onPress={() => this.setState({ editMode: true })}>
                    <View style={styles.container}>
                        <FontAwesome name='comment' size={25} color='#555'></FontAwesome>
                        <Text style={styles.caption}>
                            Adicionar comentario...
                        </Text>
                    </View>
                </TWF>
            )
        }
        return (
            <View style={{width: '100%', paddingHorizontal: 10, backgroundColor: '#eef'}}>
                {commentsNaArea}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    caption: {
        marginLeft: 10,
        fontSize: 12,
        color: '#ccc'
    },
    input: {
        width: '90%',
        padding: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff'
    }
})

export default AdicionarComentario
