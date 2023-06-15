import { useState } from "react";
import { View, Text } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import DropDownPicker from "react-native-dropdown-picker";

const SettingsClassReminder = ({ reminder, setClassReminder }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(reminder);
    const [items, setItems] = useState([
        {label: 'Don\'t', value: -1},
        {label: '0 minutes before', value: 0},
        {label: '3 minutes before', value: 3},
        {label: '5 minutes before', value: 5},
        {label: '10 minutes before', value: 10},
        {label: '15 minutes before', value: 15},
    ]);

    const setReminder = (value) => {
        setValue(value);
        setClassReminder(value);
    }

    return (
        <View style={tailwind("flex my-6 px-3 flex-row justify-between items-center w-full")}>
            <Text style={[tailwind("text-lg"), { color: CONFIG.text }]}>
                Remind me about class
            </Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setReminder}
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
    );
};

export default SettingsClassReminder;