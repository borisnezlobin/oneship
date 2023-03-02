import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import COLORS from '../util/COLORS'
import { CustomScheduleItem, UserSettingsContext } from '../util/contexts';

// yes I know StyleSheet is a thing
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

const ScheduleBottomSheet = ({ bottomSheetRef, modalStatus, setModal }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [customName, setCustomName] = useState(modalStatus.data.customName);
    const [teacher, setTeacher] = useState(modalStatus.data.teacher);
    const [room, setRoom] = useState(modalStatus.data.room);
    const { userSettingsContext, setUserSettingsContext } = useContext(UserSettingsContext);
    const snapPoints = useMemo(() => ['25%', '50%'], []);

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
            color: "black",
            textAlign: 'center'
        }}>
            Taught by {modalStatus.data.teacher} in {modalStatus.data.room}
        </Text>
        <TouchableOpacity
            onPress={() => {
                setIsEditing(true);
                bottomSheetRef.current.snapToIndex(1)
            }}
            style={{
                backgroundColor: COLORS.GREEN,
                marginTop: 24,
                borderRadius: 2,
                height: 36,
                width: 100,
                marginLeft: (Dimensions.get("window").width - 100) / 2,
                shadowColor: COLORS.GREEN,
                shadowOpacity: 1,
                shadowOffset: { width: 0, height: 0.5},
                shadowRadius: 5
            }}
        >
            <Text style={{
                fontSize: 16,
                marginTop: 8,
                fontWeight: 'bold',
                color: COLORS.FOREGROUND_COLOR,
                textAlign: 'center',
            }}>
                EDIT
            </Text>
        </TouchableOpacity>
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
            <TouchableOpacity
                onPress={() => {
                    setIsEditing(false);
                    bottomSheetRef.current.snapToIndex(0);
                }}
                style={{
                    backgroundColor: COLORS.BACKGROUND_COLOR,
                    borderRadius: 2,
                    height: 36,
                    width: 100,
                    shadowColor: COLORS.BACKGROUND_COLOR,
                    shadowOpacity: 1,
                    shadowOffset: { width: 0, height: 0.5},
                    shadowRadius: 5
                }}
            >
                <Text style={{
                    fontSize: 16,
                    marginTop: 8,
                    fontWeight: 'bold',
                    color: COLORS.FOREGROUND_COLOR,
                    textAlign: 'center',
                }}>
                    CANCEL
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleFormSubmit}
                style={{
                    backgroundColor: COLORS.GREEN,
                    borderRadius: 2,
                    height: 36,
                    width: 100,
                    shadowColor: COLORS.GREEN,
                    shadowOpacity: 1,
                    shadowOffset: { width: 0, height: 0.5},
                    shadowRadius: 5
                }}
            >
                <Text style={{
                    fontSize: 16,
                    marginTop: 8,
                    fontWeight: 'bold',
                    color: COLORS.FOREGROUND_COLOR,
                    textAlign: 'center',
                }}>
                    SAVE
                </Text>
            </TouchableOpacity>
        </View>
    </>)

    return (
        <BottomSheet
            style={{
                shadowRadius: "2",
                shadowColor: COLORS.BACKGROUND_COLOR,
                shadowOpacity: 0.5
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