import { ArrowRight, Sparkle } from "phosphor-react";
import FeedItemTypeBadge from "./FeedItemTypeBadge";
import { useNavigate } from "react-router-dom";

const FeedItem = ({ item }) => {
    const nav = useNavigate();

    return (
        <div className={"w-9/10 h-128 border-2 p-4 mb-2 rounded-lg " + (item.featured ? "border-theme" : "border-transparent")}>
            <div className="flex flex-row justify-start items-center gap-2">
            {item.featured && (
                <>
                    <Sparkle size={24} weight="fill" color="var(--green)" />
                    <p className="text-theme font-bold text-lg">
                        FEATURED
                    </p>
                </>
            )}
            </div>
            <div className="flex flex-col justify-center items-start">
                <p className="mediumText text-left flex flex-row justify-start items-center gap-4">
                    <span>{item.title}</span>
                    <FeedItemTypeBadge type={item.postType} />
                </p>
                <p className="text-gray-900 font-bold w-full text-left text-lg">
                    {item.description}
                </p>
                <hr />
                <p className="text-gray-500 w-full text-lg">
                    from {item.sender}
                </p>
                <button className="w-full cursor-pointer md:w-auto gap-2 md:px-4 hover:bg-lightgrey hover:scale-x-105 transition-all rounded flex flex-row justify-center items-center md:justify-start py-2" onClick={() => {
                    nav("/post/" + item.id, {
                        state: {
                            item: item,
                        },
                    });
                }}>
                    <div className="text-theme text-lg font-bold">
                        READ MORE
                    </div>
                    <ArrowRight size={24} color="var(--green)" />
                </button>
            </div>
        </div>
    );
};

export default FeedItem;