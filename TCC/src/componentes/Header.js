import React, {Component} from "react";
import { StyleSheet, Text, View, Platform, Image} from "react-native"
import icon from '../../android/assets/imgs/icons8-documento-100.png'

class Header extends Component {
    render(){
        return (
            <View style={Styles.container}>
                <View style={Styles.rowContainer}>
                    <Image source={icon} style={Styles.Image}/>
                    <Text style={Styles.title}>lambe lambe</Text>
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create (
    {
        container: {
            marginTop: Platform.OS === 'ios' ? 20 : 0,
            padding: 10,
            borderBottomWidth: 1,
            borderColor: '#000000ff',
            width: '100%',
        },
        rowContainer:{
            flexDirection: 'row',
            alignItems: 'center'
        },
        Image: {
            height: 30,
            width: 30,
            resizeMode: 'contain'
        },
        title: {
            color: '#000000ff',
            fontFamily: 'shelter',
            height: 30,
            fontSize: 28
        },
    }
)

export default Header