import { useState } from "react";
import { View, Text } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import NiceInput from "./NiceInput";

const SettingsGradePicker = ({ grade, setGrade }) => {
    const [error, setError] = useState("");

    return (
        <View style={tailwind("flex mt-6 px-3 flex-col justify-center items-start w-full")}>
            <Text style={[tailwind("text-lg"), { color: CONFIG.text }]}>
                Grade
            </Text>
            <NiceInput
                cb={(value) => {
                    var val = parseInt(value);
                    if (isNaN(val)) {
                        setError("Grade must be a number");
                        return;
                    } else if (val < 9 || val > 12) {
                        setError("Grade must be between 9 and 12");
                        return;
                    }
                    setError("");
                    setGrade(val);
                }}
                style={{ width: "95%" }}
                error={error}
                placeholder={"Grade (9-12)"}
                defaultValue={grade.toString()}
            />
        </View>
    )
};

export default SettingsGradePicker;