// import React from
// "react"; import "../css/app.css";
// import { createRoot } from "react-dom/client";
//
// import Example from "./components/Example";
// import Navbar from "./components/Navbar";
// function App() {
//     return (
// <div>
//   <Example />
// </div>
// );
// }
// const container = document.getElementById("app");
// const root =createRoot(container); root.render(<App />);
import React from "react";
import "../css/app.css";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Pusher from "pusher-js";

function App() {
    const [username, setUsername] = useState("username");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        Pusher.logToConsole = true;

        const pusher = new Pusher("7638cdb9aecebdc3b906", {
            cluster: "ap1",
        });

        const channel = pusher.subscribe("chat");
        channel.bind("message", function (data) {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Clean up
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        try {
            await fetch("http://localhost:8000/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    message,
                }),
            });
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
            <div className="flex flex-col">
                <div className="flex items-center p-3 border-b">
                    <input
                        className="text-lg font-semibold w-full outline-none"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="overflow-y-auto h-96 border-b">
                    {messages.map((message, index) => (
                        <div key={index} className="p-3 hover:bg-gray-50">
                            <div className="flex justify-between items-center">
                                <strong className="text-gray-900">
                                    {message.username}
                                </strong>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                {message.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <form onSubmit={submit} className="mt-4">
                <input
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="hidden">
                    Send
                </button>
            </form>
        </div>
    );
}

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
