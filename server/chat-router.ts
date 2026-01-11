import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getOrCreateConversation,
  getConversationMessages,
  addChatMessage,
  getUserConversations,
  getActiveConversations,
  assignConversationToAgent,
  closeConversation,
  getOnlineAgents,
  updateAgentStatus,
  markMessagesAsRead,
} from "./chat-db";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";

export const chatRouter = router({
  // Start or get active conversation
  startConversation: protectedProcedure
    .input(z.object({ subject: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const conversation = await getOrCreateConversation(ctx.user.id, input.subject);
      if (!conversation) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return conversation;
    }),

  // Get conversation messages
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input, ctx }) => {
      const messages = await getConversationMessages(input.conversationId);
      return messages;
    }),

  // Send message
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const messageId = await addChatMessage({
        conversationId: input.conversationId,
        senderId: ctx.user.id,
        senderType: "customer",
        message: input.message,
      });

      if (!messageId) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      // Generate AI recommendation if message contains product-related keywords
      let aiResponse = null;
      if (
        input.message.toLowerCase().includes("recommend") ||
        input.message.toLowerCase().includes("suggest") ||
        input.message.toLowerCase().includes("help") ||
        input.message.toLowerCase().includes("product")
      ) {
        try {
          const llmResponse = await invokeLLM({
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful cannabis dispensary assistant. Provide brief, friendly product recommendations based on customer needs. Keep responses under 100 words.",
              },
              { role: "user", content: input.message },
            ],
          });

          const content = llmResponse.choices[0]?.message.content;
          aiResponse = typeof content === "string" ? content : null;

          if (aiResponse) {
            await addChatMessage({
              conversationId: input.conversationId,
              senderId: 0, // System message
              senderType: "agent",
              message: aiResponse,
            });
          }
        } catch (error) {
          console.error("LLM recommendation failed:", error);
        }
      }

      return { messageId, aiResponse };
    }),

  // Get user conversations
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    return await getUserConversations(ctx.user.id);
  }),

  // Close conversation
  closeConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input }) => {
      const success = await closeConversation(input.conversationId);
      if (!success) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return { success: true };
    }),

  // Mark messages as read
  markAsRead: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input }) => {
      const success = await markMessagesAsRead(input.conversationId);
      if (!success) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return { success: true };
    }),

  // Agent endpoints
  getOnlineAgents: publicProcedure.query(async () => {
    return await getOnlineAgents();
  }),

  getActiveConversations: protectedProcedure.query(async ({ ctx }) => {
    // Only admins can see all conversations
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return await getActiveConversations();
  }),

  assignToAgent: protectedProcedure
    .input(z.object({ conversationId: z.number(), agentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Only admins can assign conversations
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const success = await assignConversationToAgent(
        input.conversationId,
        input.agentId
      );
      if (!success) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return { success: true };
    }),

  updateAgentStatus: protectedProcedure
    .input(z.object({ status: z.enum(["online", "offline", "away"]) }))
    .mutation(async ({ input, ctx }) => {
      // Agents can only update their own status
      const success = await updateAgentStatus(ctx.user.id, input.status);
      if (!success) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return { success: true };
    }),
});
