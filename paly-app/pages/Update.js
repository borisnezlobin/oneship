import React, { useContext } from 'react'
import { SafeAreaView, Text, View, Platform } from 'react-native'
import LogoSvg from '../util/LogoSvg'
import * as FileSystem from 'expo-file-system'
import getColors from '../util/COLORS'
import { UserSettingsContext, VersionContext } from '../util/contexts'
import PrimaryButton from '../components/PrimaryButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CONFIG from '../util/config'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { CheckIcon } from 'react-native-heroicons/outline'
import { startActivityAsync } from 'expo-intent-launcher'

const Update = ({ closeCB }) => {
    const { userSettingsContext } = useContext(UserSettingsContext); // force rerender
    const insets = useSafeAreaInsets();
    const COLORS = getColors();
    const [downloadProgress, setDownloadProgress] = React.useState(0);
    const { remoteVersion } = useContext(VersionContext);

    const downloadUpdate = async () => {
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
            if(Platform.OS == "android"){
                try{
                    const { uri } = await download.downloadAsync();
                    console.log("Finished downloading to", uri);
                    const data = await FileSystem.getContentUriAsync(uri);
                    console.log("got content uri", data);
                    const intent = await startActivityAsync(
                        "android.intent.action.VIEW",
                        {
                            data,
                            flags: 1,
                            type: "application/vnd.android.package-archive",
                        }
                    );
                    if(!intent){
                        alert("Failed to install update");
                        console.log("Failed to install update");
                    }else{
                        alert("Update installed: " + intent.resultCode);
                        console.log("Update installed: " + intent.resultCode);
                    }
                }catch(e){ console.log("error while installing update: " + e); }
            }else{
                navigation.navigate("Home");
                alert("How did you even cop this app on ios my bruv");
            }
        }catch(e){  console.error(e); }
        // fetch(CONFIG.SERVER_URL  + "/assets/internal/PalyOneShip.apk");
    }
    
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
                >
                    {(fill) => fill == 100 ? <CheckIcon color={COLORS.GREEN} size={128} /> : <></>}
                </AnimatedCircularProgress>
                }
                {downloadProgress == 0 ?
                <PrimaryButton style={{ margin: 16, height: 48, width: 192 }} title={"Download v" + remoteVersion} cb={downloadUpdate} />
                : <></>}
            </SafeAreaView>
            <PrimaryButton title="CLOSE" cb={closeCB} style={{
                position: "absolute",
                top: insets.top + 8,
                left: insets.left + 8,
            }} />
        </>
    )
}

export default Update