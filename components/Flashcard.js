import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function Flashcard({ sides }) {
  const [sideIndex, setSideIndex] = useState(0);

  const handleTap = () => {
    setSideIndex((prevSideIndex) => (prevSideIndex + 1) % sides.length);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleTap}>
      <Text>{sides[sideIndex]}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default Flashcard;

