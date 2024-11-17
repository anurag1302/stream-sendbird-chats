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
const apiKey = "n4mpp2y7j62w"; // Replace with your actual Stream API Key

// User profiles
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
  const [shouldRender, setShouldRender] = useState(true); // Control re-rendering

  // Create and initialize the client and channel when user switches
  useEffect(() => {
    const initChat = async () => {
      // Clean up previous client if exists
      if (client) {
        await client.disconnectUser();
      }

      // Create a new StreamChat client instance for the new user
      const chatClient = StreamChat.getInstance(apiKey);

      try {
        // Connect the new user
        await chatClient.connectUser(
          currentUser,
          chatClient.devToken(currentUser.id)
        );

        // Create or get the channel (we will use the same channel for both users)
        const createdChannel = chatClient.channel("team", "react-team-chat", {
          image: "https://www.patterns.dev/img/reactjs/react-logo@3x.svg",
          name: "React Team Discussions",
          members: ["john", "jane"], // Add both john and jane as members
        });

        // Watch the channel
        await createdChannel.watch();

        // Set client and channel to state
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

    // Cleanup function to disconnect the user on component unmount
    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [currentUser, shouldRender]); // Trigger re-run when currentUser changes

  // Show loading indicator while the chat client or channel is being initialized
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Function to toggle between users
  const toggleUser = () => {
    setShouldRender(false); // Set to false to unmount and re-mount component
    setCurrentUser(currentUser.id === "john" ? user2 : user1); // Toggle between john and jane
    setShouldRender(true); // Set to true to trigger re-render
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Button to toggle between users */}
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

      {/* Chat Interface */}
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
