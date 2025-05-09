import { useEffect } from "react";
import Pusher from "pusher-js";
import { userId } from "../lib/utils";
import { chatObserver } from "../lib/chatObserver";
const ChatListener = () => {
  const user_id = userId();
  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY!, {
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER!,
      authEndpoint: "http://localhost:8000/api/broadcasting/auth",
      auth: {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Gửi token vào header
        },
      },
    });

    const channel = pusher.subscribe("private-chatting." + user_id);

    channel.bind("MessageCreated", (data: any) => {
        if (!data) return;
        if (window.location.pathname.startsWith("/admin/chat")) 
            chatObserver.notify(data); 
        else 
            alert('New message');
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return null;
};

export default ChatListener;
