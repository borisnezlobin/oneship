import React from 'react'
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import getColors from '../util/COLORS';

const PublicationListItem = ({ data, navigation }) => {
    const COLORS = getColors()

    if(data.teaser.includes("ChatGPT")){
        console.log(data);
    }
    var teaser = data.teaser.trim().split("\n").join(" ");

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("Article", { article: data })}
            style={{
                backgroundColor: COLORS.FOREGROUND_COLOR,
                height: Dimensions.get("screen").width / 4,
                marginVertical: 48,
                position: "relative"
            }}
        >
                <View style={{
                    width: "75%"
                }}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={2} style={{
                        color: COLORS.GREEN,
                        fontWeight: 'bold',
                        fontSize: 24,
                        paddingHorizontal: 8,
                    }}>
                        {data.title}
                    </Text>
                    <Text adjustsFontSizeToFit={true} numberOfLines={5} style={{
                        color: COLORS.TEXT,
                        paddingHorizontal: 8,
                    }}>
                        {teaser.length > 170 ? teaser.slice(0, 170) + "..." : teaser}
                    </Text>
                </View>
                <View
                    id={data.title} 
                    style={{
                        height: 136,
                        width: "25%",
                        position: "absolute",
                        right: 2,
                        top: 0,
                    }}
                >
                    <Image
                        source={{ uri: data.image}}
                        style={{
                            height: 136,
                            width: "100%",
                        }}
                    />
                </View>
        </TouchableOpacity>
    )
}

export default PublicationListItem