import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import React from "react";

const MyMapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: props.lat, lng: props.lgn }}
    >
      {props.isMarkerShown && (
        <Marker position={{ lat: props.lat, lng: props.lgn }} />
      )}
    </GoogleMap>
  ))
);

export default MyMapComponent;
