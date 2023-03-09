import { FilePlus, Scroll } from 'phosphor-react-native'
import React, { useContext } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Bar from '../../components/Bar'
import getColors from '../../util/COLORS'
import { UserSettingsContext } from '../../util/contexts'

const Assignments = ({ navigation }) => {
    const { userSettingsContext } = useContext(UserSettingsContext);
    const insets = useSafeAreaInsets();
    const COLORS = getColors();

    return (
        <>
            <SafeAreaView style={{backgroundColor: COLORS.FOREGROUND_COLOR, height: "100%"}}>
                <View style={{
                    position: 'absolute',
                    top: insets.top,
                    width: "100%",
                    backgroundColor: COLORS.FOREGROUND_COLOR,
                    /*display: 'flex',
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: 'center'*/
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: COLORS.GREEN,
                        fontSize: 32,
                    }}>
                        Assignments
                    </Text>
                    <View style={{
                            display: 'flex',
                            flexDirection: "row",
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            right: 8,
                            height: 36,
                            top: 0
                        }}>
                        <TouchableOpacity onPress={() => navigation.navigate("CreateAssignment")}>
                            <FilePlus size={36} color={COLORS.GREEN} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
            <Bar navigation={navigation} />
        </>
    )

    return (
        <>
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: "center", backgroundColor: COLORS.FOREGROUND_COLOR}}>
                <Scroll color={COLORS.GREEN} size={128} weight="fill" />
                <Text style={{color: COLORS.GREEN, fontWeight: 'bold', fontSize: 32, marginTop: 16}}>
                    Coming soon!
                </Text>
            </SafeAreaView>
            <Bar navigation={navigation} />
        </>
    )
}

export default Assignments