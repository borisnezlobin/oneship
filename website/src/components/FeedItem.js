import { Sparkle } from "phosphor-react";
import FeedItemTypeBadge from "./FeedItemTypeBadge";

const FeedItem = ({ item }) => {
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
            <FeedItemTypeBadge type={item.postType} />
            </div>
            <div className="flex flex-col justify-center items-start">
                <p className="mediumText text-left">
                    {item.title}
                </p>
                <p className="text-gray-900 font-bold w-full text-left text-lg">
                    {item.sender}
                </p>
                <hr />
                <p className="text-gray-500 w-full text-lg">
                    {item.description}
                </p>
            </div>
        </div>
    );
};

export default FeedItem;