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
  key: '0beb714287d405b107bb',  
  cluster: 'ap1',   
  forceTLS: true,       
  encrypted: true,      
  disableStats: true,
});


export default echo;
