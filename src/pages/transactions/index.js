import TransactionCards from "@/components/transactions/TransactionCards";
import TransactionTable from "@/components/transactions/TransactionTable";
import Layout from "@/layout/Layout";
import React, { useState } from "react";

const Transactions = () => {
  const [summary, setSummary] = useState(null);

  return (
    <Layout title="Dashboard">
      <TransactionCards summary={summary} />
      <TransactionTable onSummaryUpdate={setSummary} />
    </Layout>
  );
};

export default Transactions;
