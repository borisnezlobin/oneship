import React, { useEffect, useRef } from 'react'
import { SafeAreaView, Text, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import PublicationListItem from '../components/PublicationListItem';
import getColors from '../util/COLORS';

var colors = getColors()

const Publication = ({ navigation, route }) => {
    const { data } = route.params;
    const COLORS = getColors();
    const r = useRef();
    
    const icon = logos[data.title + (!COLORS.isLightMode ? " Dark" : "")]

    useEffect(() => {
        if(r.current) r.current.scrollTo({y: 0, animated: true})
    }, [])

    return (
        <SafeAreaView style={{backgroundColor: COLORS.FOREGROUND_COLOR}}>
            <ScrollView ref={r}>
                <Image
                    style={{
                        width: "100%",
                        height: 115,
                    }}
                    source={icon}
                    resizeMode="contain"
                />
                <Text style={{width: "100%", textAlign: "center", color: COLORS.TEXT}}>
                    {data.articles.length} articles available
                </Text>
                {data.articles.map((e, i) => <PublicationListItem data={e} navigation={navigation} key={i} />)}
            </ScrollView>
        </SafeAreaView>
    )
}

const logos = {
    "C Magazine": require("../assets/c_magazine_logo.png"),
    "C Magazine Dark": require("../assets/c_magazine_logo_dark.png"),
    "Viking Magazine": require("../assets/viking_logo.png"),
    "Viking Magazine Dark": require("../assets/viking_logo.png"),
    "Verde": require("../assets/verde_logo.png"),
    "Verde Dark": require("../assets/verde_logo_dark.png"),
    "Paly Voice": require("../assets/paly_voice_logo.png"),
    "Paly Voice Dark": require("../assets/paly_voice_logo.png"),
}

export default Publication