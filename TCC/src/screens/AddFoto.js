import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions, Platform, ScrollView, Alert} from 'react-native';
// ⚠️ ATUALIZAÇÃO 1: Importe as funções específicas da nova API
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; 

// Imagem placeholder para melhor UX
const initialImage = { uri: 'https://via.placeholder.com/300x225.png?text=Toque+em+Escolher+Imagem' };

class AddFoto extends Component {
    state = {
        image: initialImage,
        comment: '',
    }
    
    // Configurações para as funções da nova API
    options = {
        mediaType: 'photo',
        quality: 1, // Qualidade 100%
        includeBase64: true, // Inclui o Base64, como no seu código original
        maxHeight: 600,
        maxWidth: 800,
    };

    // ⚠️ ATUALIZAÇÃO 2: Novo método para selecionar a fonte da imagem (Galeria ou Câmera)
    selectImageSource = () => {
        Alert.alert(
            "Selecione a fonte da imagem",
            "De onde você quer selecionar a imagem?",
            [
                { text: "Câmera", onPress: () => this.launchCamera() },
                { text: "Galeria", onPress: () => this.launchGallery() },
                { text: "Cancelar", style: "cancel" }
            ]
        );
    };

    launchCamera = () => {
        launchCamera(this.options, this.handleResponse);
    };

    launchGallery = () => {
        launchImageLibrary(this.options, this.handleResponse);
    };
    
    // ⚠️ ATUALIZAÇÃO 3: Nova forma de tratar a resposta da API
    handleResponse = (response) => {
        if (response.didCancel) {   
            console.log('Seleção cancelada pelo usuário');
        } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorCode);
            Alert.alert('Erro', `Falha ao selecionar imagem: ${response.errorMessage}`);
        } else if (response.assets && response.assets.length > 0) {
            const asset = response.assets[0];
            this.setState({
                // O resultado agora vem em 'response.assets'
                image: { uri: asset.uri, base64: asset.base64 },
            });
        }
    };

    save = async () => {
        if (this.state.image.uri !== initialImage.uri) {
            Alert.alert('Imagem adicionada com sucesso!', this.state.comment)
        } else {
            Alert.alert('Atenção', 'Por favor, selecione uma imagem antes de salvar.');
        }
    }

    render () {
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* ⚠️ CORREÇÃO DE ESTILO: removi o container vazio */}
                <Text style={styles.title}>Compartilhar imagem</Text>
                
                <View style={styles.imageContainer}>
                    <Image source={this.state.image} style={styles.image}/>
                </View>
                
                {/* ⚠️ CORREÇÃO DE ERRO: onpress -> onPress e apontando para o novo seletor */}
                <TouchableOpacity onPress={this.selectImageSource} style={styles.buttom}>
                    <Text style={styles.buttonText}>Escolher imagem</Text>
                </TouchableOpacity>
                
                <TextInput placeholder='Algum comentário para a foto?'
                    style={styles.input}
                    value={this.state.comment}
                    onChangeText={comment => this.setState({comment})}
                />
                
                <TouchableOpacity onPress={this.save} style={styles.buttom}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
            </ScrollView>
        )
        }
    }

const styles = StyleSheet.create({
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: 50,
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
        borderWidth: 1, 
        borderColor: '#ccc',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain' 
    },
    buttom: {
        marginTop: 30,
        padding: 10,
        backgroundColor: '#4286f4',
        minWidth: 180, 
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
    },
    input: {
        marginTop: 20,
        width: '90%',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingHorizontal: 5,
    }
})

export default AddFoto;