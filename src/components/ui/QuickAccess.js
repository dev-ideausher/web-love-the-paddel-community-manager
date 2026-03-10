import React from "react";
import { toCamelCaseDisplay } from "@/Utilities/helpers";

const QuickAccess = ({ stats }) => {
  const cardList = [
    {
      title: "manageCommunities",
      displayTitle: toCamelCaseDisplay("manageCommunities"),
      subTitle: "subCommunities",
      displaySubTitle: toCamelCaseDisplay("subCommunities"),
      count: stats?.subCommunities || 0,
      icon: "/icons/manageCommunities.svg",
    },
    {
      title: "viewMatches",
      displayTitle: toCamelCaseDisplay("viewMatches"),
      count: stats?.matches || 0,
      subTitle: "matches",
      displaySubTitle: toCamelCaseDisplay("matches"),
      icon: "/icons/viewMatches.svg",
    },
    {
      title: "publishUpdates",
      displayTitle: toCamelCaseDisplay("publishUpdates"),
      icon: "/icons/publishUpdates.svg",
      count: stats?.announcements || 0,
      subTitle: "announcements",
      displaySubTitle: toCamelCaseDisplay("announcements"),
    },
    {
      title: "viewPaymentHistory",
      displayTitle: toCamelCaseDisplay("viewPaymentHistory"),
      count: stats?.transactions || 0,
      icon: "/icons/paymentHistory.svg",
      subTitle: "transactions",
      displaySubTitle: toCamelCaseDisplay("transactions"),
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
                <p className="text-sm text-gray-600">{card.displaySubTitle}</p>
                <h1 className="text-lg font-semibold pb-[20px]">
                  {card.displayTitle}
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
