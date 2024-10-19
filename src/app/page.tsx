"use client";
import React, { useRef, useEffect, useState } from "react";

const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fileToSendRef = useRef<File | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<number[]>([]);

  useEffect(() => {
    wsRef.current = new WebSocket(`ws://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

    wsRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "userList") {
        setConnectedUsers(data.users);
      } else {
        const { fileName, fileBuffer } = data;
        const byteString = atob(fileBuffer);
        const byteNumbers = new Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          byteNumbers[i] = byteString.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    fileToSendRef.current = file;
  };

  const handleSendFile = () => {
    const file = fileToSendRef.current;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const fileBuffer = reader.result?.toString().split(",")[1];
      const message = JSON.stringify({
        fileName: file.name,
        fileBuffer: fileBuffer,
      });
      wsRef.current?.send(message);
      console.log(`File sent: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ marginBottom: "10px" }} />
      <button onClick={handleSendFile}>Send File</button>
      <h3>Connected Users:</h3>
      <ul>
        {connectedUsers.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
