import React, { useContext, useState } from 'react'
import { Alert, Dimensions, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Picker } from "@react-native-picker/picker";
import GoodTextInput from '../../components/GoodTextInput'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import getColors from '../../util/COLORS'
import { Assignment, UserSettingsContext } from '../../util/contexts'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import DismissKeyboard from '../../components/DismissKeyboard';

const CreateAssignment = ({ navigation }) => {
    const { userSettingsContext, setUserSettingsContext } = useContext(UserSettingsContext);
    // don't you worry 'bout a thing, because every thing, every little thing
    // will be all right
    // *except this top 10 oneliner
    const classes = Object.keys(userSettingsContext.schedule).map((e, i) => userSettingsContext.schedule[Object.keys(userSettingsContext.schedule)[i]])
    const [title, setTitle] = useState("");
    const [dateDue, setDateDue] = useState(new Date());
    const [description, setDescription] = useState("");
    const [selectedClass, setClass] = useState(classes[0]);
    const [page, setPage] = useState(0);
    const insets = useSafeAreaInsets()

    const COLORS = getColors();

    const pageOneToTwo = () => {
        if(title.length == 0){
            Alert.alert(
                "Please enter a title",
                "",
                [
                    {text: "Fine"},
                ],
                {cancelable: false}
            )
            return;
        }
        // idc if description is empty

        setPage(2);
    }

    const createAssignment = () => {
        const assignment = new Assignment(title, description, Date.parse(dateDue), 1);
        var c;
        for(var i = 0; i < classes.length; i++){
            if(classes[i].realName == selectedClass){
                c = classes[i];
                continue;
            }
        }
        var newClass = c;
        newClass.assignments.push(assignment);
        var newSettings = {...userSettingsContext};
        newSettings.schedule[selectedClass] = newClass;
        setUserSettingsContext(newSettings);
        clearData();
        navigation.navigate("Assignments");
    }

    const clearData = () => {
        setClass(classes[0]);
        setDescription("");
        setDateDue(new Date());
        setPage(0);
        setTitle("");
    }

    if(page == 0){
        return (
            <SafeAreaView style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.FOREGROUND_COLOR
            }}>
                <Text style={{
                    color: COLORS.GREEN,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 24,
                    marginTop: 16,
                }}>
                    Which class?
                </Text>
                <Picker
                    selectedValue={selectedClass}
                    dropdownIconColor={COLORS.TEXT}
                    onValueChange={(itemValue, itemIndex) => 
                        setClass(itemValue)
                    }
                    mode="dropdown"
                    style={{
                        color: COLORS.TEXT,
                        width: Platform.OS == "android" ? Dimensions.get("window").width - 96 : "100%",
                        height: Platform.OS == "android" ? 50 : 200,
                        marginVertical: Platform.OS == "android" ? 75 : 0,
                        marginHorizontal: Platform.OS == "android" ? 96 : 0,
                        backgroundColor: Platform.OS == "android" ? COLORS.LIGHT : COLORS.FOREGROUND_COLOR
                    }}
                    itemStyle={{ color: COLORS.TEXT }}
                >
                    {classes.map((e, i) => {
                        if(e.realName == "Lunch" || e.realName == "PRIME") return;
                        return <Picker.Item
                            key={i}
                            label={e.customName}
                            value={e.realName}
                            style={{
                                color: COLORS.TEXT,
                                backgroundColor: e.realName == selectedClass ? COLORS.LIGHT : COLORS.FOREGROUND_COLOR
                            }}
                        />
                    })}
                </Picker>
                <View style={{
                    marginTop: 24,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <SecondaryButton
                        cb={() => {
                            clearData()
                            navigation.navigate("Assignments");
                        }}
                        title="CANCEL"
                    />
                    <PrimaryButton cb={() => setPage(1)} title="NEXT" />
                </View>
            </SafeAreaView>
        )
    }

    if(page == 1){
        const idk = <View style={{width: "100%"}}>
            <DismissKeyboard />
            <Text style={{color: COLORS.GREEN, textAlign: "center", fontWeight: 'bold', fontSize: 32, marginTop: 16}}>
                Create an assignment
            </Text>
            <GoodTextInput
                placeholder="Title"
                value={title}
                setValue={setTitle}
                
            />
            <GoodTextInput
                placeholder="Description"
                lines={10}
                value={description}
                setValue={setDescription}
            />
        </View>
        return (
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? 'padding' : undefined}>
                <SafeAreaView style={{
                    height: "100%",
                    alignItems: "center",
                    backgroundColor: COLORS.FOREGROUND_COLOR
                }}>
                    {idk}
                    <View style={{
                        marginTop: 24,
                        position: "absolute",
                        bottom: insets.bottom,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <SecondaryButton
                            cb={() => setPage(0)}
                            title="BACK"
                        />
                        <PrimaryButton cb={pageOneToTwo} title="NEXT" />
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }

    if(page == 2){
        const options = { weekday: 'short', year: '2-digit', month: 'long', day: "numeric" };
        var pickerItems = [];
        for(var i = 0; i < 90; i++){
            pickerItems.push(new Date(Date.now() + i * 24 * 60 * 60000));
        }
        return (
            <SafeAreaView style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.FOREGROUND_COLOR
            }}>
                <Text style={{
                    color: COLORS.GREEN,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 24,
                    marginTop: 16,
                }}>
                    When is it due?
                </Text>
                <Picker
                    selectedValue={dateDue}
                    onValueChange={(itemValue, itemIndex) =>{
                        setDateDue(itemValue);
                    }}
                    mode="dropdown"
                    style={{
                        color: COLORS.TEXT,
                        width: Platform.OS == "android" ? Dimensions.get("window").width - 96 : "100%",
                        height: Platform.OS == "android" ? 50 : 200,
                        marginVertical: Platform.OS == "android" ? 75 : 0,
                        marginHorizontal: Platform.OS == "android" ? 96 : 0,
                        backgroundColor: Platform.OS == "android" ? COLORS.LIGHT : COLORS.FOREGROUND_COLOR,
                    }}
                    itemStyle={{ color: COLORS.TEXT }}
                >
                    {pickerItems.map((e, i) => <Picker.Item
                            style={{
                                color: COLORS.TEXT,
                                backgroundColor: e.toLocaleDateString("en-us", options) == dateDue ? COLORS.LIGHT : COLORS.FOREGROUND_COLOR
                            }}
                            value={e.toLocaleDateString("en-us", options)}
                            label={e.toLocaleDateString("en-us", options)}
                            key={i}
                        />
                    )}
                </Picker>
                <View style={{
                    marginTop: 24,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <SecondaryButton
                        cb={() => setPage(1)}
                        title="BACK"
                    />
                    <PrimaryButton cb={createAssignment} title="CREATE" />
                </View>
            </SafeAreaView>
        )
    }
}

export default CreateAssignment