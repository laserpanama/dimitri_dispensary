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
  // check for x-dev-admin header or dev-admin cookie
  if (!user && !process.env.OAUTH_SERVER_URL) {
    const cookies = opts.req.headers.cookie?.split(';').reduce((acc, c) => {
      const [k, v] = c.trim().split('=');
      acc[k] = v;
      return acc;
    }, {} as Record<string, string>) || {};
    const isDevAdmin = opts.req.headers["x-dev-admin"] === "1" || cookies["dev-admin"] === "1";
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
