import React, { useContext, useState, useEffect } from 'react'
import { SafeAreaView, Text } from 'react-native'
import { HomeIcon } from 'react-native-heroicons/outline'
import { spring, Value, withSpring } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Bar from '../components/Bar'
import getColors from '../util/COLORS'
import { UserSettingsContext } from '../util/contexts'
import Loading from '../util/Loading'

const Home = ({ navigation }) => {
    const { userSettingsContext } = useContext(UserSettingsContext); // force rerender
    const insets = useSafeAreaInsets();
    const COLORS = getColors();
    
    return (
        <>
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: "center", backgroundColor: COLORS.FOREGROUND_COLOR}}>
                <HomeIcon color={COLORS.GREEN} size={128} weight="fill" />
                <Text style={{color: COLORS.GREEN, fontWeight: 'bold', fontSize: 32, marginTop: 16}}>
                    Coming soon!
                </Text>
            </SafeAreaView>
            <Bar navigation={navigation} />
        </>
    )
}

export default Home