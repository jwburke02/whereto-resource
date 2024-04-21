import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Button, TouchableOpacity, Image, Dimensions, Pressable, ImageBackground} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import roadSignIcon from '../assets/parkingsign.png';
import parkingMeterIcon from '../assets/parkingmeter.png';

const { width, height } = Dimensions.get('window');

const detailedInfo = {
  address: "123 Example Street, Boston MA, 02184",
  class_name: "Single Space Parking Meter",
  conf: 0.91,
  image_data: null
};

// Component for displaying modal with marker's detailed information
function MarkerInfoModal({ visible, onClose, info }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image source={{ uri: info.image_data }} style={styles.parkingImage} resizeMode="cover" />
          <Text style={styles.modalText1}>Address: {info.address}</Text>
          <Text style={styles.modalText1}>Detection: {info.class_name}</Text>
          <Text style={styles.modalText1}>Confidence: {info.conf.toFixed(2)}</Text>
          {info.text_read != null ? <Text style={styles.modalText1}>Sign Text: {"\n" + info.text_read}</Text> : null}
          <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function HelpModal({ isVisible, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredModalView}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Navigating the Map</Text>
          <Text style={styles.modalText}>
            Tap on any parking spot marker to view more details.
          </Text>
          <Text style={styles.modalText}>
            Details include the address, type of parking spot, confidence level, and an image if available.
          </Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// Component for rendering all markers on the map based on responseData
const CustomMarker = ({params, onSelect, iconSource}) => (
  <Marker
    coordinate={{ latitude: params.lat, longitude: params.lng }}
    title={params.class_name}
    description={`Confidence: ${params.conf.toFixed(2)}`}
    onPress={() => onSelect(params.did, params.lat, params.lng)}
  >
    {/* Custom View for Marker with adjusted size */}
    <Image source={iconSource} style={{width: 30, height: 30}} resizeMode="contain" />
  </Marker>
);

// Modified Markers function to use CustomMarker with resized images
function Markers({ responseData, onSelect }) {
  return Object.keys(responseData)
    .filter(key => key !== 'center_lat' && key !== 'center_lng' && key !== 'radius')
    .flatMap(key => responseData[key].detections)
    .map((params, index) => {
      const iconSource = params.class_name.includes("Road Sign") ? roadSignIcon : parkingMeterIcon;

      return (
        <CustomMarker 
          key={index} 
          params={params} 
          onSelect={onSelect} 
          iconSource={iconSource}
        />
      );
    });
}
  
  function MapDisplay({ responseData, setIsOnMap }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(detailedInfo);
    const [isHelpModalVisible, setIsHelpModalVisible] = React.useState(false); // State for help modal visibility
    const [mapType, setMapType] = useState('standard');
  
    const handleSelectMarker = async (did, lat, lng) => {
      // use the did to call the detail endpoint
      const params = {
        "did": did,
        "lat": lat,
        "lng": lng
      }
      result = await axios.post('http://192.168.4.97:8000/detail', params)
      let base64Image = 'data:image/jpeg;base64,'
      base64Image = base64Image + result.data.image_data
      result.data.image_data = base64Image
      setSelectedInfo(result.data);
      setModalVisible(true);
    };
    return (
      <ImageBackground source={require('../assets/sample.jpeg')} style={styles.backgroundImage} blurRadius={3}>
        <View style={styles.container}>
        <MapView
  style={styles.map}
  mapType={mapType}
  initialRegion={{
    latitude: responseData['center_lat'],
    longitude: responseData['center_lng'],
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0042,
            }}>
            <Circle
              center={{ latitude: responseData['center_lat'], longitude: responseData['center_lng'] }}
              radius={responseData['radius'] * 1609.34}
              strokeWidth={1}
              strokeColor={'#1a66ff'}
              fillColor={'rgba(230,238,255,0.5)'}
            />
            <Markers responseData={responseData} onSelect={handleSelectMarker} />
          </MapView>
          {/*<TouchableOpacity style={styles.backButton} onPress={() => setIsOnMap(false)}>
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>*/}
          <MarkerInfoModal visible={modalVisible} onClose={() => setModalVisible(false)} info={selectedInfo} />
          {/* Help button */}
        <Pressable
          onPress={() => setIsHelpModalVisible(true)}
          style={styles.helpButton}>
          <Text style={styles.helpButtonText}>?</Text>
        </Pressable>
        <Pressable
  style={styles.mapTypeButton}
  onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}>
  <Text style={styles.mapTypeButtonText}>
    {mapType === 'standard' ? 'Satellite View' : 'Standard View'}
  </Text>
</Pressable>
        {/* Help modal */}
        <HelpModal
          isVisible={isHelpModalVisible}
          onClose={() => setIsHelpModalVisible(false)}
        />
        <Pressable onPress={() => setIsOnMap(false)} style={styles.homeButton}>
          <Icon name="home" size={30} color="#FFFFFF" />
        </Pressable>
        </View>
        </ImageBackground>
      );
    }
    
    const styles = StyleSheet.create({
      backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
      container: {
        flex: 1,
        justifyContent: 'flex-end',
        
      },
      homeButton: {
        position: 'absolute',
        width: 50,
        height: 50,
        top: 50, // Adjust as needed
        left: 20, // Adjust as needed
        elevation: 5,
        backgroundColor: '#38a681',
        borderRadius: 20,
        padding: 10,
    },
      map: {
        width: width,
        height: height ,
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
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      parkingImage: {
        width: 300,
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
      },
      mapTypeButton: {
        position: 'absolute',
        backgroundColor: '#38a681',
        bottom: 20, // Adjust as necessary
        right: 20, // Adjust as necessary
        //backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 20,
        padding: 10,
      },
      mapTypeButtonText: {
        color: 'white',
        fontSize: 18,
        //nothing for commit 
      },
      backButton: {
        backgroundColor: "#4ECCA3",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10,
        marginBottom: 25,
        alignSelf: 'center',
      },
      backButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      buttonClose: {
        backgroundColor: "#2196F3",
        marginTop: 15,
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
      },
      helpButton: {
        position: 'absolute',
        right: 20,
        top: 50,
        backgroundColor: '#38a681',
        borderRadius: 20,
        padding: 10,
      },
      helpButtonText: {
        fontSize: 24,
        color: '#FFFFFF',
      },
      centeredModalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
      modalContent: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold',
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 16,
      },
      modalText1: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 16,
      }
    });
    
    export default MapDisplay;