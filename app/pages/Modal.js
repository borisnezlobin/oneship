import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Modal as RNModal } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tailwind from 'tailwind-rn';
import { CONFIG } from '../util/config';

function Modal({ visible, setVisible, children, title="Modal" }) {
    const insets = useSafeAreaInsets();
    return (
        <RNModal
            animationType="slide"
            visible={visible}
            onRequestClose={() => setVisible(false)}
            useNativeDriver={true}
        >
            <View style={tailwind("flex flex-col justify-center items-center h-full")}>
                <View style={{
                    position: "absolute",
                    top: useSafeAreaInsets().top,
                    left: 0,
                    width: Dimensions.get("window").width,
                    height: 48,
                    paddingHorizontal: 16,
                    backgroundColor: "#fff",
                    borderBottomWidth: 1,
                    borderBottomColor: "#00000010",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"

                }}>
                    <Text style={[
                        tailwind("text-lg font-bold"),
                        { color: CONFIG.green }
                    ]}>
                        {title}
                    </Text>
                    <TouchableOpacity onPress={() => setVisible(false)}>
                        <Text style={[
                            tailwind("font-bold"),
                            { color: CONFIG.red }
                        ]}>
                            CLOSE
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[
                    tailwind("bg-white flex flex-col justify-start items-start h-full w-full rounded-lg p-2"),
                ]}>
                    {children}
                </View>
            </View>
        </RNModal>
    )
}

export default Modal;