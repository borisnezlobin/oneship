import React, { useContext } from 'react'
import { Dimensions, SafeAreaView, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DocumentPlusIcon } from 'react-native-heroicons/outline'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Bar from '../../components/Bar'
import getColors from '../../util/COLORS'
import { UserSettingsContext } from '../../util/contexts'
import ClassAssignments from './ClassAssignments'

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
                            <DocumentPlusIcon size={36} color={COLORS.GREEN} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    top: 64,
                    width: Dimensions.get("window").width - 16,
                    marginLeft: 8,
                    height: Dimensions.get("window").height - 64 - insets.bottom - insets.top - 50,
                    justifyContent: "center",
                }}>
                    {Object.keys(userSettingsContext.schedule).map((e, i) => {
                        if(e == "Lunch" || e == "PRIME" || (!userSettingsContext.show0Period && e == "0 Period")) return;
                        return <ClassAssignments classData={userSettingsContext.schedule[e]} />
                    })}
                </View>
            </SafeAreaView>
            <Bar navigation={navigation} />
        </>
    )
}

export default Assignments