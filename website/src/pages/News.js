import { useContext } from "react";
import { DataContext } from "../util/contexts";
import NewsItem from "../components/NewsItem";
import LoadingSpinner from "../components/LoadingSpinner";

const NewsPage = () => {
    const { data } = useContext(DataContext);

    if(data == null || data.news === undefined) return (
        <div className="m-0 md:ml-64 flex justify-center items-center h-full">
            <LoadingSpinner />
        </div>
    );

    var articles = [];
    for(var i = 0; i < data.news.length; i++) {
        var currentPublication = data.news[i].title;
        for(var j = 0; j < data.news[i].articles.length; j++) {
            articles.push({
                ...data.news[i].articles[j],
                publication: currentPublication,
            });
        }
    }

    articles.sort((a, b) => {
        // sort by date, in the format "May 23, 2023"
        var aDate = new Date(a.published.trim());
        var bDate = new Date(b.published.trim());
        return bDate - aDate;
    })


    return (
        <div className="m-0 md:ml-64">
            <h1>{articles.map((e, i) => {
                return <NewsItem key={"newsItem" + i} item={e} />
            })}</h1>
        </div>
    );
};

export default NewsPage;