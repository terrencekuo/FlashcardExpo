import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { selectDeckByName } from '../selectors/deckSelectors';

function StudyScreen({ route, navigation }) {
    const { deckName } = route.params;
    const deck = useSelector(state => selectDeckByName(state, deckName));
    const [cardIndex, setCardIndex] = useState(0);
    const [showFront, setShowFront] = useState(true);

    if (!deck || !deck.questions.length) {
        return (
            <View style={styles.centered}>
                <Text>No cards available in this deck!</Text>
            </View>
        );
    }

    const card = deck.questions[cardIndex];

    const flipCard = () => {
        setShowFront(!showFront);
    };

    const nextCard = () => {
        if (cardIndex < deck.questions.length - 1) {
            setCardIndex(cardIndex + 1);
            setShowFront(true); // Reset to showing the front of the next card.
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.card} onPress={flipCard}>
                <Text style={styles.cardText}>{showFront ? card.front : card.back}</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <Button title="Next Card" onPress={nextCard} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        height: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 24,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        width: '90%',
    },
});

export default StudyScreen;
