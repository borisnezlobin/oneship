import fetch from "node-fetch"
import { parse } from "node-html-parser";

// Verde, C, Viking, and Voice use the same website template
const getPublication = async (url) => {
    const response = await fetch(url)
    const txt = await response.text();
    const root = parse(txt, {blockTextElements: { script: true, style: true }});
    const parts = root.querySelectorAll(".profile-rendered.catlist-panel.catlist_sidebar");
    var articles = [];
    parts.forEach(e => {
        var title = e.querySelector("h2").querySelector("a");
        var articleLink = title.getAttribute("href");
        title = title.text.trim();

        /* 
            Verde has an article named "Staff" and I don't want it to show up
            because authors are credited and also like
            when have you ever checked the staff at Verde
        */
        if(title == "Staff") return;
        var image = "https://img.freepik.com/free-vector/404-error-with-landscape-concept-illustration_114360-7898.jpg";
        try{
            image = e.querySelector("img").getAttribute("src");
        }catch(e){} // cope
        var authors = [];
        var authorsElements = e.querySelectorAll(".creditline");
        authorsElements.forEach(e => {
            authors.push({
                authorName: e.text,
                authorLink: e.getAttribute("href")
            })
        })
        var datePublished = e.querySelector(".time-wrapper").text;
        var teaser = e.querySelector(".catlist-teaser").text.trim();
        var deck = teaser;
        try{
            // some publications have this, some don't
            deck = e.querySelector(".catlist-deck").text;
        }catch(e){} // top 10 things to push to prod
        
        articles.push({
            title: title,
            authors: authors,
            image: image,
            link: articleLink,
            published: datePublished,
            description: deck,
            teaser: teaser,
            isVideo: false
        })
    });

    return articles;
}

// infocus is a bit different because it has video embeds instead of images
const getInfocusNews = async () => {
    const response = await fetch("https://infocusnews.tv/?s=")
    const txt = await response.text();
    const root = parse(txt, {blockTextElements: { script: true, style: true }});
    const parts = root.querySelectorAll(".profile-rendered.catlist-panel.catlist_sidebar");
    var articles = [];
    parts.forEach(e => {
        var title = e.querySelector("h2").querySelector("a");
        var articleLink = title.getAttribute("href");
        title = title.text.trim();

        // clean code is for the weak
        // ^ copilot wrote that
        var authors =  e.querySelectorAll(".creditline");
        var authorList = []
        if(authors){
            authors.forEach(e => {
                authorList.push({
                    authorName: e.text,
                    authorLink: e.getAttribute("href")
                });
            });
        }
        var datePublished = e.querySelector(".time-wrapper").text.trim();
        /* likely to be empty for video posts, bulletins have teasers */
        var teaser = e.querySelector(".catlist-teaser").text.trim();
        var deck = teaser;

        var embedURL = e.querySelector(".newembedcontainer")
        if(embedURL) embedURL = embedURL.querySelector("iframe").getAttribute("src");

        articles.push({
            title: title,
            authors: authorList,
            image: null, // handled specially in frontend, infocus has no images
            link: articleLink,
            published: datePublished,
            description: deck,
            teaser: teaser,
            embedURL: embedURL,
            isVideo: embedURL != null
        });
    });

    return articles;
}

export {
    getPublication,
    getInfocusNews
}