import { Link, Sparkle } from "phosphor-react";
import FeedItemTypeBadge from "../components/FeedItemTypeBadge";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";
import CONFIG, { ERROR_TOAST_STYLES } from "../util/config";
import { toast } from "react-hot-toast";
import logo from "../logo.svg";

const PostDetails = () => {
    const location = useLocation();
    const nav = useNavigate();
    const [item, setItem] = useState(null);

    useEffect(() => {
        if(item) return;
        // get item from navigation state
        if(location.state){
            const state = location.state.item;
            if(state && !item){
                setItem(state);
                return;
            }
        }

        // if null, send request to server to get item
        fetch(CONFIG.SERVER_URL + "/api/post/" + location.pathname.split("/")[2]).then(
            async (res) => {
                if(res.status !== 200) return toast.error("Error loading this post.", ERROR_TOAST_STYLES);
                const data = await res.json();
                setItem(data);
            }
        )
    }, [item, location.pathname, location.state]);

    if(!item) return (
        <div className="m-0 md:ml-64 px-4 flex justify-center items-center h-full">
            <LoadingSpinner />
        </div>
    );


    return (
        <div className={"m-0 md:ml-64 h-full p-6"}>
            <div className="flex flex-row justify-start items-center gap-2">
                {item.featured && (
                    <>
                        <Sparkle size={24} weight="fill" color="var(--green)" />
                        <p className="text-theme font-bold text-lg">
                            FEATURED
                        </p>
                        <p>
                            on {new Date().toLocaleDateString()}
                        </p>
                    </>
                )}
            </div>
            <p className="bigText text-left flex flex-row gap-4 justify-start items-center">
                <span>
                    {item.title}
                </span>
                <FeedItemTypeBadge type={item.postType} extended={window.innerWidth > 768} />
            </p>
            <p className="text-gray-900 font-bold w-full text-left text-lg">
                {item.sender}
            </p>
            <hr className="my-3" />
            <img src={logo} alt="logo" className="w-48 mx-auto" />
            {parseMarkdown(item.content)}
            <div className="mt-8 w-full flex flex-row justify-center items-center">
                <button className="btn" onClick={() => nav(-1)}>
                    <p>Back</p>
                </button>
            </div>
            <p className="w-full text-center text mt-4 mb-2">
                Want to submit your own message?&nbsp;
                <a
                    className="link"
                    href="mailto:boris.nezlobin@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        fontSize: "1rem"
                    }}
                >
                    Email us
                </a>
                .
            </p>
        </div>
    );
};


const parseMarkdown = (text) => {
    // rules of psuedo markdown:
    // #header
    // ##subheader
    // \n newline

    var lines = [];
    if(typeof text != "string"){
        text = text.toString();
    }
    lines = text.replaceAll("\\n", "\n").replaceAll("\\,", ",").split("\n");
    var parsed = [];
    for(var i = 0; i < lines.length; i++){
        var line = lines[i];
        if(line === "|"){
            parsed.push({
                type: "newline",
            });
            continue;
        }
        if(line.startsWith("#")){
            var headerLevel = 0;
            while(line.startsWith("#")){
                headerLevel++;
                line = line.substring(1);
            }
            parsed.push({
                type: "header",
                level: headerLevel,
                text: line,
            });
        }else{
            var j = 0;
            var lastLink = 0;
            for(; j < line.length; j++){
                if(line[j] === "["){
                    var link = "";
                    var text = "";
                    var k = j + 1;
                    while(line[k] !== "]"){
                        text += line[k];
                        k++;
                    }
                    k += 2;
                    while(line[k] !== ")"){
                        link += line[k];
                        k++;
                    }
                    parsed.push({
                        type: "text",
                        text: line.substring(lastLink, j),
                    });
                    parsed.push({
                        type: "link",
                        text: text,
                        link: link,
                    });
                    j = k;
                    lastLink = k + 1;
                    continue;
                }
            }
            parsed.push({
                type: "text",
                text: line.substring(lastLink)
            });
        }
    }

    return parsed.map((line, index) => {
        if(line.type === "header"){
            return (
                <div key={index}>
                    <p className={"mt-4 text-theme text-" + (line.level === 1 ? "2" : "") + "xl"}>
                        {line.text}
                    </p>
                    {line.level === 1 ? (
                        <hr />
                    ) : null}
                </div>
            );
        }else if(line.type === "text"){
            return (
                <p key={"text" + index} className="text-lg text-black">
                    {line.text}
                </p>
            );
        }else if(line.type === "newline"){
            return (
                <div key={"newline" + index} className="h-4"/>
            );
        }else if(line.type === "link"){
            return (
                <div className="w-full md:w-fit p-2 px-4 rounded-lg flex flex-row justify-start gap-4 items-center cursor-pointer bg-lightgrey" onClick={() => window.open(line.link)}>
                    <Link color="var(--green)" size={24} />
                    <div>
                        <a key={"link" + index} href={line.link} target="_blank" rel="noreferrer" className="link">
                            {line.text}
                        </a>
                        <p>
                            {line.link}
                        </p>
                    </div>
                </div>
            );
        }
        return <></>;
    });
};

export default PostDetails;