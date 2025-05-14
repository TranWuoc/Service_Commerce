import { Message } from "./Message"
import { User } from "./User"

export interface Thread {
    id: string,
    user_id: string
    last_send: string | null
    last_sender_id: string
    readed: boolean,
    messages: Message[],
    user: User,
    latest_message: Message,
    messages_count: number
}