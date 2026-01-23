import TransactionCards from "@/components/transactions/TransactionCards";
import TransactionTable from "@/components/transactions/TransactionTable";
import Layout from "@/layout/Layout";
import React from "react";

const index = () => {
  return (
    <Layout title="Dashboard ">
      <TransactionCards />

      <TransactionTable />
    </Layout>
  );
};

export default index;
