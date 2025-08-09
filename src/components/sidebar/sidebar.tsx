// File: /components/Sidebar/Sidebar.tsx
"use client";

import React , { useState, useEffect} from 'react';
import Image from 'next/image';
import { FaSearch } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  onTaskAdded?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, token, onTaskAdded  }) => {
     const [loading, setLoading] = useState(false);
     const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
const [userName, setUserName] = useState("");

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("https://dotnet-backend-todoapp.onrender.com/api/Auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user info");
      }

      const data = await res.json();
      console.log('Fetched user:', data);
      setUserName(data.name);
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  if (token) {
    fetchUser();
  }
}, [token]);



 const handleSave = async () => {
  if (!title || !description) return;

  if (!token) {
    console.error("No token found");
    return;
  }

  try {
    const response = await fetch("https://dotnet-backend-todoapp.onrender.com/api/Todo/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      console.log(await response.text()); // helpful for debugging
      throw new Error("Failed to create task");
    }

    const data = await response.json();
    console.log("Task added:", data);
    alert("Task created successfully!");


    setShowModal(false);
    setTitle("");
    setDescription("");
      if (onTaskAdded) {
      onTaskAdded();
    }
  } catch (err) {
    console.error("Error adding task:", err);
  } finally {
    setLoading(false);
  }
};




const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};


  return (
     <div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

   <aside
  className={`
    fixed z-50 top-0 left-0 h-full w-64 bg-gray-400 p-4 flex flex-col justify-between border-r shadow-md
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static md:block
  `}
>
  {/* Top content */}
  <div >
   <div className='mb-1 bg-white flex items-center gap-2'>
  <Image 
    src="/profile.PNG"
    alt=""
    width={50}
    height={50}
  />
  <h2 className="text-xl text-gray-500 font-semibold">
    Hello, {userName || 'User'}
  </h2>
</div>

    <hr className="border-t border-white mb-6" />

   
    <div className="relative w-full max-w-xs mb-4 ">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 " />
      <input
        type="text"
        placeholder="Search..."
        className="pl-10 pr-3 py-2 w-full border bg-white border-gray-300 rounded-lg outline-none focus:outline-none  "
      />
    </div>

    <div className="mb-6">
      <button 
      onClick={() => setShowModal(true)}
      className="bg-gray-500 py-1 px-6 w-full text-white border border-white rounded-sm hover:bg-gray-400">
        + Add New Task
      </button>
    </div>
  </div>

  {/* Bottom Sign Out button */}
  <div>
    <button 
    onClick={handleLogout}
    className="bg-red-600 py-1 px-6 text-white border w-full rounded-sm hover:bg-red-500">
      Sign Out
    </button>
  </div>
</aside>

  {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-gray-300 p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

            <input
              type="text"
              placeholder="Title"
              className="w-full px-3 py-2 border border-gray-700 rounded mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Description"
              className="w-full px-3 py-2 border border-gray-700 rounded mb-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                 disabled={loading}
              >
               {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sidebar;