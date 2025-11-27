import React, { use, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    StyleSheet, 
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native'; // ✅ Adicionado useIsFocused
import { loadEvents, resetEventAdded } from '../redux/slices/eventos.Slices'; // ✅ Importa o novo reducer

// ------------------------------------------------------------------
// 1. DEFINIÇÃO DO STYLES
// ------------------------------------------------------------------
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16 },
    errorText: { color: 'red', fontSize: 16, marginBottom: 10, textAlign: 'center' },
    eventCard: { 
        padding: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        backgroundColor: '#f9f9f9',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    eventTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 5, color: '#333' },
    eventDetails: { fontSize: 14, color: '#666' },
    eventCreator: { fontSize: 12, color: '#888', marginTop: 5 },
    createButton: {
        backgroundColor: '#FFC107',
        padding: 15,
        borderRadius: 8,
        margin: 10,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

// ------------------------------------------------------------------
// 2. O COMPONENTE DA TELA DE EVENTOS
// ------------------------------------------------------------------
export default function EventsScreen({ navigation }) {
    const dispatch = useDispatch();
    // Acessa o array de eventos, o estado de loading e erro
    const [initialLoadAttempted, setInitialLoadAttempted] = React.useState(false); // ✅ Novo estado para controlar o carregamento inicial
    const isFocused = useIsFocused(); // ✅ Hook para saber se a tela está em foco
    const { eventos, loading: reduxLoading, error, eventAdded } = useSelector(state => state.events); // ✅ Pega o novo estado 'eventAdded'
    // 🔽 1. Acessa os dados do usuário logado a partir do estado do Redux.
    const user = useSelector(state => state.user);
    const [refreshing, setRefreshing] = React.useState(false);

    // Função de Carregamento Principal
    const fetchEvents = React.useCallback(() => { // ✅ Usar useCallback para otimização
        if (reduxLoading) return; // Evita múltiplas chamadas se já estiver carregando
        setRefreshing(true);
        dispatch(loadEvents()).finally(() => {
            setRefreshing(false);
            setInitialLoadAttempted(true); // ✅ Marca que a tentativa de carregamento inicial foi feita
        });
    }, [dispatch, reduxLoading]);

    // ✅ useEffect 1: Responsável APENAS pelo carregamento inicial dos eventos.
    useEffect(() => {
        if (isFocused && !initialLoadAttempted && eventos.length === 0) {
            fetchEvents();
        }
    }, [isFocused, initialLoadAttempted, eventos.length, fetchEvents]);

    // ✅ useEffect 2: Responsável APENAS por recarregar a lista após um novo evento ser adicionado.
    useEffect(() => {
        if (isFocused && eventAdded) {
            // Recarrega a lista de eventos para incluir o novo de forma segura.
            fetchEvents();
            // Reseta o sinalizador para não recarregar novamente sem necessidade.
            dispatch(resetEventAdded());
        }
    }, [isFocused, eventAdded, dispatch, fetchEvents]);

    // Renderiza um placeholder enquanto os dados estão sendo buscados pela primeira vez
    if ((reduxLoading && eventos.length === 0) || (!initialLoadAttempted && eventos.length === 0)) { // ✅ Mostra loading se Redux estiver carregando OU se ainda não tentou carregar e não há eventos
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#FFC107" />
                <Text style={styles.loadingText}>Carregando eventos...</Text>
            </View>
        );
    }

    const renderEvent = ({ item }) => (
        // ✅ Envolve o card em um TouchableOpacity para torná-lo clicável
        <TouchableOpacity 
            style={styles.eventCard}
            // ✅ Navega para a tela de detalhes, passando o objeto 'item' (o evento) como parâmetro
            onPress={() => navigation.navigate('EventDetail', { event: item })}
        >
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDetails}>Data: {new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.eventCreator}>Criado por: {item.creatorNickname}</Text>
            {/* Você pode adicionar a imagem aqui usando <Image source={{ uri: item.image_url }} /> */}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Exibe mensagem de erro, se houver */}
            {error && (
                <View style={styles.centeredError}>
                    <Text style={styles.errorText}>Falha ao carregar eventos: {error}</Text>
                    <TouchableOpacity onPress={fetchEvents}>
                        <Text style={{ color: '#007BFF', fontSize: 16, marginTop: 10 }}>
                            Tentar Novamente
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* 🔽 2. O botão só será renderizado se 'user.isAdmin' for verdadeiro. */}
            {user.isAdmin && (
                <TouchableOpacity 
                    style={styles.createButton} 
                    onPress={() => navigation.navigate('AddEvento')}
                >
                    <Text style={styles.createButtonText}>+ Criar Novo Evento</Text>
                </TouchableOpacity>
            )}

            {!error && (
                <FlatList
                    data={eventos}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderEvent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={fetchEvents} />
                    }
                    ListEmptyComponent={() => (
                        <View style={styles.centered}>
                            <Text>{initialLoadAttempted ? 'Nenhum evento agendado. Crie o primeiro!' : 'Carregando...'}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}