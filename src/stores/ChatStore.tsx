import { create } from "zustand";
import { VNESoSanh, VNEToString } from "../lib/dayj";
import { Thread } from "../types/Thread";
import { Message } from "../types/Message";

export const useChatStore = create((set, get) => ({
  typing: false,
  setTyping: (typing: boolean) => set({ typing: typing }),

  threads: [],
  setThreads: (newThreads: Thread[]) => set({ threads: newThreads }),

  currentThread: undefined,
  setCurrentThread: (currentThread: Thread) => set({ currentThread }),

  pageThread: 0,
  setPageThread: (pageThread: number) => set({ pageThread }),

  parameters: [],
  setParameters: (parameters: {id: string, page: number, size: number}) => set({ parameters }),

  changedThread: false,
  setChangedThread: (changedThread: boolean) => set({ changedThread: changedThread }),

  handlerNewMessage: (newMessage: Message, loadThreads: () => void) => {
    const { threads, currentThread, parameters } = get();

    const threadIndex = threads.findIndex(
      (item) => item.id === newMessage.thread_id
    );

    // Thread mới, load lại
    if (threadIndex === -1) {
      loadThreads();
      return;
    }

    const oldThread = threads[threadIndex];
    const parameterIndex = parameters.findIndex(item => item.id === oldThread.id);

    const size = parameters[0]?.size || 10; // lấy size mặc định nếu không có
    let updatedMessages = oldThread.messages ?? [];

    // Nếu tin nhắn thread đã được load
    if (parameterIndex !== -1) {
      updatedMessages = [newMessage, ...updatedMessages];

      // Nếu vượt quá số lượng tin của 1 page (n*size + 1), thì xóa tin cuối
      if (updatedMessages.length > 0 && (updatedMessages.length - 1) % size === 0) {
        updatedMessages = updatedMessages.slice(0, -1); // Xóa phần tử cuối
      }
    }

    const updatedThread = {
      ...oldThread,
      messages: updatedMessages,
      last_send: new Date(),
      last_sender_id: newMessage.sender_id,
      readed: false,
      messages_count: oldThread.messages_count + 1,
      latest_message: newMessage,
    };

    const newThreads = [
      updatedThread,
      ...threads.filter((item) => item.id !== updatedThread.id),
    ];

    set({ threads: newThreads });

    if (currentThread?.id === updatedThread.id) {
      set({ currentThread: { ...updatedThread } });
    }
  },

  handlerReadedMessages: (threadReq: Thread, user_id: string) => {
    const { threads, currentThread } = get();
    const threadIndex = threads.findIndex((item: {id: string}) => item.id === threadReq.id);
    if (threadIndex === -1) return;

    const now = new Date();
    const nowStr = VNEToString(now);

    const oldThread = threads[threadIndex];

    const updatedMessages = oldThread.messages?.map((msg: Message) => {
      if (
        msg.sender_id === user_id &&
        !msg.readed &&
        VNESoSanh(now, msg.time_send) === 1
      ) {
        return {
          ...msg,
          readed: true,
          time_read: nowStr,
        };
      }
      return msg;
    }) ?? [];

    const updatedThread = {
      ...oldThread,
      messages: updatedMessages,
      readed: oldThread.readed ? true : (user_id !== threadReq.last_sender_id)
    };

    const newThreads = [
      ...threads.slice(0, threadIndex),
      updatedThread,
      ...threads.slice(threadIndex + 1),
    ];

    set({ threads: newThreads });

    if (currentThread?.id === updatedThread.id) {
      set({ currentThread: { ...updatedThread } });
    }
  }

}));
