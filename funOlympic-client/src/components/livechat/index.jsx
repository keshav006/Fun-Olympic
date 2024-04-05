// ChatComponent.jsx
import React, { useState, useEffect, useReducer } from 'react';
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import io from 'socket.io-client';

// Assuming your server is running on localhost:8000

const ChatComponent = () => {

  const { id: eventId } = useParams();
  const { data } = useSession();
  const userId = data?.user?.id;

  // const socket = io('http://localhost:8000');
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    debugger
    const newSocket = io('http://localhost:8000');
    console.log("eventid", eventId)
    newSocket.emit('joinChat', eventId);
    
    newSocket.on("connect", ()=> {
      console.log('Socket connected')
    })

    newSocket.on("disconnect", ()=> {
      console.log('Socket disconnected')
    })
    
    newSocket.on('chat message', (message) => {
      setChatHistory((prevHistory) => [...prevHistory, message.body]);
    })

    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    }
  }, [eventId])

  const sendMessage = (e) => {
    debugger
    e.preventDefault();
    if (message) {
      socket.emit("chat message", {message, userId, eventId});
      setMessage('');
    }
  };

  return (
    <div>
      <div id="chat-container" class="w-96">
        <div class="bg-white shadow-md rounded-lg max-w-lg w-full">
            <div class="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
                <p class="text-lg font-semibold">Live Chat</p>
                <button id="close-chat" class="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div id="chatbox" class="p-4 h-80 overflow-y-auto">
              {chatHistory.map((message, index) => ( 
                <div class="mb-2 text-right">
                  <p class="bg-blue-500 text-white rounded-lg py-2 px-4 inline-block">{message}</p>
                </div>
              ))}
            </div>
            <div class="p-4 border-t flex ">
            <form onSubmit={sendMessage}>
              <div class="flex">
                <input 
                  id="user-input" 
                  type="text" 
                  placeholder="Type a message"
                  onChange={(e) => setMessage(e.target.value)}
                  class="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2" 
                  />
                <button id="send-button" class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300" onClick={sendMessage}>Send</button>
              </div>
            </form> 
          </div>
        </div>
    </div>
    </div>
  );
};

export default ChatComponent;
