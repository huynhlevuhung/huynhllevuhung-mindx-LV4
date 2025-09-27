import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import TransactionChart from "./TransactionChart";
import UserTable from "./UserTable";
import { Users, CreditCard, DollarSign } from "lucide-react";
import api from "@/utils/api"; // axios instance

const DashboardLayout = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await api.get("/users/count-non-admins");
        setUserCount(res.data.count); // BE trả { count: ... }
      } catch (error) {
        console.error("Lỗi lấy số lượng user:", error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Users"
          value={userCount}
          color="bg-blue-500"
          icon={Users}
        />
        <StatCard
          title="Transactions"
          value="3,567"
          color="bg-green-500"
          icon={CreditCard}
        />
        <StatCard
          title="Revenue"
          value="$12,345"
          color="bg-orange-500"
          icon={DollarSign}
        />
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionChart />
        <UserTable />
      </div>
    </div>
  );
};

export default DashboardLayout;
