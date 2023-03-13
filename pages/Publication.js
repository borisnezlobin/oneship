import React, { useEffect, useRef } from 'react'
import { SafeAreaView, Text, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import PublicationListItem from '../components/PublicationListItem';
import getColors from '../util/COLORS';

const Publication = ({ navigation, route }) => {
    const { data } = route.params;
    const COLORS = getColors();
    const r = useRef();

    useEffect(() => {
        if(r.current) r.current.scrollTo({y: 0, animated: true})
    }, [])

    return (
        <SafeAreaView style={{backgroundColor: COLORS.FOREGROUND_COLOR}}>
            <ScrollView ref={r}>
                <Image
                    style={{
                        width: "100%",
                        height: 150,
                    }}
                    source={{uri: logos[data.title]}}
                    resizeMode="stretch"
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
    "C Magazine": "https://cmagazine.org/wp-content/uploads/2022/03/C-Magazine.jpg",
    "Viking Magazine": "https://vikingsportsmag.com/wp-content/uploads/2018/08/viking-logo-1.jpeg",
    "Verde": "https://verdemagazine.com/wp-content/uploads/2015/09/logo2-2-scaled.jpg",
    "Paly Voice": "https://palyvoice.com/wp-content/uploads/2023/02/voicebanner-1.png",
}

export default Publication