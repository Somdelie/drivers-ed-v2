import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
  const user = await currentUser();

  // Check if user is authenticated
  if (!user) {
    redirect("/signin");
  }

  return (
    <div>
      <UserButton />
    </div>
  );
};

export default DashboardPage;
