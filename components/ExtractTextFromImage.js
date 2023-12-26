import React, { useState } from 'react';
import {
    Modal,
    Image,
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Dimensions
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { NativeModules } from "react-native"
const { CustomMethods } = NativeModules

const ImagePickerButton = ({ setDisplayedImage }) => {
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
        <View>
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
        </View>
    );
};

const styles = StyleSheet.create({
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
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default ImagePickerButton;