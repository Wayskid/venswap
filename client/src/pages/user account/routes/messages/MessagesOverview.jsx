import React from "react";

export default function MessagesOverview() {
  return (
    <div className="m-auto grid place-items-center">
      <img
        src="https://res.cloudinary.com/diiohnshc/image/upload/v1714749071/Venswap/assets/instant-message_xeljtg.png"
        alt="instant messaging icons"
        className="w-32"
      />
      <div className=" text-center">
        <p className="font-medium">Pick up where you left off</p>
        <p className="">Select a conversation and chat away.</p>
      </div>
    </div>
  );
}
