import { auth } from "@clerk/nextjs/server";

export const currentUser = async () => {
  // Check if the user is authenticated
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
};
