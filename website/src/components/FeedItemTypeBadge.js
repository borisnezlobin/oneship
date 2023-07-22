import { MegaphoneSimple } from "phosphor-react";

const FeedItemTypeBadge = ({ type, extended = false }) => {
    if(type === "oneship"){
        return (
            <>
                <div className="bg-theme rounded-full px-2 py-1 text-white text-sm">
                    OneShip
                </div>
                {extended ? <p className="text-black text-sm">
                    A message from the OneShip Team.</p> : <></>}
            </>
        );
    }

    if(type === "announcement"){
        return (
            <>
                <div className="bg-red-500 rounded-full px-2 py-1  text-sm">
                    <MegaphoneSimple size={24} weight="fill" color="white" />
                </div>
                {extended ? <p className="text-black text-sm">
                    An official announcement from the OneShip Team.</p> : <></>}
            </>
        );
    }

    if(type === "asb"){
        return (
            <>
                <div className="bg-cyan-600 rounded-full px-2 py-1 text-white text-sm">
                    ASB
                </div>
                {extended ? <p className="text-black text-sm">
                    An official message from the ASB.</p> : <></>}
            </>
        );
    }

    if(type === "event"){
        return (
            <>
                <div className="bg-yellow-500 rounded-full px-2 py-1 text-white text-sm">
                    Event
                </div>
                {extended ? <p className="text-black text-sm">
                    A verified event.</p> : <></>}
            </>
        );
    }

    if(type === "ad"){
        return (
            <>
                <div className="bg-green-500 rounded-full px-2 py-1 text-white text-sm">
                    Ad
                </div>
                {extended ? <p className="text-black text-sm">
                    An advertisement, checked by the OneShip Team.</p> : <></>}
            </>
        );
    }
};

export default FeedItemTypeBadge;