import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: any;
  }
}

window.Pusher = Pusher;


const echo = new Echo({
  broadcaster: 'pusher',
  key: '0beb714287d405b107bb',  // Lấy từ .env hoặc điền trực tiếp
  cluster: 'ap1',   // Ví dụ: "ap1", "mt1", "eu"
  forceTLS: true,       // Bắt buộc dùng HTTPS (Pusher yêu cầu)
  encrypted: true,      // Mã hóa kết nối
  disableStats: true,
});

window.echo = echo;
export default echo;
