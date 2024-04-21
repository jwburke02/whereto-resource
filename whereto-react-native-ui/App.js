import React from 'react';
import InputDisplay from './displays/InputDisplay';
import MapDisplay from './displays/MapDisplay';

export default function App() {
  // State Variables for controlling current display
  const [isOnMap, setIsOnMap] = React.useState(false)
  // State Variable to hold response data (error or success)
  const [responseData, setResponseData] = React.useState({"center_lat": 0, "center_lng": 0, "radius": 0})

  // Application Display
  return (
    !isOnMap ? 
      <InputDisplay setIsOnMap={setIsOnMap} setResponseData={setResponseData}/>
    : 
      <MapDisplay responseData={responseData} setIsOnMap={setIsOnMap} />
  );
}