import { Notification } from "@/db/schema";
import { Calendar, MessageCircle } from "lucide-react";

export function getNotificationLink(notification: Notification) {
  const urls = {
    event: ``,
    reply: ``,
  } as any;
  return urls[notification.type];
}

export function getNotificationIcon(notification: Notification) {
  if (notification.type === "event") {
    return <Calendar className="w-5 h-5" />;
  } else if (notification.type === "reply") {
    return <MessageCircle className="w-5 h-5" />;
  }
}
