import * as React from 'react';
import { Text, View, SafeAreaView, Dimensions, Image, TouchableOpacity } from 'react-native';
import getColors from '../util/COLORS';
import Loading from '../util/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Bar from '../components/Bar';
import { PublicationsContext, UserSettingsContext } from '../util/contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


function Publications({ navigation }) {
    const {publications, setPublications} = React.useContext(PublicationsContext)
  const { userSettingsContext } = React.useContext(UserSettingsContext);
  const COLORS = getColors();
  const insets = useSafeAreaInsets();
  

  React.useEffect(() => {
    const doShit = async () => {
      const getDataFromStorage = async () => {
        const data = await AsyncStorage.getItem("publications");
        return JSON.parse(data);
      }
      const getDataFromServer = async () => {
        const res = await fetch("https://paly-vikings.onrender.com/publications/all");
        const data = await res.json();
        return data;
      }
      if(publications == null){
        var maybeData = await getDataFromStorage();
        if(maybeData != null){
          setPublications(maybeData);
          return;
        }
        const data = await getDataFromServer();
        AsyncStorage.setItem("publications", JSON.stringify(data));
        setPublications(data); // surely it won't be null
      }
    }

    doShit(); // swering bad
  }, [publications, userSettingsContext]);

  if(publications == null){
    return <Loading />
  }
  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: COLORS.FOREGROUND_COLOR,
          height: Dimensions.get("window").height
        }}
      >
        <View style={{
            height: Dimensions.get("window").height - insets.top - insets.bottom,
            width: "100%",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center"
        }}>
            {publications.map((e, i) => {
                return (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Publications_Publication", { data: e })}
                        key={i}
                        style={{
                            flex: 1,
                            marginTop: 8,
                            marginHorizontal: 8,
                            position: "relative",
                            display: "flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: COLORS.LIGHT + "99",
                            borderRadius: 32,
                        }}
                    >
                      <Image
                        source={{ uri: logos[e.title + (COLORS.isLightMode ? "" : " Dark")] }}
                        style={{
                            position: "absolute",
                            width: "75%",
                            height: "50%",
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                )
            })}
        </View>
      </SafeAreaView>
      <Bar navigation={navigation} />
    </>
  );
}

const remoteUrl = "https://paly-vikings.onrender.com/assets/external/";

const logos = {
    "C Magazine": (remoteUrl + "c_magazine_logo.png"),
    "C Magazine Dark": (remoteUrl + "c_magazine_logo_dark.png"),
    "Viking Magazine": (remoteUrl + "viking_logo.png"),
    "Viking Magazine Dark": (remoteUrl + "viking_logo.png"),
    "Verde": (remoteUrl + "verde_logo.png"),
    "Verde Dark": (remoteUrl + "verde_logo_dark.png"),
    "Paly Voice": (remoteUrl + "paly_voice_logo.png"),
    "Paly Voice Dark": (remoteUrl + "paly_voice_logo.png"),
}

export default Publications