import React, { useContext } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import LogoSvg from '../util/LogoSvg'
import Bar from '../components/Bar'
import getColors from '../util/COLORS'
import { UserSettingsContext } from '../util/contexts'

const Home = ({ navigation }) => {
    const { userSettingsContext } = useContext(UserSettingsContext); // force rerender
    const COLORS = getColors();
    
    return (
        <>
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: "center", backgroundColor: COLORS.FOREGROUND_COLOR}}>
                <View style={{
                    width: 300,
                    height: 300,
                    margin: 2,
                }}>
                    <LogoSvg />
                </View>
                <Text style={{color: COLORS.GREEN, fontWeight: 'bold', fontSize: 32, marginTop: 16}}>
                    OneShip
                </Text>
                <Text>
                    Made by RandomLetters
                </Text>
            </SafeAreaView>
            <Bar navigation={navigation} />
        </>
    )
}

export default Home