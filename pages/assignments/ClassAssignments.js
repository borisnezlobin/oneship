import React from 'react'
import { View, Text } from 'react-native'
import getColors from '../../util/COLORS'

const ClassAssignments = ({ classData }) => {
    const COLORS = getColors();
    console.log(JSON.stringify(classData));
    return (
        <View>
            <Text style={{
                color: COLORS.GREEN,
                fontWeight: 'bold',
                fontSize: 18
            }}>
                {classData.customName}
            </Text>
            {classData.assignments.map((e, i) => (
                <View>
                    <Text key={i} style={{color: COLORS.TEXT}}>{e.assignmentName}</Text>
                </View>
            ))}
        </View>
    )
}

export default ClassAssignments