import { useEffect, useState } from "react";
import { CONFIG } from "../util/config";

const semverToInt = (version) => {
    const versionArray = version.split('.');
    const major = parseInt(versionArray[0]);
    const minor = parseInt(versionArray[1]);
    const patch = parseInt(versionArray[2]);
    return major * 10000 + minor * 100 + patch;
};

const getInfoText = (serverVersion) => {
    var text;
    if(semverToInt(CONFIG.VERSION) > semverToInt(serverVersion.min)){
        text = "#A newer OneShip is available!\nYou can update to version " + serverVersion.current + " now, or later.\n\n";
    }else{
        text = "#A newer OneShip is available!\nYou must update to version " + serverVersion.current + " now.\n\n";
    }
    text += "To upgrade now, visit [this link](" + CONFIG.serverURL + "internal/PalyOneShip.apk) on your Android device.\n\n";
    return text;
};

const VersionCheck = ({ navigation }) => {
    const [serverVersion, setServerVersion] = useState(null);

    useEffect(() => {
        const getServerVersion = async () => {
            const response = await fetch(CONFIG.serverURL + 'version');
            const json = await response.json();
            console.log("JSON " + JSON.stringify(json));
            setServerVersion(json);
        };
        if(serverVersion == null) getServerVersion();
        else{
            if(semverToInt(CONFIG.VERSION) < semverToInt(serverVersion.current)){
                navigation.navigate(
                    'Modal',{
                        title: "Update Available",
                        body: getInfoText(serverVersion),
                        isMarkdown: true,
                        image: "oneship",
                        id: "update",
                        shareable: false,
                        closeable: semverToInt(CONFIG.VERSION) > semverToInt(serverVersion.min)
                    }
                );
            }
        }
    }, [serverVersion]);
};

export default VersionCheck;