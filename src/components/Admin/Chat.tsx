import { useEffect, useState } from "react";
import AdminChat from "../../views/AdminChat";
import { useMessage } from "../../hooks/useMessage";
import channel from "../../listener/ChatListener";
import { useChatStore } from "../../stores/ChatStore";
import { userId } from "../../lib/utils";
import { VNESoSanh, VNEToString } from "../../lib/dayj";
import { Thread } from "../../types/Thread";

const Chat = () => {
  const user_id = userId();
  const sizeThread = 10;

  const { getThreads, getThread, sendMessageAPI, readThread } = useMessage();
  
  const typing = useChatStore((state) => state.typing);
  const setTyping = useChatStore((state) => state.setTyping);
  const threads = useChatStore((state) => state.threads);
  const setThreads = useChatStore((state) => state.setThreads);
  const currentThread = useChatStore((state) => state.currentThread);
  const setCurrentThread = useChatStore((state) => state.setCurrentThread);
  const pageThread = useChatStore((state) => state.pageThread);
  const setPageThread = useChatStore((state) => state.setPageThread);
  const parameters = useChatStore((state) => state.parameters);
  const setParameters = useChatStore((state) => state.setParameters);
  const handlerNewMessage = useChatStore((state) => state.handlerNewMessage);
  const handlerReadedMessages = useChatStore(
    (state) => state.handlerReadedMessages,
  );
  const changedThread = useChatStore((state) => state.changedThread);
  const setChangedThread = useChatStore((state) => state.setChangedThread);

  const [imagesUpload, setImagesUpload] = useState<{ link: string; file: File }[]>([]);

  useEffect(() => {
    if (currentThread) {
      if (!currentThread.messages) getMessages();
      else if (!changedThread) setChangedThread(true);
      if (currentThread.last_sender_id !== user_id && !currentThread.readed)
        readMessages(currentThread.id);
    }
  }, [currentThread]);

  useEffect(() => {
    nextThreads();
    const handleIncomingMessage = (data: any) => {
      if (!data) return;
      handlerNewMessage(data.content, loadThreads);
    };

    const handleReadedMessages = (data: any) => {
      if (!data) return;
      handlerReadedMessages(data.content, user_id);
    };

    channel.bind("MessageCreated", handleIncomingMessage);

    channel.bind("MessageReaded", handleReadedMessages);

    return () => {
      channel.unbind("MessageCreated", handleIncomingMessage); // Cleanup
      channel.unbind("MessageReaded", handleReadedMessages); // Cleanup
    };
  }, []);

  const readMessages = (thread_id: string) => {
    readThread(thread_id).then(() => {
      const threadIndex = threads.findIndex((item: Thread) => item.id === thread_id);
      if (threadIndex === -1) return;

      const oldThread = threads[threadIndex];
      handlerReadedMessages(oldThread, user_id)
    });
  };


  const loadThreads = async () => {
    setParameters([]);

    const allThreads: Thread[] = [];

    for (let i = 1; i <= pageThread; i++) {
      const data = await getThreads(i, sizeThread);
      if (data) allThreads.push(...data);
    }

    setThreads(allThreads);

    // Nếu currentThread không tồn tại trong danh sách mới → reset
    if (
      currentThread &&
      allThreads.findIndex((item) => item.id === currentThread.id) === -1
    ) {
      setCurrentThread(undefined);
    }
  };
  const nextThreads = () => {
    getThreads(pageThread + 1, sizeThread).then((newThreads) => {
      if (!newThreads || newThreads.length === 0) return;

      setThreads([...threads, ...newThreads]);
      setPageThread(pageThread + 1);
    });
  };
  const hasNext = (parameter: {id: string, page: number, size: number}, thread: Thread) => {
    const totalPages =
      Math.ceil(thread.messages_count / parameter.size) +
      (thread.messages_count % parameter.size == 0 ? 0 : 1);
    return parameter.page <= totalPages;
  };
  const getMessages = async () => {
    if (!currentThread) return;

    const parameterIndex = parameters.findIndex(
      (item: {id: string}) => item.id === currentThread.id,
    );

    let parameter;

    if (parameterIndex === -1) {
      parameter = { id: currentThread.id, page: 0, size: 10 }; // Đảm bảo có `size` ở đây
    } else {
      parameter = parameters[parameterIndex];
    }

    // Tăng số trang lên trước khi gọi API
    parameter.page++;

    if (!hasNext(parameter, currentThread)) return;

    const data = await getThread(
      currentThread.id,
      parameter.page,
      parameter.size,
    );

    const threadRes = data;
    if (!threadRes) return;
    const threadIndex = threads.findIndex(
      (item: Thread) => item.id === currentThread.id,
    );
    const threadOld = threads[threadIndex];

    if (threadOld.messages)
      threadRes.messages = [...threadOld.messages, ...threadRes.messages];
    threads[threadIndex] = threadRes;

    setParameters([
      ...parameters.filter((item: {id: string}) => item.id != currentThread.id),
      parameter,
    ]);

    setThreads([...threads]);

    setCurrentThread(threadRes);
  };
  const sendMessage = (content: string, setInputValue: (value: string) => void) => {
    if (!currentThread) return;
    sendMessageAPI(content, imagesUpload, currentThread.id).then((data) => {
      setImagesUpload([]);
      const newMessage = data;
      if (!newMessage) return;
      handlerNewMessage(newMessage, loadThreads);
      setInputValue("");
    });
  };
  return (
    <>
      <AdminChat
        threads={threads}
        currentThread={currentThread}
        setCurrentThread={setCurrentThread}
        changedThread={changedThread}
        setChangedThread={setChangedThread}
        sendMessage={sendMessage}
        imagesUpload={imagesUpload}
        setImagesUpload={setImagesUpload}
        nextThreads={nextThreads}
        getMessages={getMessages}
        typing={typing}
      />
    </>
  );
};

export default Chat;
