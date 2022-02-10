import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState, useEffect } from "react";

const MapScreen = ( props )=>{
        
    const getMarkerComponents = ()=>{
        let markersArr = props.route.params.markers.map( (obj, i)=>{
            console.log( i );
            return (
                <Marker
                    coordinate={{ latitude: obj.latitude, longitude: obj.longitude }}
                    title={ "t: " + obj.timestamp }
                    description={ obj.latitude + ", " + obj.longitude }
                    key={i}
                /> );
        } );
        console.log( markersArr );
        return markersArr;
    }


    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={{
                latitude: props.route.params.markers[0].latitude,
                longitude: props.route.params.markers[0].longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            }}
            >
            { getMarkerComponents() }
        </MapView>
    );
}

const ss = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "gold"
    },
    whiteText: {
        color: "whitesmoke",
        fontSize: Dimensions.get("screen").height / 38,
        fontFamily: "Montserrat",
        textAlign: "center",
    },
    title: {
        fontSize: Dimensions.get("screen").height / 12,
        fontFamily: "Montserrat_bold",
    }
});

export default MapScreen;