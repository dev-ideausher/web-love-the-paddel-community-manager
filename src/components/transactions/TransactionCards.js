import React from "react";

const TransactionCards = ({ stats }) => {
  const cardList = [
    {
      title: "Total Revenue",
      subTitle: " Sub communities",
      count: "$70",
      icon: "/icons/totalRevenue.svg",
    },
    {
      title: "Failed",
      count: "15",
      subTitle: " Matches",
      icon: "/icons/failed.svg",
    },
    {
      title: "Pending",
      icon: "/icons/pending.svg",
      count: " 23",

      subTitle: " Sub communities",
    },
    {
      title: "Completed",
      count: stats?.payments,
      icon: "/icons/completed.svg",
      count: " 23",

      subTitle: " Sub communities",
    },
  ];
  return (
    <>
      <div className="mt-4 rounded-3xl">
        <div className="flex flex-row justify-between ">
          {cardList.map((card, index) => (
            <div
              key={index}
              className="flex flex-row items-start gap-5 p-4 bg-white min-w-52 rounded-3xl "
            >
              <img
                src={card.icon}
                alt={card.title}
                className="w-16 h-16 p-2 bg-gray-100 rounded-2xl"
              />
              <div>
                <h1 className="text-sm font-light ">{card.title}</h1>

                <h3 className="text-2xl font-semibold">{card.count} </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TransactionCards;
