// /src/componentes/AdicionarComentario.js
import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback as TWF, Alert } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { connect } from 'react-redux';
// Ajuste o caminho se postsSlice.js não estiver em ../../redux/slices/
import { addComment } from '../../src/redux/slices/postsSlices'; 

class AdicionarComentario extends Component {
    state = {
        comment: '',
        editMode: false,
    };

    HandleAddComentario = () => {
        if (!this.state.comment.trim()) {
            return Alert.alert('Erro', 'O comentário não pode estar vazio.');
        }

        if (!this.props.name) {
            return Alert.alert('Erro', 'Você deve estar logado para comentar.');
        }

        const newComment = {
            nickname: this.props.name,
            comment: this.state.comment.trim(),
        };

        this.props.onAddComment({ 
            postId: this.props.postId, 
            comment: newComment 
        });

        this.setState({ comment: '', editMode: false });
    }

    render() {
        const isLogged = this.props.name != null; 
        let commentsNaArea = null;

        if (isLogged) {
            if (this.state.editMode) {
                commentsNaArea = (
                    <View style={styles.container}>
                        <TextInput
                            placeholder='Pode comentar...'
                            style={styles.input}
                            autoFocus={true}
                            value={this.state.comment}
                            onChangeText={comment => this.setState({ comment })}
                            onSubmitEditing={this.HandleAddComentario}
                        />
                        <TWF onPress={() => this.setState({ editMode: false, comment: '' })}>
                            <Icon name='times' size={15} color='#555' />
                        </TWF>
                    </View>
                );
            } else {
                commentsNaArea = (
                    <TWF onPress={() => this.setState({ editMode: true })}>
                        <View style={styles.container}> 
                            <Icon name='comment-o' size={20} color='#999' />
                            <Text style={styles.caption}>
                                Adicionar comentário como **{this.props.name}**...
                            </Text>
                        </View>
                    </TWF>
                );
            }
        } else {
            commentsNaArea = (
                <View style={styles.container}>
                    <Icon name='comment-o' size={20} color='#999' />
                    <Text style={styles.caption}>
                        Faça login para comentar.
                    </Text>
                </View>
            );
        }

        return (
            <View style={{ width: '100%', paddingHorizontal: 10, backgroundColor: '#eef' }}>
                {commentsNaArea}
            </View>
        );
    }
}

// 🔑 DEFINIÇÃO NECESSÁRIA ANTES DE connect:
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
        color: '#999',
    },
    input: {
        width: '90%',
        padding: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff'
    }
});

// 🔑 DEFINIÇÃO NECESSÁRIA ANTES DE connect:
const mapStateToProps = ({ user }) => {
    return {
        name: user.nickname, 
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddComment: payload => dispatch(addComment(payload)), 
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdicionarComentario);