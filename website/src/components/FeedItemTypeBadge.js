import { MegaphoneSimple } from "phosphor-react";

const FeedItemTypeBadge = ({ type }) => {
    if(type == "oneship"){
        return (
            <div className="bg-theme rounded-full px-2 py-1 text-white">
                OneShip
            </div>
        );
    }

    if(type == "announcement"){
        return (
            <div className="bg-red-500 rounded-full px-2 py-1">
                <MegaphoneSimple size={24} weight="fill" color="white" />
            </div>
        );
    }

    if(type == "asb"){
        return (
            <div className="bg-cyan-600 rounded-full px-2 py-1 text-white">
                ASB
            </div>
        );
    }

    if(type == "event"){
        return (
            <div className="bg-yellow-500 rounded-full px-2 py-1 text-white">
                Event
            </div>
        );
    }

    if(type == "ad"){
        return (
            <div className="bg-green-500 rounded-full px-2 py-1 text-white">
                Ad
            </div>
        );
    }
};

export default FeedItemTypeBadge;