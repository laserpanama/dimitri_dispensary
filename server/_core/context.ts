import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  // Dev auto-admin: if no authenticated user and OAUTH is not configured,
  // check for ?admin=true query param or x-dev-admin header
  if (!user && !process.env.OAUTH_SERVER_URL) {
    const isDevAdmin = opts.req.query.admin === "true" || opts.req.headers["x-dev-admin"] === "1";
    if (isDevAdmin) {
      const devOpenId = "dev-admin";
      await db.upsertUser({
        openId: devOpenId,
        name: "Dev Admin",
        email: "dev-admin@local",
        loginMethod: "dev",
        lastSignedIn: new Date(),
        role: "admin",
      });
      user = await db.getUserByOpenId(devOpenId);
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
