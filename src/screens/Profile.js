import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { Gravatar } from 'react-native-gravatar'
import { launchImageLibrary } from 'react-native-image-picker' 
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native' 

// 🔑 IMPORTAÇÕES DO REDUX
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../src/redux/slices/userSlices'

const initialImage = { uri: 'https://seusite.com/default-avatar.png' }; // Placeholder para foto padrão

// ------------------------------------------------------------------
// 1. A CLASSE Profile (LÊ DADOS E CHAMA A PROPS onLogout)
// ------------------------------------------------------------------
class Profile extends Component{
    state = {
        // O email e a imagem agora são controlados por props injetadas pelo Redux,
        // mas mantemos 'image' no state se o usuário selecionar uma foto local
        image: null, 
    }

    // 🔑 O método logout CHAMA a função onLogout injetada pelo wrapper
    logout = () => {
        // onLogout fará o dispatch(logout()) e a navegação
        this.props.onLogout();
    }

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
                    image: { uri: asset.uri }, 
                });
            }
        });
    }

    render(){
        // 🔑 Lê os dados do usuário a partir das props injetadas pelo Redux
        const { user } = this.props; 

        // Use valores padrão caso a Store ainda esteja carregando ou o user não exista
        const userEmail = user.email || 'Não Logado';
        const userName = user.name || 'Visitante';

        const { image } = this.state;
        const gravatarOptions = { email: userEmail, secure: true };
        
        return(
            <View style={styles.container}>
                
                <TouchableOpacity onPress={this.selectProfilePicture} style={styles.avatarContainer}>
                    {image ? (
                        <Image source={image} style={styles.avatar} />
                    ) : (
                        <Gravatar options={gravatarOptions} style={styles.avatar} />
                    )}
                    <View style={styles.cameraIcon}>
                        <Icon name="camera" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>

                {/* 🔑 EXIBINDO DADOS DO REDUX */}
                <Text style={styles.nickname}>{userName}</Text>
                <Text style={styles.email}>{userEmail}</Text>

                <TouchableOpacity onPress={() => Alert.alert('Ação', 'Navegar para Edição de Perfil')} style={styles.editButton}>
                    <Icon name="pencil" size={18} color="#4286f4" style={{ marginRight: 8 }} />
                    <Text style={styles.editText}>Editar Perfil</Text>
                </TouchableOpacity>

                {/* Botão Sair */}
                <TouchableOpacity onPress={this.logout} style={styles.button}>
                    <Text style={styles.buttonText}>Sair</Text>
                </TouchableOpacity>
            </View>
        )
    }  
}

// ------------------------------------------------------------------
// 2. O WRAPPER QUE INJETA REDUX E NAVEGAÇÃO
// ------------------------------------------------------------------
function ProfileWithRedux(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // 🔑 LEITURA: Obtém o objeto completo do usuário da Store
    const user = useSelector(state => state.user);

    // 🔑 FUNÇÃO DE LOGOUT: Dispara o Redux Action e navega
    const handleLogout = () => {
        // 1. Limpa o estado no Redux
        dispatch(logout()); 
        // 2. Navega para a pilha de Autenticação (Login)
        navigation.navigate('Auth');
    };

    return <Profile 
        {...props} 
        navigation={navigation}
        user={user} // 🔑 Injeta o objeto do usuário completo (incluindo name, email, isAdmin)
        onLogout={handleLogout} // 🔑 Injeta a função de logout com Redux
    />;
}

// ------------------------------------------------------------------
// 3. ESTILOS (Inalterados, movidos para o final)
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

// ------------------------------------------------------------------
// 4. EXPORTAÇÃO FINAL
// ------------------------------------------------------------------
export default ProfileWithRedux;