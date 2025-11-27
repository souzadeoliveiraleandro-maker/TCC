import React, { useEffect } from "react";
import { 
    StyleSheet, 
    FlatList, 
    View, 
    Text, 
    TouchableOpacity, 
    ActivityIndicator, 
    RefreshControl 
} from "react-native";
import { useDispatch, useSelector } from 'react-redux'; // 🔑 Hooks do Redux
import { useNavigation, useIsFocused } from '@react-navigation/native'; // ✅ Adicionado useIsFocused
import Icon from 'react-native-vector-icons/FontAwesome';

import Post from "../componentes/Post";
import { loadPosts, resetPostAdded } from "../redux/slices/postsSlices"; // ✅ Importa o novo reducer

// ------------------------------------------------------------------
// 1. O COMPONENTE PRINCIPAL DO FEED (FUNCIONAL)
// ------------------------------------------------------------------
export default function FeedScreen() { // Renomeado para seguir o padrão Screen
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const isFocused = useIsFocused(); // ✅ Hook para saber se a tela está em foco
    const [initialLoadAttempted, setInitialLoadAttempted] = React.useState(false); // ✅ Novo estado para controlar o carregamento inicial
    
    // 🔑 Pega o estado do Redux: array de posts, loading e erro
    const { posts, loading: reduxLoading, error, postAdded } = useSelector(state => state.posts); // ✅ Pega o novo estado 'postAdded'
    const [refreshing, setRefreshing] = React.useState(false);

    // Função para buscar posts (usada no refresh e na montagem)
    const fetchPosts = React.useCallback(() => { // ✅ Usar useCallback para otimização
        if (reduxLoading) return; // Evita múltiplas chamadas se já estiver carregando
        setRefreshing(true);
        // Despacha o Thunk e garante que o loading seja desativado, independente do resultado
        dispatch(loadPosts()).finally(() => {
            setRefreshing(false);
            setInitialLoadAttempted(true); // ✅ Marca que a tentativa de carregamento inicial foi feita
        });
    }, [dispatch, reduxLoading]);
 
    // ✅ useEffect 1: Responsável APENAS pelo carregamento inicial dos posts.
    useEffect(() => {
        // Busca os posts apenas se a tela estiver em foco, a tentativa inicial não foi feita e não há posts.
        if (isFocused && !initialLoadAttempted && posts.length === 0) {
            fetchPosts();
        }
    }, [isFocused, initialLoadAttempted, posts.length, fetchPosts]);

    // ✅ useEffect 2: Responsável APENAS por recarregar o feed após um novo post ser adicionado.
    useEffect(() => {
        if (isFocused && postAdded) {
            // Recarrega a lista de posts para incluir o novo post de forma segura.
            fetchPosts();
            // Reseta o sinalizador para não recarregar novamente sem necessidade.
            dispatch(resetPostAdded());
        }
    }, [isFocused, postAdded, dispatch, fetchPosts]); // Dependências mais limpas e focadas.
     
    // useLayoutEffect: Configura o botão de adicionar post no cabeçalho
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity 
                    onPress={() => navigation.navigate('AddPost')} // Nome da rota que criamos
                    style={styles.headerButton}
                >
                    <Icon name="plus" size={24} color="#4286f4" />
                </TouchableOpacity>
            ),
            title: 'Feed Principal',
        });
    }, [navigation]);

 
    // --------------------------------------------------
    // Condicionais de Renderização (Loading e Erro)
    // --------------------------------------------------
    if ((reduxLoading && posts.length === 0) || (!initialLoadAttempted && posts.length === 0)) { // ✅ Mostra loading se Redux estiver carregando OU se ainda não tentou carregar e não há posts
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4286f4" />
                <Text style={styles.emptyText}>Carregando feed...</Text>
            </View>
        );
    }
 
    return (
        <View style={styles.container}>
            <FlatList 
                data={posts} 
                keyExtractor={item => `${item.id}`} 
                // Passa todas as propriedades do item para o componente Post
                renderItem={({item}) => (
                    <Post 
                        key={item.id}
                        id={item.id}
                        image_url={item.image_url}
                        comments={item.comments}
                        email={item.authorEmail}
                        name={item.authorNickname}
                        caption={item.caption} // ✅ CORREÇÃO: Passando a legenda para o componente Post
                    />
                )}
                contentContainerStyle={{paddingBottom: 100}}
                // Implementa o recurso "Puxar para Atualizar" (Pull to Refresh)
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />
                }
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>
                         {error ? `Erro: ${error}` : (initialLoadAttempted ? 'Nenhuma postagem ainda. Crie a primeira!' : 'Carregando...')}
                    </Text>
                )}
            />
        </View>
    );
}
 
// ------------------------------------------------------------------
// 2. STYLES
// ------------------------------------------------------------------
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#F5FCFF'
    },
    centered: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    headerButton: {
        marginRight: 15,
        padding: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    },
})