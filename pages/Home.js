import React, { useContext, useState, useEffect } from 'react'
import { SafeAreaView, Text } from 'react-native'
import { HomeIcon } from 'react-native-heroicons/outline'
import { spring, Value, withSpring } from 'react-native-reanimated'
import Bar from '../components/Bar'
import getColors from '../util/COLORS'
import { UserSettingsContext } from '../util/contexts'
import Loading from '../util/Loading'

const Home = ({ navigation }) => {
    const { userSettingsContext } = useContext(UserSettingsContext); // force rerender
    const [loading, setLoading] = useState(true);
    const COLORS = getColors();
    const scaleValue = new Value(1);

    useEffect(() => {
      setTimeout(() => setLoading(!loading), 10 * 1000);
    }, [loading])
    

    if(loading){
        withSpring(scaleValue, {
            toValue: 1,
            damping: 15,
            mass: 1,
            stiffness: 150,
            overshootClamping: false,
            restSpeedThreshold: 0.001,
            restDisplacementThreshold: 0.001,
        })
    }else{
        withSpring(scaleValue, {
            toValue: 20,
            damping: 15,
            mass: 1,
            stiffness: 150,
            overshootClamping: false,
            restSpeedThreshold: 0.001,
            restDisplacementThreshold: 0.001,
        })
    }

    return <Loading scale={scaleValue} />
    
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