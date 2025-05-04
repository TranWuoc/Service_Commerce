import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;
const echo = new Echo({
  broadcaster: "pusher",
  key: "your-pusher-key", // key trong file .env backend
  cluster: "ap1",         // hoặc cluster bạn đang dùng
  forceTLS: true,
  wsHost: window.location.hostname,
  wsPort: 6001, // Nếu bạn dùng Laravel Websocket thì cổng 6001
  wssPort: 6001,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

export default echo;