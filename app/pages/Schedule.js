import { SafeAreaView, Text } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import { useContext } from "react";
import { ScheduleContext } from "../util/contexts";
import { AcademicCapIcon } from "react-native-heroicons/outline";
import ScheduleItem from "../components/ScheduleItem";

const SchedulePage = () => {
    const { schedule } = useContext(ScheduleContext);

    if(schedule == null){
        return (
            <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
                <Text style={[tailwind("font-bold"), { color: CONFIG.green}]}>
                    Loading...
                </Text>
            </SafeAreaView>
        );
    }

    if(schedule.value == null){
        // no school
        return (
            <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
                <AcademicCapIcon color={CONFIG.green} size={100} style={tailwind("mb-4")} />
                <Text style={[tailwind("font-bold text-2xl"), { color: CONFIG.green}]}>
                    No School Today
                </Text>
                <Text style={[tailwind("text-lg"), { color: CONFIG.text}]}>
                    Enjoy your day off!
                </Text>
            </SafeAreaView>
        );
    }

    var start = schedule.value[0].start;
    var prevStart = start;
    var end = schedule.value[schedule.value.length - 1].end;

    return (
        <SafeAreaView style={tailwind("bg-white w-full h-full")}>
            {schedule.value.map((period, index) => {
                var temp = prevStart;
                prevStart = period.end;
                return (<ScheduleItem key={index} period={period} prevStart={temp} start={start} end={end} />)
            })}
        </SafeAreaView>
    );
}

export default SchedulePage;