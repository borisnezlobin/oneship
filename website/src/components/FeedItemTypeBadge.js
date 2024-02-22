import { MegaphoneSimple } from "@phosphor-icons/react";

const FeedItemTypeBadge = ({ type, extended = false }) => {
  if (type === "oneship") {
    return (
      <>
        <div className="bg-theme rounded-full px-2 py-1 text-sm text-white">
          OneShip
        </div>
        {extended ? (
          <p className="text-sm text-black">A message from the OneShip Team.</p>
        ) : (
          <></>
        )}
      </>
    );
  }

  if (type === "announcement") {
    return (
      <>
        <div className="rounded-full bg-red-500 px-2 py-1  text-sm">
          <MegaphoneSimple size={24} weight="fill" color="white" />
        </div>
        {extended ? (
          <p className="text-sm text-black">
            An official announcement from the OneShip Team.
          </p>
        ) : (
          <></>
        )}
      </>
    );
  }

  if (type === "asb") {
    return (
      <>
        <div className="rounded-full bg-cyan-600 px-2 py-1 text-sm text-white">
          ASB
        </div>
        {extended ? (
          <p className="text-sm text-black">
            An official message from the ASB.
          </p>
        ) : (
          <></>
        )}
      </>
    );
  }

  if (type === "event") {
    return (
      <>
        <div className="rounded-full bg-yellow-500 px-2 py-1 text-sm text-white">
          Event
        </div>
        {extended ? (
          <p className="text-sm text-black">A verified event.</p>
        ) : (
          <></>
        )}
      </>
    );
  }

  if (type === "ad") {
    return (
      <>
        <div className="rounded-full bg-green-500 px-2 py-1 text-sm text-white">
          Ad
        </div>
        {extended ? (
          <p className="text-sm text-black">
            An advertisement, checked by the OneShip Team.
          </p>
        ) : (
          <></>
        )}
      </>
    );
  }
};

export default FeedItemTypeBadge;
