import Pusher from "pusher-js";
import { userId } from "../lib/utils";

const user_id = userId();

const pusher = new Pusher("0beb714287d405b107bb", {
  cluster: "ap1",
  forceTLS: true,
  authEndpoint: "http://localhost:8000/api/broadcasting/auth",
  auth: {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  },
});

const channel = pusher.subscribe("private-chatting." + user_id);

export default channel;
