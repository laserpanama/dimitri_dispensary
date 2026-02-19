import { eq, and, or } from "drizzle-orm";
import {
  chatAgents,
  chatConversations,
  chatMessages,
  InsertChatMessage,
  InsertChatConversation,
} from "../drizzle/schema";
import { getDb } from "./db";

export async function getOrCreateConversation(userId: number, subject?: string) {
  const db = await getDb();
  if (!db) return null;

  // Check for existing active conversation
  const existing = await db
    .select()
    .from(chatConversations)
    .where(
      and(
        eq(chatConversations.userId, userId),
        or(
          eq(chatConversations.status, "active"),
          eq(chatConversations.status, "waiting")
        )
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new conversation
  const result = await db.insert(chatConversations).values({
    userId,
    status: "waiting",
    subject,
  });

  const insertId = (result as any)[0]?.insertId || (result as any).insertId;

  return {
    id: insertId,
    userId,
    agentId: null,
    status: "waiting",
    subject,
    startedAt: new Date(),
    closedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.conversationId, conversationId));
}

export async function addChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(chatMessages).values(message);
  return (result as any)[0]?.insertId || (result as any).insertId;
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(chatConversations)
    .where(eq(chatConversations.userId, userId));
}

export async function getActiveConversations() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(chatConversations)
    .where(
      or(
        eq(chatConversations.status, "waiting"),
        eq(chatConversations.status, "active")
      )
    );
}

export async function assignConversationToAgent(conversationId: number, agentId: number) {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(chatConversations)
    .set({
      agentId,
      status: "active",
      updatedAt: new Date(),
    })
    .where(eq(chatConversations.id, conversationId));

  return true;
}

export async function closeConversation(conversationId: number) {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(chatConversations)
    .set({
      status: "closed",
      closedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(chatConversations.id, conversationId));

  return true;
}

export async function getOnlineAgents() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(chatAgents)
    .where(
      and(
        eq(chatAgents.isActive, true),
        eq(chatAgents.status, "online")
      )
    );
}

export async function updateAgentStatus(userId: number, status: "online" | "offline" | "away") {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(chatAgents)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(chatAgents.userId, userId));

  return true;
}

export async function markMessagesAsRead(conversationId: number) {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(chatMessages)
    .set({ isRead: true })
    .where(eq(chatMessages.conversationId, conversationId));

  return true;
}
