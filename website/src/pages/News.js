import { useContext } from "react";
import { DataContext } from "../util/contexts";
import NewsItem from "../components/NewsItem";
import LoadingSpinner from "../components/LoadingSpinner";
import news from "../illustrations/news.svg";

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
            <div className="flex flex-col items-center justify-center pt-4">
                <img src={news} alt="News" className="w-1/2 md:w-1/4" />
                <h1 className="bigText">Paly News</h1>
            </div>
            <hr />
            <p className="m-4 text-center">
                Content on this page is not created or moderated by OneShip.<br />
                Don't see your favorite publication? <a className="link" href="mailto:bn51245@pausd.us">Contact us</a> and we'll add it!
            </p>
            {articles.map((e, i) => {
                return <NewsItem key={"newsItem" + i} item={e} />
            })}
        </div>
    );
};

export default NewsPage;