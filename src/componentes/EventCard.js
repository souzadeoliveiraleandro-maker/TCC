import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native'; // Importamos o Image
import Icon from 'react-native-vector-icons/FontAwesome';

// Adicionamos 'imageURL' às propriedades que o componente recebe
const EventCard = ({ title, date, creator, imageURL }) => {
    return (
        <View style={styles.card}>
            {/* Indicador Visual (opcional) */}
            <View style={styles.statusIndicator} />

            {/* Nova Seção: Imagem do Evento */}
            {imageURL && ( // Só renderiza a imagem se a URL existir
                <Image 
                    source={{ uri: imageURL }} 
                    style={styles.eventImage} 
                    resizeMode="cover"
                />
            )}
            
            {/* Seção Principal do Evento */}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{title}</Text>
                
                {/* Data e Ícone */}
                <View style={styles.detailRow}>
                    <Icon name="calendar" size={16} color="#444" style={styles.icon} />
                    <Text style={styles.date}>{date}</Text>
                </View>
                
                {/* Criador e Ícone */}
                <View style={styles.detailRow}>
                    <Icon name="user-circle" size={16} color="#007AFF" style={styles.icon} />
                    <Text style={styles.creator}>Criador: {creator}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 4,
        marginHorizontal: 10,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    statusIndicator: {
        width: 6,
        backgroundColor: '#4286f4',
        borderRadius: 3,
        marginRight: 10,
    },
    eventImage: {
        width: 60, // Largura fixa para a imagem
        height: 60, // Altura fixa para a imagem
        borderRadius: 4, // Bordas arredondadas para a imagem
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    icon: {
        marginRight: 8,
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    creator: {
        fontSize: 14,
        color: '#007AFF',
    }
});

export default EventCard;