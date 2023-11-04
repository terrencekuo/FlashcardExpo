import React, { useState, useRef } from 'react';  // Added useRef
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Keyboard,
    Modal,
    TouchableHighlight,
    Image,
    Dimensions,
 } from 'react-native';  // Added Keyboard
import { useDispatch } from 'react-redux';
import { addCardToDeck } from '../actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import { NativeModules } from "react-native"

const { CustomMethods } = NativeModules

export default function CreateFlashcardScreen({ route, navigation }) {
    const { deckName } = route.params;
    const dispatch = useDispatch();

    // Default sides for the flashcard
    const defaultSides = [
        { label: 'Native Language', value: '' },
        { label: 'Chinese Characters', value: '' },
        { label: 'Pinyin', value: '' }
    ];
    const [sides, setSides] = useState(defaultSides);

    // Create refs for the TextInput components
    const inputRefs = useRef(sides.map(() => React.createRef()));

    // Handle changing the text of a side
    const handleSideChange = (text, index) => {
        const newSides = [...sides];
        newSides[index].value = text;
        setSides(newSides);
    };

    // Handle adding the card to the deck
    const handleAddCard = () => {
        if (sides.some(side => side.value.trim() === '')) {
            alert('Please fill out all sides!');
            return;
        }

        dispatch(addCardToDeck(deckName, sides));
        setSides(defaultSides);
    };

    // Navigation function to return to the home screen
    const handleStartStudying = () => {
        navigation.navigate('Home');
    };

    const [imageSource, setImageSource] = useState(null);
    const [textOverlays, setTextOverlays] = useState([]);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [displayedImageSize, setDisplayedImageSize] = useState({ width: 0, height: 0 });

    // Function to open the image modal
    const showImageWithTextOverlay = () => {
        setImageModalVisible(true);
    };

    const pickImage = () => {
        const options = {
        title: 'Select Photo',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        };

        launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.assets && response.assets.length > 0) {
            const selectedImage = response.assets[0];
            const source = { uri: selectedImage.uri };
            const originalWidth = selectedImage.width;
            const originalHeight = selectedImage.height;
            setImageSource(source); // Save the picked image's source
            console.log('here got image', source);
            console.log('image width and height', originalWidth, originalHeight);

            // You could use the Image.getSize method to get the size of the image and calculate the aspect ratio
            Image.getSize(source.uri, (originalWidth, originalHeight) => {
            const screenWidth = Dimensions.get('window').width;
            const scaleFactor = originalWidth / screenWidth; // scaleFactor is used to scale coordinates
            const imageHeight = originalHeight / scaleFactor;
            console.log('getSize scaleFactor and height', scaleFactor, screenWidth, imageHeight);

            setDisplayedImageSize({ width: screenWidth, height: imageHeight });

            // Process the selected image with ML Kit
            CustomMethods.recognizeTextFromImage(source.uri)
                .then(overlays => {
                console.log("Recognized Overlays: ", overlays);
                console.log("image:", source);

                // Scale the overlay coordinates
                const scaledOverlays = overlays.map(overlay => {
                    return {
                    ...overlay,
                    frame: {
                        x: overlay.frame.x / scaleFactor,
                        y: overlay.frame.y / scaleFactor,
                        width: overlay.frame.width / scaleFactor,
                        height: overlay.frame.height / scaleFactor,
                    },
                    };
                });

                setTextOverlays(scaledOverlays); // Set the text overlays to state
                showImageWithTextOverlay();
                })
                .catch(error => {
                console.error("Failed to recognize text: ", error);
                });

            }, (error) => {
                console.error(`Couldn't get the size of the image: ${error.message}`);
            });
        }
        });
    };

    return (
        <KeyboardAwareScrollView style={styles.container}>
            {/* Render each side input */}
            {sides.map((side, index) => (
                <View key={index} style={styles.sideContainer}>
                    <Text>{side.label}</Text>
                    <TextInput
                        ref={inputRefs.current[index]}
                        style={styles.input}
                        value={side.value}
                        onChangeText={(text) => handleSideChange(text, index)}
                        placeholder={`Enter ${side.label}`}
                        onSubmitEditing={() => {
                            if (index < sides.length - 1) {
                                inputRefs.current[index + 1].current.focus();
                            } else {
                                Keyboard.dismiss();
                            }
                        }}
                        returnKeyType={index < sides.length - 1 ? "next" : "done"}
                    />
                </View>
            ))}
  
            {/* Footer buttons */}
            <View style={styles.bottomSection}>
                <Button title="Start Studying" onPress={handleStartStudying} />
                <Button title="Add Flash Card" onPress={handleAddCard} />
            </View>
            <MaterialIcons
                name="photo-library"
                size={30}
                color="#007AFF" // This is the default color for iOS buttons; adjust as needed for your theme
                onPress={pickImage}
                style={styles.libraryButton}
            />

            <Modal
                animationType="slide"
                transparent={false}
                visible={isImageModalVisible}
                onRequestClose={() => {
                setImageModalVisible(!isImageModalVisible);
                }}>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {imageSource && (
                    <View style={styles.imageViewContainer}>
                        <Image
                        source={{ uri: imageSource.uri }}
                        style={{ width: displayedImageSize.width, height: displayedImageSize.height }}
                        resizeMode="contain"
                        onError={(e) => console.log('Failed to load image:', e.nativeEvent.error)} // Add error handling
                        />
                        {textOverlays.map((overlay, index) => (
                        <View
                            key={index}
                            style={[
                            styles.textOverlay,
                            {
                                position: 'absolute',
                                left: overlay.frame.x, // These are the scaled coordinates
                                top: overlay.frame.y,
                                width: overlay.frame.width,
                                height: overlay.frame.height,
                                borderColor: 'red',
                                borderWidth: 1,
                            },
                            ]}
                        />
                        ))}
                    </View>
                    )}
                    <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                        setImageModalVisible(!isImageModalVisible);
                    }}
                    >
                    <Text style={styles.textStyle}>Hide Modal</Text>
                    </TouchableHighlight>
                </View>
                </View>
            </Modal>

        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    sideContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',  // Pushes children to the edges
        marginBottom: 15,
    },
    input: {
        flex: 1,  // Takes up all available space
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        marginLeft: 10,  // Adds some spacing between the Text and TextInput
    },
    bottomSection: {
        marginTop: 'auto',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10, // Add some space between the buttons and the icon
    },
    libraryButton: {
        alignSelf: 'center', // Center the icon horizontally
        padding: 10,
        // Set other styling as needed
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
});