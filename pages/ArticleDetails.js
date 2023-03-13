import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useContext } from 'react'
import { Dimensions, Image, SafeAreaView, Text, View } from 'react-native'
import PrimaryButton from "../components/PrimaryButton"
import getColors from '../util/COLORS';
import { LinearGradient } from 'expo-linear-gradient';
import { openBrowserAsync } from "expo-web-browser";
import { XMarkIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ArticleDetails = ({ navigation, route }) => {
    const { article } = route.params;
    const COLORS = getColors();
    const insets = useSafeAreaInsets()

    return (
        <View style={{
            height: "100%",
            width: "100%",
            backgroundColor: COLORS.FOREGROUND_COLOR,
            position: "relative"
        }}>
            <Image
                source={{ uri: article.image }}
                style={{
                    height: "45%",
                    width: "100%",
                }}
            />
            <View style={{
                position: "absolute",
                top: insets.top,
                height: "100%",
                width: "100%",
            }}>
                <LinearGradient
                    colors={["transparent", COLORS.FOREGROUND_COLOR]}
                    style={{
                        height: Dimensions.get("window").height * 0.45 - insets.top,
                    }}
                    locations={[0.3, 1]}
                >
                    <View
                        style={{
                            height: "100%"
                        }}
                    />
                </LinearGradient>
            </View>
            <Text adjustsFontSizeToFit={true} numberOfLines={3} style={{
                color: COLORS.GREEN,
                fontWeight: 'bold',
                fontSize: 32,
                textAlign: "center",
                width: "100%",
                padding: 4,
                marginTop: 36,
            }}>
                {article.title}
            </Text>
            <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={{width: "100%", textAlign: "center", color: COLORS.TEXT, fontSize: 20, paddingHorizontal: 8}}
            >
                {article.authors.map((e, i) => (
                    <Text
                        key={i}
                        onPress={() => openBrowserAsync(e.authorLink)}
                        style={{
                            color: "#0066f2"
                        }}
                    >
                        {e.authorName}
                        <Text style={{color: COLORS.TEXT}}>
                            {article.authors.length > 1 && i < article.authors.length - 1 ? ", " : ""}
                        </Text>
                    </Text>
                ))}
            </Text>
            <Text style={{color: COLORS.TEXT, textAlign: 'center', marginTop: 4, fontSize: 20, padding: 8,}}>
                {article.teaser.trim()}
            </Text>
            <Text style={{color: COLORS.TEXT, textAlign: 'center', marginTop: 4, fontSize: 20, padding: 8}}>
                {article.teaser.trim() == article.description.trim() ? "" : article.description.trim()}
            </Text>
            <View style={{
                marginTop: 0,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                position: 'absolute',
                bottom: insets.bottom,
            }}>
                <PrimaryButton cb={() => openBrowserAsync(article.link)} title="READ THE FULL STORY" style={{
                    width: 224,
                    height: 42,
                }} />
            </View>
            <View style={{
                position: "absolute",
                top: insets.top,
                left: 0,
                borderBottomRightRadius: 8,
                borderTopRightRadius: insets.top == 0 ? 0 : 8,
                elevation: 4,
                shadowColor: COLORS.TEXT,
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
        </View>
    )
}

export default ArticleDetails