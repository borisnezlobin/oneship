import React, { useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import Loading from '../util/Loading';

const Schedule = () => {
    // use localstorage to avoid load times every time user visits page
    const [schedule, setSchedule] = useState(localStorage.getItem("schedule-today"));

    if(schedule == null){
        return (<Loading />);
    }

    return (
        <SafeAreaView>
            <View>{schedule[0].name}</View>
        </SafeAreaView>
    )
}

export default Schedule