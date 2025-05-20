import { Image } from "./Image";
import { Thread } from "./Thread";

export interface Message {
    id: string;
    sender_id: string,
    receiver_id: string,
    time_send: string | null,
    content: string,
    readed: boolean,
    time_read: string | null,
    thread_id: string,
    images: Image[],
    thread: Thread
}