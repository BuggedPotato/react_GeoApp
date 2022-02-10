import { View, Text, StyleSheet, Dimensions, Image, Switch } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

import mapIcon from "./map_icon_corrected.png";

const LocationItem =(props)=>{

    const [ switchState, setSwitchState ] = useState( false );

    useEffect( ()=>{
        if( props.shouldSwitch )
            onSwitch( props.selectedArrayUpdate );
    }, [ props.selectedArrayUpdate ] );

    const onSwitch = (enabled)=>{
        const res = props.onSwitch( props.timestamp, enabled );
        setSwitchState(res);
    }

    return(
        <View style={ss.main}>
            <Image source={mapIcon} style={ss.icon}></Image>
            <View style={{ flex: 3, alignItems: "center", }}>
                <Text style={{ ...ss.itemText, color: "gold", fontFamily: "Montserrat_bold" }}>timestamp: { props.timestamp }</Text>
                <Text style={ ss.itemText }>latitude: { props.latitude }</Text>
                <Text style={ ss.itemText }>longitude: { props.longitude }</Text>
            </View>
            <Switch 
                trackColor={{ true: "#ffe033", false: "gray" }}
                thumbColor={ switchState ? "#ffbf00" : "rgb(46,46,50)" }
                value={switchState}
                onValueChange={ onSwitch }
            />
        </View>
    );
}





const ss = StyleSheet.create({
    main: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        margin: 10

        // backgroundColor: "gold"
    },
    whiteText: {
        color: "whitesmoke",
        fontSize: Dimensions.get("screen").height / 38,
        fontFamily: "monospace",
        textAlign: "center",
    },
    itemText: {
        color: "whitesmoke",
        fontSize: Dimensions.get("screen").height / 48,
        fontFamily: "Montserrat",
        textAlign: "center",
    },
    title: {
        fontSize: Dimensions.get("screen").height / 10,
        fontWeight: "bold",
    },
    icon: {
        flex: 1,
        aspectRatio: 1,
        margin: 5,
    }
});

export default LocationItem;