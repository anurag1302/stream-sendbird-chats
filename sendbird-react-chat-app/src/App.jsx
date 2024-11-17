import React, { useState } from "react";
import { App as SendbirdApp } from "@sendbird/uikit-react";
import "@sendbird/uikit-react/dist/index.css";

const apiKey = import.meta.env.VITE_SENDBIRD_APP_ID;
const accessToken1 = import.meta.env.VITE_ACCESSTOKEN_1;
const accessToken2 = import.meta.env.VITE_ACCESSTOKEN_2;

function App() {
  const [currentUser, setCurrentUser] = useState("User1");

  // Simulate 2 users
  const users = {
    User1: {
      userId: "TestUser1",
      nickname: "TU1",
      accessToken: accessToken1,
    },
    User2: {
      userId: "TestUser2",
      nickname: "TU2",
      accessToken: accessToken2,
    },
  };

  const activeUser = users[currentUser] || users["User1"];

  const toggleUser = () => {
    setCurrentUser((prev) => (prev === "User1" ? "User2" : "User1"));
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
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
          Switch to {currentUser === "User1" ? "User2" : "User1"}
        </button>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Current User: <strong>{activeUser.nickname}</strong>
        </p>
      </div>

      <SendbirdApp
        appId={apiKey}
        userId={activeUser.userId}
        nickname={activeUser.nickname}
        accessToken={activeUser.accessToken}
      />
    </div>
  );
}

export default App;
