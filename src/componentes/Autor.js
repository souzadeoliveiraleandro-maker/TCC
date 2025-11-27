// /src/componentes/Autor.js
import React from 'react'
import { View, Text, StyleSheet  } from 'react-native'
import { Gravatar } from 'react-native-gravatar'

export default props => {
    return (
        <View style={styles.container}> // 🔑 Adicionado o estilo container
            <Gravatar options={{
                email: props.email, secure: true
            }}  
            // ❌ Corrigido: Usar `styles.avatar`
            style={styles.avatar}/> 
            {/* ✅ CORREÇÃO: O estilo 'styles.name' foi corrigido para 'styles.nickname' */}
            <Text style={styles.nickname}>{props.name}</Text> 
        </View>
    )
}

const styles=StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 10
    },
    nickname: {
        color: '#444',
        marginVertical: 10,
        fontSize: 15,
        fontWeight: 'bold'
    }
})