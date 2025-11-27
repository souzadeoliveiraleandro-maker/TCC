import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { Gravatar } from 'react-native-gravatar'
import { launchImageLibrary } from 'react-native-image-picker' 
import Icon from 'react-native-vector-icons/FontAwesome'

// 🔑 IMPORTAÇÕES DO REDUX
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../src/redux/slices/userSlices';

// ------------------------------------------------------------------
// 1. COMPONENTE FUNCIONAL UNIFICADO
// ------------------------------------------------------------------
export default function ProfileScreen() {
    const dispatch = useDispatch();
    // 🔑 Leitura direta do estado do Redux
    const user = useSelector(state => state.user);
    
    // Estado local apenas para a imagem selecionada
    const [image, setImage] = useState(null);

    // 🔑 Função de logout simplificada
    const handleLogout = () => {
        // Apenas dispara a ação. A navegação é tratada pelo Navigator.js
        dispatch(logout()); 
    };

    const selectProfilePicture = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.7,
            includeBase64: false,
            maxHeight: 200,
            maxWidth: 200,
        };

        launchImageLibrary(options, (response) => {
            if (response.errorCode) {
                Alert.alert('Erro', `Falha ao selecionar imagem: ${response.errorMessage}`);
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                setImage({ uri: asset.uri });
            }
        });
    };

    // Use valores padrão para evitar erros se 'user' for nulo
    const userEmail = user?.email || 'Não Logado';
    const userName = user?.name || 'Visitante';
    const gravatarOptions = { email: userEmail, secure: true };

    return (
        <View style={styles.container}>
            
            <TouchableOpacity onPress={selectProfilePicture} style={styles.avatarContainer}>
                {image ? (
                    <Image source={image} style={styles.avatar} />
                ) : (
                    <Gravatar options={gravatarOptions} style={styles.avatar} />
                )}
                <View style={styles.cameraIcon}>
                    <Icon name="camera" size={20} color="#fff" />
                </View>
            </TouchableOpacity>

            {/* 🔑 Exibindo dados do Redux */}
            <Text style={styles.nickname}>{userName}</Text>
            <Text style={styles.email}>{userEmail}</Text>

            <TouchableOpacity onPress={() => Alert.alert('Ação', 'Navegar para Edição de Perfil')} style={styles.editButton}>
                <Icon name="pencil" size={18} color="#4286f4" style={{ marginRight: 8 }} />
                <Text style={styles.editText}>Editar Perfil</Text>
            </TouchableOpacity>

            {/* Botão Sair */}
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

// ------------------------------------------------------------------
// 2. ESTILOS (Inalterados)
// ------------------------------------------------------------------
const styles = StyleSheet.create({
    container:{
        flex:1, 
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: '#f5f5f5',
    },
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
    button:{ 
        marginTop:40,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#f44242', 
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText:{
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
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