import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// 💡 1. Importa o componente EventCard (Certifique-se que o caminho está correto)
import EventCard from '../componentes/EventCard'

class Eventos extends Component {
    state = {
        // Dados de exemplo atualizados com o campo 'imageURL'
        eventosConfirmados: [
            { 
                id: '1', 
                title: 'Festa de Aniversário do João', 
                date: '15/12/2025', 
                creator: 'João Silva',
                // Use URLs reais para testes ou placeholders como o exemplo abaixo
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

    // Função que renderiza cada item da lista usando o EventCard
    renderItem = ({ item }) => {
        // 💡 2. Passa todas as propriedades para o EventCard, incluindo a imageURL
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
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Meus Eventos Confirmados</Text>
                
                <FlatList
                    data={this.state.eventosConfirmados}
                    keyExtractor={item => item.id}
                    renderItem={this.renderItem}
                    // O EventCard já tem margens internas, então a separação pode ser opcional aqui
                    // ListEmptyComponent é importante para a UX
                    ListEmptyComponent={() => <Text style={styles.emptyText}>Você não confirmou presença em nenhum evento.</Text>}
                />
            </View>
        );
    }
}

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
    }
    // Removidas as estilos de item, pois agora eles estão no EventCard
});

export default Eventos;