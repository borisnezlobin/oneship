import { useState } from "react";
import { View, Text } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import NiceInput from "./NiceInput";

const SettingsClassReminder = ({ reminder, setClassReminder }) => {
    const [error, setError] = useState("");

    return (
        <View style={tailwind("flex px-3 flex-col justify-between items-start w-full")}>
            <Text style={[tailwind("text-lg"), { color: CONFIG.text }]}>
                Class reminder
            </Text>
            <NiceInput
                cb={(value) => {
                    var val = parseInt(value);
                    if (isNaN(val)) {
                        setError("Reminder must be a number");
                        return;
                    } else if (val < -1 || val > 15) {
                        setError("Reminder must be between -1 and 15");
                        return;
                    }
                    setError("");
                    setClassReminder(val);
                }}
                style={{ width: "95%" }}
                placeholder={"Reminder (minutes before)"}
                defaultValue={reminder.toString()}
            />
        </View>
    );
};

export default SettingsClassReminder;