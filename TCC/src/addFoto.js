import React, { Component } from 'react';
import { View,
Text, 
StyleSheet,
TouchableOpacity,
TextInput,
Image,
Dimensions,
Platform,
ScrollView,
Alert} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { addFoto } from '../store/actions/userActions';gg
import { bindActionCreators } from 'redux';