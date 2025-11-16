import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions, Platform, ScrollView, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; 
import { useNavigation } from '@react-navigation/native'; 

// 🔑 IMPORTAÇÕES REDUX
import { connect } from 'react-redux';
// ✅ CORREÇÃO: Usando o nome do arquivo que você confirmou: eventos.Slices
import { addEvent } from '../redux/slices/eventos.Slices'; 

const initialImage = { uri: 'https://via.placeholder.com/300x225.png?text=Capa+do+Evento' };

class AddEvento extends Component {
     state = {
         title: '',
         date: '', 
         location: '',
         description: '', 
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

     // 💡 Método save agora despacha a ação Redux
     save = async () => {
         const { title, date, location, description, image } = this.state;
        // 🔑 Obtendo a action e o nickname das props injetadas pelo Redux
        const { nickname, onAddEvent } = this.props; 
        
         if (title.trim() === '' || date.trim() === '' || location.trim() === '' || description.trim() === '') {
                    Alert.alert('Atenção', 'Por favor, preencha todos os campos do evento.');
                    return;
         }
         
         if (image.uri === initialImage.uri) {
                    Alert.alert('Atenção', 'Por favor, selecione uma capa para o evento.');
                    return;
         }

        // 1. Constrói o objeto do evento
        const newEvent = {
            id: Math.random().toString(), 
            title,
            date,
            location,
            description,
            creator: nickname || 'Admin', // Usa o nickname injetado
            imageURL: image.uri, 
        };

        // 2. Despacha a ação para o Redux Store
        onAddEvent(newEvent); // 🔑 ESTA LINHA É CRÍTICA!

         Alert.alert('Sucesso!', `O evento "${title}" foi criado e adicionado à lista.`);
        
         // 3. Retorna para a tela de Eventos
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
         height: Dimensions.get('window').width * 0.5, 
         backgroundColor: '#eee',
         marginTop: 10,
         borderWidth: 1, 
         borderColor: '#ccc',
         overflow: 'hidden',
     },
     image: {
         width: '100%',
         height: '100%',
         resizeMode: 'cover' 
     },
     imageLabel: {
         marginTop: 20,
         fontSize: 16,
         alignSelf: 'flex-start',
         marginLeft: '5%',
         fontWeight: 'bold',
     },
     button: { 
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
         height: 50, 
         borderColor: '#ccc',
         borderWidth: 1,
         borderRadius: 5,
         paddingHorizontal: 15,
         backgroundColor: '#f9f9f9',
     },
     textArea: {
         height: 100,
         textAlignVertical: 'top', 
         paddingTop: 10,
     }
})

// ------------------------------------------------------------------
// 🔑 Conexão Redux e Navegação (Novo Wrapper)
// ------------------------------------------------------------------

// 1. Mapeia o estado do Redux para as props (apenas o nickname do usuário)
const mapStateToProps = ({ user }) => {
    return {
        nickname: user.nickname,
    };
};

// 2. Mapeia a action do Redux para as props
const mapDispatchToProps = dispatch => {
    return {
        // Agora você pode chamar this.props.onAddEvent(newEvent)
        onAddEvent: event => dispatch(addEvent(event)),
    };
};

// 3. Conecta a classe AddEvento ao Redux
const AddEventoWrapped = connect(mapStateToProps, mapDispatchToProps)(AddEvento);

// 4. Wrapper HOC para injetar navegação
function AddEventoWithNavigation(props) {
     const navigation = useNavigation();
     return <AddEventoWrapped {...props} navigation={navigation} />;
}

export default AddEventoWithNavigation;