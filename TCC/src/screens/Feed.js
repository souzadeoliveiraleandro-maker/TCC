import React, { useEffect } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { useSelector, useDispatch } from 'react-redux';

import Header from "../componentes/Header";
import Post from "../componentes/Post";
import { fetchPosts } from "../../../../store/actions/postsActions";

const Feed = (props) => {
    // `useSelector` é o hook que lê um valor do estado do Redux.
    // `state.posts` refere-se ao reducer combinado em `reducers/index.js`.
    // `state.posts.posts` refere-se à propriedade `posts` dentro do `postsReducer`.
    const posts = useSelector(state => state.posts.posts);
    const dispatch = useDispatch();

    // `useEffect` substitui o `componentDidMount`.
    // Ele executa a ação `fetchPosts` assim que o componente é montado.
    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    return (
        <View style={styles.container}>
            <Header />
            <FlatList
                data={posts}
                keyExtractor={item => `${item.id}`}
                renderItem={({ item }) => <Post {...item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    }
})

export default Feed