import { Notification } from "@/components/user/NotificationDropdown";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "match",
    content: "You have a new match with Mali! Start chatting now.",
    relatedUserName: "Mali",
    relatedUserImage:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: "2",
    type: "like",
    content: "Som liked your profile!",
    relatedUserName: "Som",
    relatedUserImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "3",
    type: "message",
    content: "Nisa sent you a message",
    relatedUserName: "Nisa",
    relatedUserImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "4",
    type: "view",
    content: "Fern viewed your profile",
    relatedUserName: "Fern",
    relatedUserImage:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "5",
    type: "like",
    content: "Ploy liked your profile!",
    relatedUserName: "Ploy",
    relatedUserImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];
