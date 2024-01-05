// @flow

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import {
    deleteTopic,
    addTopic,
    addDeckToTopic,
    renameDeck
} from '../redux/actions';
import { selectDeckByName } from '../redux/selectors';

// $FlowFixMe
function RenameDeckScreen({ route, navigation }: { route: any, navigation: any }) {
    const { selectedDecks } = route.params;
    const currentDeckName = selectedDecks[0];
    const [newDeckName, setNewDeckName] = useState('');
    const dispatch = useDispatch();

    const createNewTopic = () => {
        if (newDeckName.trim() === '') {
            alert('Deck name cannot be empty');
            return;
        }

        dispatch(renameDeck(currentDeckName, newDeckName));
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.customHeader}>Rename Decks</Text>

            {/* New Topic Creation Section */}
            <KeyboardAvoidingView
                // $FlowFixMe
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer}
            >
                <View style={styles.newTopicBox}>
                    <Text style={styles.boxHeader}>Rename Deck</Text>
                    <View style={styles.inputContainer}>
                        <Text>Current deck name: {currentDeckName} </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new deck name"
                            value={newDeckName}
                            onChangeText={setNewDeckName}
                        />
                        <TouchableOpacity onPress={createNewTopic} style={styles.customButton}>
                            <Text style={styles.customButtonText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    customHeader: {
        fontSize: 34,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 15,
        color: "#534A4A",
        paddingHorizontal: 15,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        paddingTop: 20,
        paddingHorizontal: 20
    },
    topicsBox: {
        marginHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
    },
    newTopicBox: {
        marginHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    boxHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        textAlign: 'center',
        color: "#534A4A",
    },
    customButton: {
        backgroundColor: '#B89081',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    customButtonText: {
        color: 'white',
        fontSize: 16,
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    topicItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    topicText: {
        fontSize: 16,
    },
    inputContainer: {
        marginTop: 10,
        padding: 15,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});

export default RenameDeckScreen;
