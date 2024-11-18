import React, { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const user1 = {
  id: "john",
  name: "John",
  image: "https://cdn-icons-png.flaticon.com/512/219/219969.png",
};

const user2 = {
  id: "jane",
  name: "Jane",
  image: "https://cdn-icons-png.flaticon.com/512/219/219970.png",
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(user1);
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted components

    const initChat = async () => {
      if (client) {
        await client.disconnectUser(); // Disconnect old client
        setClient(null);
        setChannel(null); // Clear old channel
      }

      const chatClient = StreamChat.getInstance(apiKey);

      try {
        await chatClient.connectUser(
          currentUser,
          chatClient.devToken(currentUser.id)
        );

        const createdChannel = chatClient.channel("team", "react-team-chat", {
          image: "https://www.patterns.dev/img/reactjs/react-logo@3x.svg",
          name: "React Team Discussions",
          members: ["john", "jane"],
        });

        await createdChannel.watch();

        if (isMounted) {
          setClient(chatClient);
          setChannel(createdChannel);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (isMounted) setIsLoading(false);
      }
    };

    initChat();

    return () => {
      isMounted = false; // Avoid updates if the component unmounts
      if (client) {
        client.disconnectUser();
      }
    };
  }, [currentUser]);

  const toggleUser = () => {
    setCurrentUser(currentUser.id === "john" ? user2 : user1);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          onClick={toggleUser}
          style={{
            marginBottom: "10px",
            padding: "8px 12px",
            cursor: "pointer",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Switch to {currentUser.id === "john" ? "Jane" : "John"}
        </button>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Current User: <strong>{currentUser.name}</strong>
        </p>
      </div>

      {client && channel && (
        <Chat client={client} theme="messaging dark">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      )}
    </div>
  );
}
