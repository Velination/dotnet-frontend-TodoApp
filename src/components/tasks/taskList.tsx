// File: /components/TaskList/TaskList.tsx

"use client"
import React, { useEffect, useState } from 'react';
import TaskItem from './taskItem';
import { FaHome } from "react-icons/fa";
import Image from 'next/image';



interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

const TaskList: React.FC<{ token : string }> = ({ token }) => {
   const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
     const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5167/api/Auth/me", {
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
  
   const fetchTasks = async () => {
      try {
         console.log("Token used for fetch:", token);
        const res = await fetch("http://localhost:5167/api/Todo/all", {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
  
  useEffect(() => {
   

    if (token) {
      fetchTasks();
    }
  }, [token]);


    const handleSave = () => {
      console.log("Title:", title);
      console.log("Description:", description);
      setShowModal(false);
      setTitle('');
      setDescription('');
    };


    const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};



   

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-white">
      
    {/* Mobile-only buttons at the top */}
 <div className='mb-1 md:hidden flex items-center gap-2'>
  <Image 
    src="/profile.PNG"
    alt=""
    width={30}
    height={30}
  />
  <h2 className="text-xl  text-gray-500 font-semibold">
    Hello, {userName || 'User'}
  </h2>
</div>

  <hr className="border-t md:hidden border-gray-100 my-4" />


<div className=" md:hidden flex items-center justify-between gap-2">
   

  <button 
   onClick={() => setShowModal(true)}
  className="bg-gray-500 py-2 px-3 rounded-sm hover:bg-gray-400 text-white text-sm">
    + Add Task
  </button>

  <div className="flex items-center gap-2 md:hidden">
  <FaHome size={24} className="text-gray-500" />
  <h2 className="text-xl text-gray-500 font-semibold">Tasks</h2>
</div>

  <button 
  onClick={handleLogout}
  className="bg-red-600 py-2 px-3 rounded-sm hover:bg-red-500 text-white text-sm">
    Log Out
  </button>
</div>


<div className="hidden md:flex items-center gap-2">
  <FaHome size={24} className="text-gray-500" />
  <h2 className="text-xl text-gray-500 font-semibold">Tasks</h2>
</div>



      

      <hr className="border-t border-gray-300 my-4" />


      
      {/* <AddTaskInput /> */}
      <div className="mt-4 space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
           <TaskItem
  key={task.id}
  id={task.id} 
  title={task.title}
  description={task.description}
  isCompleted={task.isCompleted}
  onDelete={fetchTasks}
  onUpdate={fetchTasks}
/>
          ))
        ) : (
          <p className='text-gray-500'>No tasks found. </p>
        )
      }
      </div>

       {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent  backdrop-blur-sm">
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
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskList;