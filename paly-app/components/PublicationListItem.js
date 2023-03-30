import React from 'react'
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import getColors from '../util/COLORS';

const PublicationListItem = ({ data, navigation }) => {
    const COLORS = getColors()

    if(data.title.includes("Los Gatos")){
        console.log(data);
    }
    var teaser = data.teaser.trim().split("\n").join(" ");

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("Publications_Publication_Article", { article: data })}
            style={{
                backgroundColor: COLORS.FOREGROUND_COLOR,
                height: 175,
                marginVertical: 8,
                position: "relative",
                width: Dimensions.get("window").width,
            }}
        >
                <View style={{
                    width: Dimensions.get("window").width - 96,
                    height: 175
                }}>
                    <Text numberOfLines={2} style={{
                        color: COLORS.GREEN,
                        fontWeight: 'bold',
                        fontSize: 24,
                        paddingHorizontal: 8,
                        height: 72,
                    }}>
                        {data.title}
                    </Text>
                    <Text numberOfLines={5} style={{
                        color: COLORS.TEXT,
                        paddingHorizontal: 8,
                    }}>
                        {teaser.length > 170 ? teaser.slice(0, 170) + "..." : teaser}
                    </Text>
                </View>
                <View
                    id={data.title}
                    style={{
                        height: 96,
                        width: 96,
                        position: "absolute",
                        right: 4,
                        top: (175 - 96) / 2,
                    }}
                >
                    <Image
                        source={{ uri: data.image}}
                        style={{
                            height: 96,
                            width: "100%",
                        }}
                    />
                </View>
        </TouchableOpacity>
    )
}

export default PublicationListItem