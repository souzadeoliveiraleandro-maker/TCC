import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// 🔑 Importações necessárias
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ícone para o FAB

// 💡 Importa o componente EventCard (Certifique-se que o caminho está correto)
import EventCard from '../componentes/EventCard'

// ------------------------------------------------------------------
// 1. A CLASSE Eventos (AGORA USA A PROP 'isAdmin')
// ------------------------------------------------------------------
class Eventos extends Component {
    state = {
        // Dados de exemplo, que serão substituídos pela lista de eventos do seu backend
        eventosConfirmados: [
            { 
                id: '1', 
                title: 'Festa de Aniversário do João', 
                date: '15/12/2025', 
                creator: 'João Silva',
                imageURL: 'https://picsum.photos/id/10/60/60' 
            },
            { 
                id: '2', 
                title: 'Reunião de Trabalho Semanal', 
                date: '20/12/2025', 
                creator: 'RH',
                imageURL: 'https://picsum.photos/id/200/60/60'
            },
            { 
                id: '3', 
                title: 'Workshop de React Native', 
                date: '22/12/2025', 
                creator: 'Equipe Mobile',
                imageURL: 'https://picsum.photos/id/300/60/60'
            },
        ]
    }

    // 🔑 NOVA FUNÇÃO: Navega para a tela de criação de eventos
    handleCreateEvent = () => {
        // Assume que 'AddEventos' é o nome da sua tela de criação no navegador de abas
        this.props.navigation.navigate('AddEvento'); 
    };

    renderItem = ({ item }) => {
        return (
            <EventCard
                title={item.title}
                date={item.date}
                creator={item.creator}
                imageURL={item.imageURL}
            />
        );
    }

    render() {
        // 🔑 Lê a permissão 'isAdmin' que é injetada via props pelo Redux
        const { isAdmin } = this.props; 

        return (
            <View style={styles.container}>
                <Text style={styles.header}>Meus Eventos Confirmados</Text>
                
                <FlatList
                    data={this.state.eventosConfirmados}
                    keyExtractor={item => item.id}
                    renderItem={this.renderItem}
                    ListEmptyComponent={() => <Text style={styles.emptyText}>Você não confirmou presença em nenhum evento.</Text>}
                />

                {/* 🔒 RENDERIZAÇÃO CONDICIONAL: Mostra o FAB apenas se for Admin */}
                {isAdmin && (
                    <TouchableOpacity 
                        style={styles.fab}
                        onPress={this.handleCreateEvent}
                    >
                        <Icon name="plus" size={24} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

// ------------------------------------------------------------------
// 2. O WRAPPER QUE LÊ O REDUX
// ------------------------------------------------------------------
function EventosWithRedux(props) {
    const navigation = useNavigation();
    
    // 🔑 USA o selector para obter o status de permissão do Redux Store
    const isAdmin = useSelector(state => state.user.isAdmin); 

    return <Eventos 
        {...props} 
        navigation={navigation}
        isAdmin={isAdmin} // 🔑 Injeta a permissão como uma prop na Classe
    />;
}

// ------------------------------------------------------------------
// 3. ESTILOS ATUALIZADOS (COM O NOVO ESTILO DO FAB)
// ------------------------------------------------------------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    },
    // 🔑 ESTILO PARA O BOTÃO FLUTUANTE (FAB)
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        backgroundColor: '#4286f4', // Cor primária
        borderRadius: 30, // Torna o botão circular
        elevation: 8, // Sombra no Android
        shadowColor: '#000', // Sombra no iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    }
});

export default EventosWithRedux;