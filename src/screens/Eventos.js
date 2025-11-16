import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// 🔑 Imports obrigatórios
import { useSelector } from 'react-redux'; // Hook para ler o estado
import { useNavigation } from '@react-navigation/native'; // Hook para obter o objeto de navegação
import Icon from 'react-native-vector-icons/FontAwesome';

// 💡 Certifique-se que o caminho está correto
import EventCard from '../componentes/EventCard'

// ------------------------------------------------------------------
// 1. A CLASSE Eventos (Componente de Classe)
// ------------------------------------------------------------------
class Eventos extends Component {
    
     componentDidMount() {
         this.setNavigationOptions();
     }

     componentDidUpdate(prevProps) {
         if (prevProps.isAdmin !== this.props.isAdmin) {
            this.setNavigationOptions();
         }
     }
     
     setNavigationOptions = () => {
         const { navigation, isAdmin } = this.props;

         if (isAdmin === true) {
            navigation.setOptions({
              headerRight: () => (
                   <TouchableOpacity 
                       onPress={this.handleCreateEvent}
                       style={styles.headerButton}
                   >
                       <Icon name="plus-circle" size={26} color="#4286f4" /> 
                   </TouchableOpacity>
              ),
            });
         } else {
            navigation.setOptions({
              headerRight: () => null,
            });
         }
     }

     handleCreateEvent = () => {
         this.props.navigation.navigate('AddEvento'); 
     };

     renderItem = ({ item }) => {
    // 🔑 NOVA LÓGICA: Função para navegar para a tela de detalhes
    const handlePress = () => {
        // Navega para a rota 'EventDetail', passando o objeto 'item' como parâmetro 'event'
        this.props.navigation.navigate('EventDetail', { event: item });
    };

         return (
            <EventCard
              title={item.title}
              date={item.date}
              creator={item.creator}
              imageURL={item.imageURL}
        // 🔑 Passa a função de navegação para o EventCard (que agora é TouchableOpacity)
        onPress={handlePress} 
            />
         );
     }

     render() {
              const { eventosConfirmados } = this.props; 

         return (
            <View style={styles.container}>
              <Text style={styles.header}>Meus Eventos Confirmados</Text>
              
              <FlatList
                   data={eventosConfirmados} 
                   keyExtractor={item => item.id}
                   renderItem={this.renderItem}
                   ListEmptyComponent={() => <Text style={styles.emptyText}>Você não confirmou presença em nenhum evento.</Text>}
              />
            </View>
         );
     }
}

// ------------------------------------------------------------------
// 2. O WRAPPER QUE LÊ O REDUX (Componente Funcional)
// ------------------------------------------------------------------
function EventosWithRedux(props) {
     const navigation = useNavigation();
    
         const eventos = useSelector(state => state.events.eventos);

     const isAdmin = useSelector(state => state.user?.isAdmin ?? false); 

     return <Eventos 
         {...props} 
         navigation={navigation}
         isAdmin={isAdmin} 
         eventosConfirmados={eventos} 
     />;
}

// ------------------------------------------------------------------
// 3. ESTILOS (Mantidos)
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
     headerButton: {
         marginRight: 15, 
         padding: 5,
     },
});

export default EventosWithRedux;