import { PrismaClient, User } from "@prisma/client";
import { YogaInitialContext } from "graphql-yoga";
import { authenticateUser } from "./auth/auth";

const prisma = new PrismaClient();

export type GraphQLContext = {
  prisma: PrismaClient;
  currentUser: null | User;
};

export async function createContext(
  initialContext: YogaInitialContext
): Promise<GraphQLContext> {
  const currentUser = await authenticateUser(prisma, initialContext.request);
  console.log("currentUser1", currentUser);

  return {
    prisma,
    currentUser,
  };
}
