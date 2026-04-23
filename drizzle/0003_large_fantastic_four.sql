CREATE INDEX `appointments_userId_idx` ON `appointments` (`userId`);--> statement-breakpoint
CREATE INDEX `chatConversations_userId_idx` ON `chatConversations` (`userId`);--> statement-breakpoint
CREATE INDEX `chatConversations_agentId_idx` ON `chatConversations` (`agentId`);--> statement-breakpoint
CREATE INDEX `chatMessages_conversationId_idx` ON `chatMessages` (`conversationId`);--> statement-breakpoint
CREATE INDEX `notifications_userId_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `notifications_relatedOrderId_idx` ON `notifications` (`relatedOrderId`);--> statement-breakpoint
CREATE INDEX `notifications_relatedAppointmentId_idx` ON `notifications` (`relatedAppointmentId`);--> statement-breakpoint
CREATE INDEX `orderItems_orderId_idx` ON `orderItems` (`orderId`);--> statement-breakpoint
CREATE INDEX `orderItems_productId_idx` ON `orderItems` (`productId`);--> statement-breakpoint
CREATE INDEX `orders_userId_idx` ON `orders` (`userId`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category`);