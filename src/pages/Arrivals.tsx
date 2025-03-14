import Layout from "@/components/mycomponents/wrappers/Layout";
import { Button } from "@/components/ui/button";
import React from "react";

const Arrivals = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-4 p-2 sm:p-4 w-full h-full max-w-[2000px] mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-2xl font-bold">Arrivals</h1>
            <p className="text-sm sm:text-base text-gray-500">Manage your arrivals here</p>
          </div>

          <Button>New Arrival</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Arrivals;
