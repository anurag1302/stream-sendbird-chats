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

// Stream API key
const apiKey = "n4mpp2y7j62w";

// Simulate 2 Users
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
  const [currentUser, setCurrentUser] = useState(user1); // Default to user1 (John)
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  // Create and initialize the client and channel when user switches
  useEffect(() => {
    const initChat = async () => {
      if (client) {
        await client.disconnectUser();
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
          members: ["john", "jane"], // Add both john and jane as members
        });

        await createdChannel.watch();

        setClient(chatClient);
        setChannel(createdChannel);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setIsLoading(false);
      }
    };

    if (shouldRender) {
      initChat();
    }

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [currentUser, shouldRender]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const toggleUser = () => {
    setShouldRender(false);
    setCurrentUser(currentUser.id === "john" ? user2 : user1);
    setShouldRender(true);
  };

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
    </div>
  );
}
