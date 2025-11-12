import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { Gravatar } from 'react-native-gravatar'
// 💡 Importações para funcionalidade de imagem
import { launchImageLibrary } from 'react-native-image-picker' 
import Icon from 'react-native-vector-icons/FontAwesome'
// 💡 Importação essencial para navegação em componente de classe
import { useNavigation } from '@react-navigation/native' 

const initialImage = { uri: 'https://seusite.com/default-avatar.png' }; // Placeholder para foto padrão

class Profile extends Component{
    state = {
        // Inicialmente usa o Gravatar, mas será substituído se o usuário escolher uma foto
        image: null, 
        email: 'flyviasouzamelo@gmail.com', // Mantendo o email para o Gravatar fallback
    }

    // Função para sair da conta
    logout = () => {
        // Lógica de desautenticação real (limpar token)
        this.props.navigation.navigate('Auth')
    }

    // 💡 Novo método para selecionar a foto da galeria
    selectProfilePicture = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.7,
            includeBase64: false,
            maxHeight: 200,
            maxWidth: 200,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('Seleção cancelada');
            } else if (response.errorCode) {
                Alert.alert('Erro', `Falha ao selecionar imagem: ${response.errorMessage}`);
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                this.setState({
                    image: { uri: asset.uri }, // Atualiza o estado com a nova imagem
                });
            }
        });
    }

    render(){
        const { email, image } = this.state;
        const gravatarOptions = { email: email, secure: true };
        
        return(
            <View style={styles.container}>
                {/* 💡 Área da Foto de Perfil com Gravatar ou Imagem Escolhida */}
                <TouchableOpacity onPress={this.selectProfilePicture} style={styles.avatarContainer}>
                    {image ? (
                        <Image source={image} style={styles.avatar} />
                    ) : (
                        <Gravatar options={gravatarOptions} style={styles.avatar} />
                    )}
                    {/* Ícone de Câmera/Edição sobreposto */}
                    <View style={styles.cameraIcon}>
                        <Icon name="camera" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>

                <Text style={styles.nickname}>Leandro otario</Text>
                <Text style={styles.email}>Leandrootario@gmail.com</Text>

                {/* 💡 Botão de Edição de Perfil */}
                <TouchableOpacity onPress={() => Alert.alert('Ação', 'Navegar para Edição de Perfil')} style={styles.editButton}>
                    <Icon name="pencil" size={18} color="#4286f4" style={{ marginRight: 8 }} />
                    <Text style={styles.editText}>Editar Perfil</Text>
                </TouchableOpacity>

                {/* 💡 Botão Sair (buttom corrigido para button) */}
                <TouchableOpacity onPress={this.logout} style={styles.button}>
                    <Text style={styles.buttonText}>Sair</Text>
                </TouchableOpacity>
            </View>
        )
    }  
}

const styles = StyleSheet.create({
    container:{
        flex:1, 
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: '#f5f5f5',
    },
    // 💡 Novo container para agrupar a foto e o ícone
    avatarContainer: {
        width: 150,
        height: 150,
        marginTop: 20,
        marginBottom: 20,
    },
    avatar:{
        width: '100%',
        height: '100%',
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#fff',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4286f4',
        borderRadius: 20,
        padding: 8,
        borderWidth: 2,
        borderColor: '#fff',
    },
    nickname:{
        marginTop:10,
        fontSize: 30,
        fontWeight: 'bold',
    },
    email:{
        marginTop:5,
        fontSize: 18,
        color: '#666',
    },
    // 💡 buttom corrigido para button
    button:{ 
        marginTop:40,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#f44242', // Cor de destaque para sair
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText:{
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    // 💡 Novo estilo para o botão de Edição
    editButton: {
        marginTop: 20,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4286f4',
        borderRadius: 5,
    },
    editText: {
        fontSize: 16,
        color: '#4286f4',
        fontWeight: '600',
    }
}) 

// 💡 Wrapper para injetar a navegação
function ProfileWithNavigation(props) {
    const navigation = useNavigation()
    return <Profile {...props} navigation={navigation} />;
}

export default ProfileWithNavigation;