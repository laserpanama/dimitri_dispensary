import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Send,
  Loader2,
  ArrowLeft,
  User,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function AgentChat() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: activeConversations, refetch: refetchConversations } = trpc.chat.getActiveConversations.useQuery();
  const { data: messages, refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
    { conversationId: selectedConversationId || 0 },
    { enabled: !!selectedConversationId }
  );

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const closeConversationMutation = trpc.chat.closeConversation.useMutation();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      toast.error("Access denied. Admin only.");
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages and conversations
  useEffect(() => {
    const interval = setInterval(() => {
      refetchConversations();
      if (selectedConversationId) {
        refetchMessages();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedConversationId, refetchConversations, refetchMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedConversationId) return;

    setIsSending(true);
    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedConversationId,
        message: inputMessage,
      });
      setInputMessage("");
      await refetchMessages();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseConversation = async (id: number) => {
    try {
      await closeConversationMutation.mutateAsync({ conversationId: id });
      toast.success("Conversation closed");
      if (selectedConversationId === id) {
        setSelectedConversationId(null);
      }
      refetchConversations();
    } catch (error) {
      toast.error("Failed to close conversation");
    }
  };

  const selectedConversation = activeConversations?.find(c => c.id === selectedConversationId);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-green-500/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            Live Support Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">Agent: {user?.name}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Conversation List */}
        <div className="w-80 border-r border-slate-700 bg-slate-800/50 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Active Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!activeConversations || activeConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No active conversations</p>
              </div>
            ) : (
              activeConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`w-full p-4 flex flex-col gap-1 border-b border-slate-700 text-left transition-colors ${
                    selectedConversationId === conv.id ? "bg-green-500/10 border-l-4 border-l-green-500" : "hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-white font-medium flex items-center gap-2 text-sm">
                      <User className="w-3 h-3 text-green-400" />
                      User #{conv.userId}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(conv.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{conv.subject || "No Subject"}</p>
                  <span className={`text-[10px] mt-1 px-1.5 py-0.5 rounded-full w-fit ${
                    conv.status === 'waiting' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {conv.status}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900/50">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700 bg-black/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">User #{selectedConversation.userId}</h3>
                    <p className="text-xs text-gray-400">{selectedConversation.subject || "Customer Inquiry"}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => handleCloseConversation(selectedConversation.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Close Chat
                </Button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.senderType === "agent" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-lg shadow-sm ${
                        msg.senderType === "agent"
                          ? "bg-green-600 text-white rounded-br-none"
                          : "bg-slate-700 text-gray-100 rounded-bl-none border border-slate-600"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <div className="flex items-center justify-between gap-4 mt-1">
                        <span className="text-[10px] opacity-60">
                          {msg.senderType === "agent" ? "You" : `User ${msg.senderId === 0 ? "(System)" : ""}`}
                        </span>
                        <span className="text-[10px] opacity-60">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-black/20 border-t border-slate-700">
                <div className="flex gap-2 max-w-4xl mx-auto">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your response..."
                    disabled={isSending}
                    className="flex-1 bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !inputMessage.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-center items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-10" />
                <h3 className="text-lg font-medium text-gray-400">Select a conversation</h3>
                <p className="text-sm">Choose a chat from the sidebar to start responding</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
