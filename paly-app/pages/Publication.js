import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef } from 'react'
import { SafeAreaView, Text, Image, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Bar from '../components/Bar';
import PublicationListItem from '../components/PublicationListItem';
import getColors from '../util/COLORS';

const Publication = ({ navigation, route }) => {
    const { data } = route.params;
    const insets = useSafeAreaInsets();
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
            <View style={{
                position: "absolute",
                top: insets.top + (insets.top == 0 ? 12 : 2),
                left: 12,
                borderRadius: 8,
                elevation: 4,
                shadowColor: COLORS.BACKGROUND_COLOR,
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 1,
                shadowRadius: 4,
                padding: 8,
                backgroundColor: COLORS.FOREGROUND_COLOR
            }}>
                <TouchableOpacity onPress={navigation.goBack}>
                    <XMarkIcon color={COLORS.TEXT} size={32} />
                </TouchableOpacity>
          </View>
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