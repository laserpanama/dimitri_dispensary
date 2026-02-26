CREATE INDEX `appointments_user_id_idx` ON `appointments` (`userId`);--> statement-breakpoint
CREATE INDEX `chat_agents_user_id_idx` ON `chatAgents` (`userId`);--> statement-breakpoint
CREATE INDEX `chat_conversations_user_id_idx` ON `chatConversations` (`userId`);--> statement-breakpoint
CREATE INDEX `chat_messages_conversation_id_idx` ON `chatMessages` (`conversationId`);--> statement-breakpoint
CREATE INDEX `notifications_user_id_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `order_items_order_id_idx` ON `orderItems` (`orderId`);--> statement-breakpoint
CREATE INDEX `order_items_product_id_idx` ON `orderItems` (`productId`);--> statement-breakpoint
CREATE INDEX `orders_user_id_idx` ON `orders` (`userId`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category`);