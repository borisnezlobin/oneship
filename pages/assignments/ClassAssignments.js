import React, { useContext } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CheckIcon, FireIcon } from 'react-native-heroicons/outline';
import getColors from '../../util/COLORS'
import { UserSettingsContext } from '../../util/contexts';

const ClassAssignments = ({ classData }) => {
    const { userSettingsContext } = useContext(UserSettingsContext);
    var COLORS = getColors();
    console.log(JSON.stringify(classData));
    return (
        <View style={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: COLORS.isLightMode ? COLORS.LIGHT : COLORS.BACKGROUND_COLOR,
            borderRadius: 8,
            margin: 2,
        }}>
                <TouchableOpacity onPress={()=>{}}>
                    <Text style={{
                        color: COLORS.GREEN,
                        fontWeight: 'bold',
                        fontSize: 18,
                        textAlign: 'center',
                    }}>
                        {classData.customName}
                    </Text>
                </TouchableOpacity>
                <View style={{
                    borderRadius: 8,
                    backgroundColor: COLORS.isLightMode ? COLORS.FOREGROUND_COLOR : COLORS.LIGHT,
                    width: 128,
                    height: 36,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: 'row'
                }}>
                    <FireIcon color={COLORS.RED} />
                    <Text style={{
                        textAlign: "center",
                        lineHeight: 36,
                        fontWeight: 'bold',
                        color: COLORS.TEXT,
                        marginLeft: 8,
                        marginRight: 16,
                    }}>
                        {classData.assignments.length}
                    </Text>
                    <CheckIcon color={COLORS.GREEN} />
                    <Text style={{
                        textAlign: "center",
                        lineHeight: 36,
                        fontWeight: 'bold',
                        color: COLORS.TEXT,
                        marginLeft: 4
                    }}>
                        {classData.finishedAssignments}
                    </Text>
                </View>
        </View>
    )
}

export default ClassAssignments