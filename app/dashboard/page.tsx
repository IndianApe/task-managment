"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tasks, setTasks] = useState<{ id: string; name: string }[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws");

    ws.onmessage = (event) => {
      try {
        const receivedTasks = JSON.parse(event.data);
        setTasks(receivedTasks);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected. Attempting Reconnection...");
      setTimeout(() => setSocket(new WebSocket("ws://localhost:8080/ws")), 3000);
    };

    setSocket(ws);
    return () => ws.close();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Add Task
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300">
            Settings
          </button>
        </div>
      </header>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Task List Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Tasks</h2>
          <ul className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">{task.name}</span>
                    <button className="text-red-500 hover:text-red-600 transition duration-300">
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No tasks available.</p>
            )}
          </ul>
        </div>

        {/* Statistics Section */}
        <div className="col-span-1 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Statistics</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-700">Completed Tasks</h3>
              <p className="text-2xl font-bold text-blue-700">12</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-medium text-purple-700">Pending Tasks</h3>
              <p className="text-2xl font-bold text-purple-700">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-8 text-center text-gray-500">
        <p>&copy; 21BCE5788. All rights reserved.</p>
      </footer>
    </div>
  );
}
