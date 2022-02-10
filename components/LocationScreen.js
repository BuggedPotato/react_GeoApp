import { View, Text, StyleSheet, Switch, Dimensions, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import Dialog from "react-native-dialog";

import Montserrat from "../assets/fonts/Montserrat-Regular.ttf";
import Montserrat_bold from "../assets/fonts/Montserrat-Bold.ttf";

import LocationItem from "./LocationItem";


const LocationScreen =(props)=>{

    useEffect( ()=> {
        (async ()=> {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    alert("Odmowa dostępu do lokalizacji urządzenia");
                }
                // const obj = { lat: 13447, lng: 2007 };
                // await AsyncStorage.setItem( "132235", JSON.stringify( obj ) );
                await setAllLocations();
            })();
    }, [] );


    const [ fontLoaded ] = useFonts({
        Montserrat, Montserrat_bold
      });


    const [ locationsArray, setLocationsArray ] = useState( [] );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ isDialogVisible, setDialogVisible ] = useState( false );
    const [ lastPosition, setLastPosition ] = useState( null );
    // const [ listComponents, setListComponents ] = useState( [] );
    const [ selectedPositions, setSelectedPositions ] = useState( [] );
    const [ selectAll, setSelectAll ] = useState( false );

    const [ fakeUpdate, setFakeUpdate ] = useState( false );
    const [ shouldItemsSwitch, setShouldItemsSwitch ] = useState( true );

    useEffect( ()=>{
        console.log(selectedPositions);
        if( selectedPositions.length != locationsArray.length )
        {
            setShouldItemsSwitch(false);
            setSelectAll(false);
        }
    }, [fakeUpdate] );



    const getCurrentPosition = async ()=>{
        setIsLoading( true );

        const location = await Location.getCurrentPositionAsync();
        console.log(JSON.stringify(location, null, 4));
        const position = { timestamp: location.timestamp.toString(), lat: location.coords.latitude, lng: location.coords.longitude };
        setLastPosition( position );

        setIsLoading( false );
        setDialogVisible(true);
    }

    const savePosition = async ()=>{
        const obj = { lat: lastPosition.lat, lng: lastPosition.lng };
        await AsyncStorage.setItem( lastPosition.timestamp, JSON.stringify( obj ) );
        setDialogVisible( false );
        setAllLocations();
    }

    const setAllLocations = async ()=>{
        const data = await getAllLocations();
        setLocationsArray( data );
    }

    const getAllLocations = async ()=>{
        const keys = await AsyncStorage.getAllKeys();
        const array = await AsyncStorage.multiGet( keys );
        // console.log( "opachkiii" );

        if( keys.length == 0 )
        {
            return [];
        }
        else
        {
            for( let i = 0; i < array.length; i++ )
            {
                array[i][1] = JSON.parse( array[i][1] );
            }
            // console.log(array);
            return array;
        }
    }

    const deleteAllLocations = async ()=>{
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove( keys );
        await setAllLocations();
        setSelectedPositions( [] );
        setSelectAll(false);
        alert( "Dane zostały usunięte" );
    }


    const newLocationListItem = (item)=>{
        item = item.item;
        const component = <LocationItem onSwitch={setSelection} selectedArrayUpdate={selectAll} shouldSwitch={shouldItemsSwitch} timestamp={item[0]} latitude={item[1].lat} longitude={item[1].lng} />
        return component;
    }

    const setSelection = ( component, selected )=>{
        if( selected && !selectedPositions.includes( component ) )
        {
            selectedPositions.push( component );
        }
        else if( !selected && selectedPositions.includes( component ) )
        {
            let i = selectedPositions.indexOf( component );
            selectedPositions.splice( i, 1 );
        }
        // nienawidzę tego języka, nie łapie updatów tablic
        setFakeUpdate( !fakeUpdate );
        return selected;
    }


    const showPositionsOnMap = ()=>{
        if( selectedPositions.length == 0 )
        {
            alert( "Proszę zaznaczyć przynajmniej jedną pozycję." );
            return;
        }
        props.navigation.navigate( "map", { markers: getSelectedPositionsObjects() } );
    }

    const getSelectedPositionsObjects = ()=>{
        let arr = [];
        locationsArray.map((el, i)=>{
            if( selectedPositions.includes( el[0] ) )
            {
                let obj = {
                    timestamp: el[0],
                    latitude: el[1].lat,
                    longitude: el[1].lng
                };
                arr.push( obj );
            }
        })
        return arr;
    }


    return fontLoaded ? (
        <View style={ ss.main }>
            <ActivityIndicator size="large" color="gold" animating={isLoading}
                style={{ display: isLoading ? "flex" : "none",  width: "100%", height: "100%", backgroundColor: "#202124" }}
            />

            <View style={{ flex: 1, flexDirection: "row", margin: 10 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={ getCurrentPosition }>
                    <Text style={ss.whiteText}>ZAPISZ POZYCJĘ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={ deleteAllLocations }>
                    <Text style={ss.whiteText}>USUŃ WSZYSTKIE DANE</Text>
                </TouchableOpacity>
            </View>
            
            <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={ ()=> showPositionsOnMap() }>
                    <Text style={ss.whiteText}>PRZEJDŹ DO MAPY</Text>
                </TouchableOpacity>
                <Switch 
                    trackColor={{ true: "#ffe033", false: "gray" }}
                    thumbColor={ selectAll ? "#ffbf00" : "rgb(46,46,50)" }
                    value={selectAll}
                    onValueChange={ (val)=> {setSelectAll( val ); setShouldItemsSwitch(true) } }
                />
            </View>

            <View style={{ flex: 5 }}>
                <FlatList
                    style={ ss.flatlist }
                    data={ locationsArray }
                    renderItem={ (item)=> newLocationListItem(item) }
                    keyExtractor={ (item)=> item[0] }
                />
            </View>

            <View>
                <Dialog.Container visible={isDialogVisible}>
                    <Dialog.Title>Zapisywanie pozycji</Dialog.Title>
                    <Dialog.Description>
                        Pobrano pozycję, czy zapisać?
                    </Dialog.Description>
                    <Dialog.Button label="TAK" onPress={ savePosition }/>
                    <Dialog.Button label="NIE" onPress={ ()=> setDialogVisible(false) } />
                </Dialog.Container>
            </View>
        </View>
    ) : <View><Text>COULDNT LOAD FONT</Text></View>;
}

const ss = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

        // backgroundColor: "gold"
    },
    whiteText: {
        color: "whitesmoke",
        fontSize: Dimensions.get("screen").height / 38,
        fontFamily: "monospace",
        textAlign: "center",
    },
    title: {
        fontSize: Dimensions.get("screen").height / 10,
        fontWeight: "bold",
    },
    flatlist: {
        width: Dimensions.get("screen").width,
    }
});

export default LocationScreen;