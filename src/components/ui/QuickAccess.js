import React from "react";

const QuickAccess = ({ stats }) => {
  const cardList = [
    {
      title: "Manage Communities",
      subTitle: " Sub communities",
      count: stats.communities,
      icon: "/icons/manageCommunities.svg",
    },
    {
      title: "View Matches",
      count: stats.matches,
      subTitle: " Matches",
      icon: "/icons/viewMatches.svg",
    },
    {
      title: "Publish Updates",
      icon: "/icons/publishUpdates.svg",
      count: stats.updates,

      subTitle: " Sub communities",
    },
    {
      title: "View Payment History",
      count: stats.payments,
      icon: "/icons/paymentHistory.svg",

      subTitle: " Sub communities",
    },
  ];
  return (
    <>
      <div className="p-6 mt-10 rounded-3xl">
        <h2 className="mb-4 text-xl font-normal font-helvetica">
          Quick Access
        </h2>
        <div className="flex flex-row justify-between gap-4 ">
          {cardList.map((card, index) => (
            <div
              key={index}
              className=" bg-white flex flex-col rounded-3xl justify-center items-start gap-5 flex-[1_0_0] px-4 py-7   "
            >
              <img
                src={card.icon}
                alt={card.title}
                className="w-12 h-12 mr-4"
              />
              <div>
                <p className="text-sm text-gray-600">{card.subTitle}</p>
                <h1 className="text-lg font-semibold pb-[20px]">
                  {card.title}
                </h1>

                <h3 className="text-sm font-normal">{card.count} items</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuickAccess;
