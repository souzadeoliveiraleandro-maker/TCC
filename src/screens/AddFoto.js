import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions, Platform, ScrollView, Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';

class AddFoto extends Component {
    state = {
        image: null,
        comment: '',

    }
    pickImage = () =>{
        ImagePicker.showImagePicker({
            title: 'Escolha a imagem',
            maxHeight: 600,
            maxWidth: 800
    }, res => {
        if(!res.didCancel){
            this.setState({image: {uri: res.uri, base64: res.data}})
        }
    })
    }

    save = async () => {
        Alert.alert('Imagem adicionada com sucesso!', this.state.comment)
    }

    render () {
        return (
            <ScrollView>
                <View style={styles.container}></View>
                <Text style={styles.title}>Compartilhar imagem</Text>
                <View style={styles.imageContainer}>
                    <Image source={this.state.image} style={styles.image}/>
                </View>
                <TouchableOpacity onpress={this.pickImage} style={styles.button}>
                    <Text style={styles.buttonText}>Escolher imagem</Text>
                </TouchableOpacity>
                <TextInput placeholder='Algum comentário para a foto?'
                    style={styles.input}
                    value={this.state.comment}
                    onChangeText={comment => this.setState({comment})}
                />
                <TouchableOpacity onPress={this.save} style={styles.button}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>

                
            </ScrollView>
        )
        }
    }




const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title : {
        fontSize: 20,
        marginTop: Platform.OS === 'ios' ? 40 : 10,
        fontWeight: 'bold'
    },
    imageContainer: {
        width: '90%',
        height: Dimensions.get('window').width * 3 / 4,
        backgroundColor: '#eee',
        marginTop: 10,
    },
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 3 / 4,
        resizeMode: 'center'  
    },
    buttom: {
        marginTop: 30,
        padding: 10,
        backgroundColor: '#4286f4'
    },
    buttonText: {
        color: '#fff',
    },
    input: {
        marginTop: 20,
        width: '90%'
    }
})

export default AddFoto;