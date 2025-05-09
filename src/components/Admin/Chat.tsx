import { useEffect, useState, useRef } from "react";
import AdminChatView from "../../views/AdminChat";
import AdminChat from "../../views/AdminChat";
import { useMessage } from "../../hooks/useMessage";
import { userId } from "../../lib/utils";
import { chatObserver } from "../../lib/chatObserver";

const Chat = () => {
  let newMessageSubed = false;
  const user_id = userId();
  const [changedThread, setChangedThread] = useState(false);
  const [pageThread, setPageThread] = useState(1);
  const [sizeThread, setSizeThread] = useState(10);
  const [parameters, setParameters] = useState([]);
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(undefined);
  const { getThreads, getThread, sendMessageAPI } = useMessage();
  const scrollToBottomFunctionRef = useRef(null);
  useEffect(() => {
    if (currentThread) {
      if (!currentThread.messages) 
        getMessage();
      else if (!changedThread) setChangedThread(true);
    }
    if (!threads || threads.length === 0) loadThread();
  }, [currentThread]);
  useEffect(() => {
    if (!newMessageSubed) {
      newMessageSubed = true;
      chatObserver.subscribe((newMessage) => {  
        handlerNewMessage(newMessage)
      })
    }
  }, [])
  const handlerNewMessage = (message) => {
    const threadIndex = threads.findIndex(item => item.id === message.thread_id);
    //Neu thread chưa tồn tại, load lại thread
    if (threadIndex === -1) {
      loadThread();
      return;
    }
    const thread = threads[threadIndex];
    thread.last_send = message.time_send;
    thread.last_sender_id = messages.sender_id;
    thread.latest_message = message;
    if (currentThread && currentThread.id === thread.id) {
      //goi api doc message
    } else
      thread.readed = false
    //Kiem tra neu messages cua thread đã được load
    const paraIndex = parameters.findIndex(item => item.id === thread.id);
    if (paraIndex === -1) return;
    thread.messages = [message, ...thread.messages]
    const newThreads = [...threads]
    newThreads.splice(threadIndex, 1)
    setThreads([thread, ...newThreads]);
  }
  const loadThread = () => {
    getThreads(pageThread, sizeThread).then((data) => {
        setThreads(data.data);
    });
  }
  const scrollToBottomBoxChat = (fn) => {
    scrollToBottomFunctionRef.current = fn;
  };
  const hasNext = (parameter, thread) => {
    const totalPages = Math.ceil(thread.messages_count / parameter.size) + (thread.messages_count % parameter.size == 0 ? 0 : 1);
    return parameter.page < totalPages;
  }
  const getMessage = () => {
    if (!currentThread) return;

    let parameterIndex = parameters.findIndex(
      (item) => item.id === currentThread.id,
    );

    console.log(parameters)
    let parameter;

    if (parameterIndex === -1) {
      parameter = { id: currentThread.id, page: 0, size: 10 }; // Đảm bảo có `size` ở đây
    } else {
      parameter = parameters[parameterIndex];
    }

    // Tăng số trang lên trước khi gọi API
    parameter.page++;

    if (!hasNext(parameter, currentThread)) return;

    getThread(currentThread.id, parameter.page, parameter.size)
      .then((data) => {
        const messages = data.data.messages;
        const threadIndex = threads.findIndex(item => item.id === currentThread.id);
        const thread = threads[threadIndex];
        if (thread.messages)
          thread.messages = [...thread.messages, ...messages];
        else 
          thread.messages = messages;
        threads[threadIndex] = thread;

        setParameters([...parameters.filter(item => item.id != currentThread.id), parameter]);

        setThreads(threads);

        setCurrentThread(thread);

        console.log(thread)

        if (!changedThread) setChangedThread(true);

        console.log(parameters)
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
      });
  };
  const sendMessage = (content, setInputValue) => {
    if (!currentThread) return;
    sendMessageAPI(content, currentThread.id)
      .then(data => {
        const newMessage = data.data;
        const updatedThreads = [...threads];
        const threadIndex = updatedThreads.findIndex(item => item.id === currentThread.id)
        const thread = updatedThreads[threadIndex]
        if (thread.messages)
          thread.messages = [newMessage, ...thread.messages]
        else 
          thread.messages = [newMessage]
        setThreads(updatedThreads);
        setCurrentThread(thread)
        setInputValue('')
        setChangedThread(true)
      })
  }
  return (
    <>
      <AdminChat
        threads={threads}
        currentThread={currentThread}
        setCurrentThread={setCurrentThread}
        loadMessage={getMessage}
        scrollToBottomBoxChat={scrollToBottomBoxChat}
        changedThread={changedThread}
        setChangedThread={setChangedThread}
        sendMessage={sendMessage}
      />
    </>
  );
};

export default Chat;
