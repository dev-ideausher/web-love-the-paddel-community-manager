import React, { useEffect, useState } from "react";
import Button from "../Button";
import { useRouter } from "next/router";

const PromoCard = ({ summary }) => {
  const router = useRouter();
  const metricsData = [
    {
      title: "Total Sub-Communities",
      value: summary?.totalSubCommunities || 0,
      image: "/icons/community.svg",
    },
    {
      title: "Active Matches",
      value: summary?.activeMatches || 0,
      image: "/icons/activematches.svg",
    },
    {
      title: "Total Transactions",
      value: summary?.totalTransactions || 0,
      image: "/icons/totaltransactions.svg",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 my-10">
        {metricsData.map((metric, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between"
          >
            <div className="flex items-center  gap-3">
              <div className=" rounded-2xl p-1">
                <img src={metric.image} alt="" />
              </div>
              <div>
                <h3 className="text-base font-normal text-neutral1">
                  {metric.title}
                </h3>
                <h2 className="text-2xl text-[#374355] font-medium pt-1">
                  {metric.value}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PromoCard;
