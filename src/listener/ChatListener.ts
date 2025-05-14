import Pusher from "pusher-js";
import { userId } from "../lib/utils";

const user_id = userId();
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

export default channel;