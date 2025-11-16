// /src/screens/AddPost.js
import React, { Component } from 'react';
import { 
    View, Text, StyleSheet, TextInput, Image, 
    TouchableOpacity, ScrollView, Alert, Dimensions 
} from 'react-native';

// 🔑 Redux imports
import { connect } from 'react-redux';
// ✅ CORREÇÃO: Caminho e nome do arquivo ajustados para 'postsSlice'
import { addPost } from '../../src/redux/slices/postsSlices' 


class AddPost extends Component {
    // ... (O restante do código de AddPost é o mesmo)
    state = {
        image: null, 
        comment: '', 
    };
    // ... (pickImage e saveHandler)
    pickImage = () => {
        Alert.alert(
            'Escolher Imagem',
            'Selecione uma imagem da galeria ou câmera.',
            [
                { text: 'Cancelar' },
                { text: 'Simular Imagem', onPress: () => {
                    this.setState({
                        image: { uri: 'https://picsum.photos/400/300?random=' + Math.random() }
                    });
                }},
            ]
        );
    };

    saveHandler = () => {
        const { image, comment } = this.state;
        const { nickname, email } = this.props;

        if (!image || !comment.trim()) {
            return Alert.alert('Erro', 'Por favor, selecione uma imagem e escreva uma legenda.');
        }
        
        if (!email) {
            return Alert.alert('Erro', 'Você precisa estar logado para criar uma postagem.');
        }

        const newPost = {
            id: Math.random().toString(), 
            nickname: nickname,
            email: email,
            image: image,
            comment: comment.trim(), 
            comments: []
        };

        this.props.onAddPost(newPost);
        
        this.setState({ image: null, comment: '' });
        this.props.navigation.goBack();
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Criar Nova Postagem</Text>
                    <View style={styles.imageContainer}>
                        {this.state.image ? (
                            <Image 
                                source={this.state.image}
                                style={styles.image} 
                            />
                        ) : (
                            <Text style={styles.imagePlaceholderText}>
                                Nenhuma imagem selecionada.
                                {'\n'}
                                Clique no botão abaixo para escolher.
                            </Text>
                        )}
                        <TouchableOpacity onPress={this.pickImage} style={styles.button}>
                            <Text style={styles.buttonText}>Escolher Imagem</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        placeholder='Adicione uma legenda...'
                        style={styles.input}
                        placeholderTextColor='#333' 
                        autoFocus={true}
                        value={this.state.comment}
                        onChangeText={comment => this.setState({ comment })}
                        multiline={true}
                    />
                    <TouchableOpacity onPress={this.saveHandler} style={styles.buttonSave}>
                        <Text style={styles.buttonText}>Compartilhar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
// ... (styles)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    formContainer: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 20,
    },
    imageContainer: {
        width: '100%',
        height: Dimensions.get('window').width * 3 / 4,
        marginBottom: 20,
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    imagePlaceholderText: { 
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        padding: 10,
    },
    button: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#4286f4',
        borderRadius: 5,
    },
    buttonSave: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#2ecc71',
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 100,
        padding: 10,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        textAlignVertical: 'top', 
    }
});
// ... (mapStateToProps e mapDispatchToProps)
const mapStateToProps = ({ user }) => {
    return {
        nickname: user.nickname,
        email: user.email,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddPost: post => dispatch(addPost(post)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPost);