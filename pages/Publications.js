import * as React from 'react';
import { Text, View, SafeAreaView, Dimensions, Image, TouchableOpacity } from 'react-native';
import getColors from '../util/COLORS';
import Loading from '../util/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Bar from '../components/Bar';
import { PublicationsContext, UserSettingsContext } from '../util/contexts';
import { LinearGradient } from 'expo-linear-gradient';
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
      <SafeAreaView style={{backgroundColor: COLORS.FOREGROUND_COLOR, height: "100%"}}>
        <Text style={{
            height: 96,
            width: "100%",
            lineHeight: 48,
            textAlign: 'center',
            color: COLORS.GREEN,
            fontWeight: 'bold',
            fontSize: 48,
        }}>
            Your campus. Your news.
        </Text>
        <View style={{
            height: Dimensions.get("window").height - insets.top - insets.bottom - 96,
            width: "100%",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center"
        }}>
            {publications.map((e, i) => {
                console.log(logos[e.title]);
                return (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Publication", { data: e })}
                        key={i}
                        style={{
                            flex: 1 / publications.length,
                            position: "relative",
                            display: "flex",
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <LinearGradient
                            colors={["transparent", COLORS.ALPHA_GREEN]}
                            style={{
                                width: "100%",
                                height: "100%",
                                position: 'absolute',
                                zIndex: 1000,
                            }}
                            start={{x: 0, y: 0.5}}
                            end={{x: 1, y: 2}}
                            locations={[0.1, 1]}
                        />
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 24,
                            color: COLORS.GREEN
                        }}>
                            {e.title}
                        </Text>
                        {
                            /* <Image
                            source={{uri: logos[e.title]}}
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                            resizeMode="stretch"
                        />*/
                        }
                    </TouchableOpacity>
                )
            })}
        </View>
      </SafeAreaView>
      <Bar navigation={navigation} />
    </>
  );
}

const logos = {
    "C Magazine": "https://cmagazine.org/wp-content/uploads/2022/03/C-Magazine.jpg",
    "Viking Magazine": "https://vikingsportsmag.com/wp-content/uploads/2018/08/viking-logo-1.jpeg",
    "Verde": "https://verdemagazine.com/wp-content/uploads/2015/09/logo2-2-scaled.jpg",
    "Paly Voice": "https://palyvoice.com/wp-content/uploads/2023/02/voicebanner-1.png",
}


export default Publications