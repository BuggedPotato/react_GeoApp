import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useFonts } from 'expo-font';
import Montserrat from "../assets/fonts/Montserrat-Regular.ttf";
import Montserrat_bold from "../assets/fonts/Montserrat-Bold.ttf";


const HomeScreen = (props )=>{

    const [ fontLoaded ] = useFonts({
        Montserrat, Montserrat_bold
      });

    return fontLoaded ? (
        <TouchableOpacity onPress={ ()=> props.navigation.navigate("location") }
            style={ss.main}
        >
            <View style={{flex: 8, alignItems: "center", justifyContent: 'center',}}>
                <Text style={{ ...ss.whiteText, ...ss.title}}>Geo App</Text>
                <Text style={ss.whiteText} >find and save you location</Text>
                <Text style={ss.whiteText} >use map</Text>
            </View>
            <Text style={{...ss.whiteText, color: "#ff9900", flex: 1}}>Dominik Pikoń 3P1</Text>
        </TouchableOpacity>
    )
    : null;
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

export default HomeScreen;