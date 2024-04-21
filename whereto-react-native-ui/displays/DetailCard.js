// DetailCard.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const DetailCard = ({ data }) => {
  // Assuming data contains the JSON object from detailed_response.json
  const { address, detection, confidence, image_byte_data } = data;

  // Convert image_byte_data to a base64 image URI
  const imageSource = `data:image/jpeg;base64,${image_byte_data}`;

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageSource }} style={styles.image} resizeMode="cover" />
      <Text style={styles.text}>Address: {address}</Text>
      <Text style={styles.text}>Detection: {detection}</Text>
      <Text style={styles.text}>Confidence: {confidence}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute', // Adjust positioning as needed
    bottom: 20, // Example placement at the bottom
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    elevation: 5, // for Android
  },
  image: {
    width: '100%',
    height: 200, // Adjust as needed
    borderRadius: 4,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default DetailCard;