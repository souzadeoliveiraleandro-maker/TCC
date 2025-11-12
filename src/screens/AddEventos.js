import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions, Platform, ScrollView, Alert } from 'react-native';
// ⚠️ Mantemos o ImagePicker para a capa do evento
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; 
// Importamos o useNavigation para o wrapper
import { useNavigation } from '@react-navigation/native'; 

// Imagem placeholder para melhor UX
const initialImage = { uri: 'https://via.placeholder.com/300x225.png?text=Capa+do+Evento' };

class AddEvento extends Component {
    state = {
        // 💡 Campos atualizados para Eventos
        title: '',
        date: '', // Pode usar um Picker de data futuramente
        location: '',
        description: '', // Descrição substitui o 'comment'
        image: initialImage,
    }
    
    options = {
        mediaType: 'photo',
        quality: 1, 
        includeBase64: true, 
        maxHeight: 600,
        maxWidth: 800,
    };

    selectImageSource = () => {
        Alert.alert(
            "Selecione a Capa do Evento",
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
    
    handleResponse = (response) => {
        if (response.didCancel) {   
            console.log('Seleção cancelada pelo usuário');
        } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorCode);
            Alert.alert('Erro', `Falha ao selecionar imagem: ${response.errorMessage}`);
        } else if (response.assets && response.assets.length > 0) {
            const asset = response.assets[0];
            this.setState({
                image: { uri: asset.uri, base64: asset.base64 },
            });
        }
    };

    // 💡 Método save agora coleta todos os dados do evento
    save = async () => {
        const { title, date, location, description, image } = this.state;

        if (title.trim() === '' || date.trim() === '' || location.trim() === '' || description.trim() === '') {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos do evento.');
            return;
        }
        
        if (image.uri === initialImage.uri) {
            Alert.alert('Atenção', 'Por favor, selecione uma capa para o evento.');
            return;
        }

        // 💡 Aqui você faria a chamada à API para cadastrar o evento
        console.log('Dados do Evento prontos para API:', this.state);

        Alert.alert('Evento Criado!', `Título: ${title}\nLocal: ${location}`);
        
        // Retorna para a tela de Eventos (ou Feed) após salvar
        this.props.navigation.goBack(); 
    }

    render () {
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Criar Novo Evento</Text>
                
                {/* Título do Evento */}
                <TextInput placeholder='Título do Evento'
                    style={styles.input}
                    placeholderTextColor='#000'
                    value={this.state.title}
                    onChangeText={title => this.setState({title})}
                />
                
                {/* Data do Evento */}
                <TextInput placeholder='Data (Ex: 10/Dez/2025)'
                    style={styles.input}
                    placeholderTextColor='#000'
                    value={this.state.date}
                    onChangeText={date => this.setState({date})}
                />

                {/* Local do Evento */}
                <TextInput placeholder='Local / Endereço'
                    style={styles.input}
                    placeholderTextColor='#000'
                    value={this.state.location}
                    onChangeText={location => this.setState({location})}
                />

                {/* Descrição do Evento */}
                <TextInput placeholder='Descrição detalhada do evento'
                    style={[styles.input, styles.textArea]}
                    placeholderTextColor='#000'
                    multiline={true}
                    numberOfLines={4}
                    value={this.state.description}
                    onChangeText={description => this.setState({description})}
                />

                {/* Imagem de Capa */}
                <Text style={styles.imageLabel}>Capa do Evento</Text>
                <View style={styles.imageContainer}>
                    <Image source={this.state.image} style={styles.image}/>
                </View>
                
                <TouchableOpacity onPress={this.selectImageSource} style={styles.button}>
                    <Text style={styles.buttonText}>Escolher Capa</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={this.save} style={styles.button}>
                    <Text style={styles.buttonText}>Salvar Evento</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingBottom: 50,
        backgroundColor: '#fff',
    },
    title : {
        fontSize: 24,
        marginTop: 10,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    imageContainer: {
        width: '90%',
        height: Dimensions.get('window').width * 0.5, // Altura menor para a capa
        backgroundColor: '#eee',
        marginTop: 10,
        borderWidth: 1, 
        borderColor: '#ccc',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover' // Mudado para cover
    },
    imageLabel: {
        marginTop: 20,
        fontSize: 16,
        alignSelf: 'flex-start',
        marginLeft: '5%',
        fontWeight: 'bold',
    },
    button: { // Renomeado buttom para button
        marginTop: 30,
        padding: 10,
        backgroundColor: '#4286f4',
        minWidth: 180, 
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    input: {
        marginTop: 15,
        width: '90%',
        height: 50, // Aumentada a altura
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top', // Para o texto começar no topo em Android
        paddingTop: 10,
    }
})

// 💡 Wrapper de Navegação (Necessário para o this.props.navigation.goBack())
function AddEventoWithNavigation(props) {
    const navigation = useNavigation();
    return <AddEvento {...props} navigation={navigation} />;
}

export default AddEventoWithNavigation;