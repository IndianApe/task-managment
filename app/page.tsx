"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import ChatComponent from "./ChatComponent"; // Adjust the import path as necessary

export default function Home() {
  const [notification, setNotification] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws");

    ws.onmessage = (event) => {
      setNotification(event.data);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected. Attempting Reconnection...");
      setTimeout(() => setSocket(new WebSocket("ws://localhost:8080/ws")), 3000);
    };

    setSocket(ws);
    return () => ws.close();
  }, []);

  return (
    <div className="grid grid-rows-[1fr_auto] min-h-screen items-center justify-items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-10">
      {/* Hero Section */}
      <main className="flex flex-col items-center text-center gap-8">
        {/* Logo */}
        <div className="relative w-48 h-16">
          <Image
            src="/images/i.png" // Replace with your task management system logo
            alt="Task Manager Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Title and Description */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Manage Your Tasks in Real-Time
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl">
          Stay organized, collaborate with your team, and get things done faster with our **real-time task management system**.
        </p>

        {/* WebSocket Real-Time Notification */}
        {notification && (
          <p className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md">
            {notification}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-4 mt-6">
          <a
            href="/login" // Link to your login page
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
          >
            Get Started
          </a>
          <a
            href="/features" // Link to your features page
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-center gap-6 mt-10 text-gray-400">
        <a
          href="/privacy" // Link to your privacy policy
          className="hover:text-white transition hover:underline"
        >
          Privacy Policy
        </a>
        <a
          href="/terms" // Link to your terms of service
          className="hover:text-white transition hover:underline"
        >
          Terms of Service
        </a>
        <a
          href="/contact" // Link to your contact page
          className="hover:text-white transition hover:underline"
        >
          Contact Us
        </a>
      </footer>

      {/* AI Chat Component */}
      <ChatComponent />
    </div>
  );
}