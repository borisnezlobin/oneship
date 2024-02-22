import { ArrowRight, Sparkle } from "@phosphor-icons/react";
import FeedItemTypeBadge from "./FeedItemTypeBadge";
import { useNavigate } from "react-router-dom";

const FeedItem = ({ item }) => {
  const nav = useNavigate();

  return (
    <div
      className={
        "w-9/10 h-128 mb-2 rounded-lg border-2 p-4 " +
        (item.featured ? "border-theme" : "border-transparent")
      }
    >
      <div className="flex flex-row items-center justify-start gap-2">
        {item.featured && (
          <>
            <Sparkle size={24} weight="fill" color="var(--green)" />
            <p className="text-theme text-lg font-bold">FEATURED</p>
          </>
        )}
      </div>
      <div className="flex flex-col items-start justify-center">
        <p className="mediumText flex flex-row items-center justify-start gap-4 text-left">
          <span>{item.title}</span>
          <FeedItemTypeBadge type={item.postType} />
        </p>
        <p className="w-full text-left text-lg font-bold text-gray-900">
          {item.description}
        </p>
        <hr />
        <p className="w-full text-lg text-gray-500">from {item.sender}</p>
        <button
          className="hover:bg-lightgrey flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded py-2 transition-all hover:scale-x-105 md:w-auto md:justify-start md:px-4"
          onClick={() => {
            nav("/post/" + item.id, {
              state: {
                item: item,
              },
            });
          }}
        >
          <div className="text-theme text-lg font-bold">READ MORE</div>
          <ArrowRight size={24} color="var(--green)" />
        </button>
      </div>
    </div>
  );
};

export default FeedItem;
