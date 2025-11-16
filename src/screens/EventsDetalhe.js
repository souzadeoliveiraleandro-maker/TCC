import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

function EventDetail({ route }) {
    // Acessa o objeto 'event' passado como parâmetro na navegação
    const { event } = route.params;

    // Se o objeto não for encontrado (apenas para segurança)
    if (!event) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Detalhes do evento não encontrados.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Imagem de Capa */}
            <Image source={{ uri: event.imageURL }} style={styles.coverImage} />

            <View style={styles.contentContainer}>
                <Text style={styles.title}>{event.title}</Text>

                {/* Data, Local e Criador - Fatores Importantes */}
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>🗓️ Data:</Text>
                    <Text style={styles.infoText}>{event.date}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>📍 Local:</Text>
                    <Text style={styles.infoText}>{event.location}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>👤 Criado por:</Text>
                    <Text style={styles.infoText}>{event.creator}</Text>
                </View>

                {/* Descrição Detalhada */}
                <Text style={styles.sectionTitle}>Descrição Completa</Text>
                <Text style={styles.description}>
                    {event.description || 'Nenhuma descrição detalhada fornecida.'}
                </Text>
                
                {/* Você pode adicionar um botão de confirmação de presença aqui, se necessário */}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    coverImage: {
        width: width,
        height: width * 0.75, // Proporção 4:3
        resizeMode: 'cover',
    },
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginRight: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#000',
        flexShrink: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
        color: '#333',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
    },
});

export default EventDetail;