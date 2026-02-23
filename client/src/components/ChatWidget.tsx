import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ChatWidget() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startConversationMutation = trpc.chat.startConversation.useMutation();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const { data: chatMessages, refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
    { conversationId: conversationId || 0 },
    { enabled: !!conversationId }
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      // Small timeout to ensure the element is rendered and visible
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Update messages when fetched
  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  const handleOpenChat = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to use chat");
      return;
    }

    if (!conversationId) {
      setIsLoading(true);
      try {
        const conversation = await startConversationMutation.mutateAsync({
          subject: "Customer Support",
        });
        setConversationId(conversation.id);
      } catch (error) {
        toast.error("Failed to start chat");
      } finally {
        setIsLoading(false);
      }
    }

    setIsOpen(true);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversationId) return;

    const messageText = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const result = await sendMessageMutation.mutateAsync({
        conversationId,
        message: messageText,
      });

      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          id: result.messageId,
          conversationId,
          senderId: user?.id,
          senderType: "customer",
          message: messageText,
          createdAt: new Date(),
        },
      ]);

      // Add AI response if available
      if (result.aiResponse) {
        setMessages((prev) => [
          ...prev,
          {
            conversationId,
            senderId: 0,
            senderType: "agent",
            message: result.aiResponse,
            createdAt: new Date(),
          },
        ]);
      }

      // Refetch messages to ensure sync
      await refetchMessages();
    } catch (error) {
      toast.error("Failed to send message");
      setInputMessage(messageText); // Restore message on error
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Chat Widget Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleOpenChat}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">Open support chat</TooltipContent>
      </Tooltip>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold">Dimitri's Support</h3>
              <p className="text-sm text-green-100">We're here to help!</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-green-700 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Close chat</TooltipContent>
            </Tooltip>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Start a conversation!</p>
                <p className="text-sm">Ask about products or get recommendations</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.senderType === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderType === "customer"
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                disabled={isLoading}
                aria-label="Chat message"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    aria-label="Send message"
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Send message</TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Ask about products or get personalized recommendations!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
