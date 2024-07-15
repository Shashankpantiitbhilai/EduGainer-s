import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 30.3165, // Latitude for Uttarakhand
  lng: 78.0322, // Longitude for Uttarakhand
};

function GoogleMapsComponent() {
  return (
    <LoadScript googleMapsApiKey="apikey">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default GoogleMapsComponent;
