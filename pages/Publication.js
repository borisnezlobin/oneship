import React, { useEffect, useRef } from 'react'
import { SafeAreaView, Text, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Bar from '../components/Bar';
import PublicationListItem from '../components/PublicationListItem';
import getColors from '../util/COLORS';

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
                    source={{ uri: icon }}
                    resizeMode="contain"
                />
                <Text style={{width: "100%", textAlign: "center", color: COLORS.TEXT}}>
                    {data.articles.length} articles available
                </Text>
                {data.articles.map((e, i) => <PublicationListItem data={e} navigation={navigation} key={i} />)}
            </ScrollView>
            <Bar navigation={navigation} />
        </SafeAreaView>
    )
}

const remoteUrl = "https://paly-vikings.onrender.com/assets/external/";

const logos = {
    "C Magazine": (remoteUrl + "c_magazine_logo.png"),
    "C Magazine Dark": (remoteUrl + "c_magazine_logo_dark.png"),
    "Viking Magazine": (remoteUrl + "viking_logo.png"),
    "Viking Magazine Dark": (remoteUrl + "viking_logo.png"),
    "Verde": (remoteUrl + "verde_logo.png"),
    "Verde Dark": (remoteUrl + "verde_logo_dark.png"),
    "Paly Voice": (remoteUrl + "paly_voice_logo.png"),
    "Paly Voice Dark": (remoteUrl + "paly_voice_logo.png"),
}

export default Publication