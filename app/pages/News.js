import { SafeAreaView, ScrollView, Text, View, Image } from "react-native";
import tailwind from "tailwind-rn";
import { CONFIG } from "../util/config";
import { useContext } from "react";
import { NewsContext } from "../util/contexts";
import NewsFeedItem from "../components/NewsFeedItem";
import newsImg from "../assets/illustrations/news.png";

const NewsPage = () => {
    const { news } = useContext(NewsContext);
    if(news == null) return (
        <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
            <Text style={[tailwind("font-bold"), { color: CONFIG.green}]}>
                Loading...
            </Text>
        </SafeAreaView>
    );

    var feed = [];
    for(var i = 0; i < news.length; i++){
        var currentArticle = news[i].title;
        for(var j = 0; j < news[i].articles.length; j++){
            feed.push({
                ...news[i].articles[j],
                source: currentArticle
            })
        }
    }
    feed = feed.sort((a, b) => {
        // what I won't have
        var aDate = parseDate(a.published.trim());

        var bDate = parseDate(b.published.trim());
        return bDate - aDate;
    });

    return (
        <SafeAreaView style={tailwind("bg-white w-full h-full flex justify-center items-center")}>
            <ScrollView style={tailwind("w-full h-full")}>
                <Image
                    style={{
                        width: "100%",
                        height: 196,
                    }}
                    resizeMode="contain"
                    source={newsImg}
                />
                <Text style={[
                    tailwind("text-2xl font-bold text-center"),
                    {
                        color: CONFIG.green,
                    }
                ]}>
                    What's happening?
                </Text>
                <View style={{
                    height: 1,
                    width: "95%",
                    alignSelf: "center",
                    backgroundColor: CONFIG.grey,
                    marginVertical: 16,
                }} />
                {feed.map((article, index) => {
                    return (
                        <NewsFeedItem key={index} item={article} />
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const months = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
]

const parseDate = (date) => {
    // in the format "January 1, 2022"
    var dateSplit = date.split(" ");
    var month = months.indexOf(dateSplit[0]);
    var day = parseInt(dateSplit[1].replace(",", ""));
    var year = parseInt(dateSplit[2]);
    return new Date(year, month, day);
}

export default NewsPage;