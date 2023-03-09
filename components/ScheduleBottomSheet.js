import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import getColors from '../util/COLORS'
import { CustomScheduleItem, UserSettingsContext } from '../util/contexts';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

const ScheduleBottomSheet = ({ bottomSheetRef, modalStatus, setModal }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [customName, setCustomName] = useState(modalStatus.data.customName);
    const [teacher, setTeacher] = useState(modalStatus.data.teacher);
    const [room, setRoom] = useState(modalStatus.data.room);
    const { userSettingsContext, setUserSettingsContext } = useContext(UserSettingsContext);
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    const COLORS = getColors();

    // yes I know StyleSheet is a thing
    // stfu
    // yes I know that I have a component for text input
    // stfu
    const textInputStyle = {
        alignSelf: "stretch",
        marginTop: 4,
        marginHorizontal: 12,
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: COLORS.LIGHT,
        color: COLORS.GREEN,
        textAlign: "center",
    }

    useEffect(() => {
        bottomSheetRef.current?.snapToIndex(0)
    }, [])

    const handleFormSubmit = () => {
        var newData = {...userSettingsContext}
        newData.schedule[modalStatus.data.realName] = new CustomScheduleItem(modalStatus.data.realName, customName, teacher, room);
        setUserSettingsContext(newData);
        setIsEditing(false);
        bottomSheetRef.current.snapToIndex(0);
        setModal({shown: true, data: {
            realName: modalStatus.data.realName,
            customName: customName,
            teacher: teacher,
            room: room,
            start: modalStatus.data.start,
            end: modalStatus.data.end
        }})
    }

    var dataComponent = (<>
        <Text style={{
            fontWeight: 'bold',
            fontSize: 32,
            color: COLORS.GREEN,
            textAlign: 'center'
        }}>
            {modalStatus.data.customName}
        </Text>
        <Text style={{
            fontSize: 16,
            color: "grey",
            textAlign: 'center'
        }}>
            {modalStatus.data.start} - {modalStatus.data.end}
        </Text>
        <Text style={{
            fontSize: 16,
            marginTop: 8,
            color: COLORS.TEXT,
            textAlign: 'center'
        }}>
            Taught by {modalStatus.data.teacher} in {modalStatus.data.room}
        </Text>
        <PrimaryButton
            cb={() => {
                setIsEditing(true);
                bottomSheetRef.current.snapToIndex(1)
            }}
            title="EDIT"
            style={{
                marginLeft: (Dimensions.get("window").width - 100) / 2,
                marginTop: 24
            }}
        />
    </>);

    var editingComponent = (<>
        <Text style={{
            fontWeight: 'bold',
            fontSize: 32,
            marginBottom: 24,
            color: COLORS.GREEN,
            textAlign: 'center'
        }}>
            {modalStatus.data.realName}
        </Text>
        <BottomSheetTextInput
            placeholder="What's the name of this class?"
            value={customName}
            onChangeText={setCustomName}
            maxLength={16} // looks gud
            style={textInputStyle}
        />
        <BottomSheetTextInput
            placeholder='Which room is this class in?'
            value={room}
            maxLength={22} // length of "Performing Arts Center"
            onChangeText={setRoom}
            style={textInputStyle}
        />
        <BottomSheetTextInput
            placeholder="Who teaches this class?"
            value={teacher} // no max length :(
            onChangeText={setTeacher}
            style={textInputStyle}
        />
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
                    setIsEditing(false);
                    bottomSheetRef.current.snapToIndex(0);
                }}
                title="CANCEL"
            />
            <PrimaryButton cb={handleFormSubmit} title="SAVE" />
        </View>
    </>)

    return (
        <BottomSheet
            style={{
                shadowRadius: "2",
                shadowColor: COLORS.BACKGROUND_COLOR,
                shadowOpacity: 0.5,
            }}
            handleIndicatorStyle={{
              backgroundColor: COLORS.GREY
            }}
            backgroundStyle={{
              backgroundColor: COLORS.FOREGROUND_COLOR
            }}
            handleStyle={{
              backgroundColor: COLORS.FOREGROUND_COLOR,
            }}
            enablePanDownToClose={true}
            index={-1}
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            onClose={() => {
                setIsEditing(false)
                setModal({shown: false, data: null})
            }}
        >
            <BottomSheetView>
                {isEditing ? editingComponent : dataComponent}
            </BottomSheetView>
        </BottomSheet>
    )
}

export default ScheduleBottomSheet