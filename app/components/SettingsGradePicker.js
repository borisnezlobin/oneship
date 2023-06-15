import { useState } from "react";
import { View, Text } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import DropDownPicker from "react-native-dropdown-picker";

const SettingsGradePicker = ({ grade, setGrade }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(grade);
    const [items, setItems] = useState([
        {label: 'Ninth', value: 9},
        {label: 'Tenth', value: 10},
        {label: 'Eleventh', value: 11},
        {label: 'Twelvth', value: 12},
    ]);

    const setGradeValue = (value) => {
        setValue(value);
        setGrade(value);
    }

    return (
        <View style={tailwind("flex my-6 px-3 flex-row justify-between items-center w-full")}>
            <Text style={[tailwind("text-lg"), { color: CONFIG.text }]}>
                Grade
            </Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setGradeValue}
                setItems={setItems}
                textStyle={{
                    color: CONFIG.text,
                }}
                itemSeparator={true}
                containerStyle={{
                    width: 150,
                    borderColor: CONFIG.bg,
                }}
            />
        </View>
    )
};

export default SettingsGradePicker;