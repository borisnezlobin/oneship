import React, { useContext } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import LogoSvg from '../util/LogoSvg'
import * as FileSystem from 'expo-file-system'
import getColors from '../util/COLORS'
import { UserSettingsContext } from '../util/contexts'
import PrimaryButton from '../components/PrimaryButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CONFIG from '../util/config'
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const Update = ({ navigation }) => {
    const { userSettingsContext } = useContext(UserSettingsContext); // force rerender
    const insets = useSafeAreaInsets();
    const COLORS = getColors();
    const [downloadProgress, setDownloadProgress] = React.useState(0);
    
    return (
        <>
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: "center", backgroundColor: COLORS.FOREGROUND_COLOR}}>
                {downloadProgress == 0 ?
                <View style={{
                    width: 300,
                    height: 300,
                    margin: 2,
                }}>
                    <LogoSvg />
                </View> :
                <AnimatedCircularProgress
                    size={300}
                    width={10}
                    fill={downloadProgress * 100}
                    rotation={0}
                    lineCap='round'
                    backgroundWidth={2}
                    tintColor={COLORS.GREEN}
                    backgroundColor={COLORS.BACKGROUND_COLOR}
                />
                }
                <Text style={{color: COLORS.GREEN, fontWeight: 'bold', fontSize: 32, marginTop: 16, textAlign: "center"}}>
                    A new version of OneShip is available!
                </Text>
                <PrimaryButton style={{ margin: 16, height: 48, width: 192 }} title="DOWNLOAD" cb={async () => {
                    var download = FileSystem.createDownloadResumable(
                        CONFIG.SERVER_URL  + "/assets/internal/PalyOneShip.apk",
                        FileSystem.documentDirectory + "PalyOneShip.apk",
                        {},
                        (downloadProgress) => {
                            const percentage = (downloadProgress.totalBytesWritten + 0.0) / downloadProgress.totalBytesExpectedToWrite;
                            setDownloadProgress(percentage);
                        }
                    );
                    try{
                        const { uri } = await download.downloadAsync();
                        console.log("Finished downloading to ", uri);
                    }catch(e){  console.error(e); }
                    // fetch(CONFIG.SERVER_URL  + "/assets/internal/PalyOneShip.apk");
                }} />
            </SafeAreaView>
            <PrimaryButton title="CLOSE" cb={() => navigation.navigate("Home")} style={{
                position: "absolute",
                top: insets.top + 8,
                left: insets.left + 8,
            }} />
        </>
    )
}

export default Update