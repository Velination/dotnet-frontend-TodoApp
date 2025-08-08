// File: /components/TaskList/TaskItem.tsx

"use client";
import React , { useEffect, useRef, useState } from 'react';

interface TaskItemProps {
  id: number;
  title: string;
  description: string;         
  isCompleted: boolean;
   onDelete: () => void;
   onUpdate: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, id, description, isCompleted, onDelete, onUpdate }) => {
   const [showMenu, setShowMenu] = useState(false);
   const [confirmDelete, setConfirmDelete] = useState(false);
   const menuRef = useRef<HTMLDivElement>(null);
   const [showUpdateForm, setShowUpdateForm] = useState(false);
const [updatedTitle, setUpdatedTitle] = useState("");
const [updatedDescription, setUpdatedDescription] = useState("");
const [updatedIsCompleted, setUpdatedIsCompleted] = useState(false);


    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    const updateTask = async () => {
  try {
    const res = await fetch(`http://localhost:5167/api/Todo/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: updatedTitle,
        description: updatedDescription,
        isCompleted: updatedIsCompleted,
      }),
    });

    if (res.ok) {
      console.log("Task updated");
      onUpdate(); // trigger a refresh
      setShowUpdateForm(false);
    } else {
      console.error("Failed to update task");
    }
  } catch (error) {
    console.error("Error updating task", error);
  }
};


   const deleteTask = async () => {
    try {
      const res = await fetch(`http://localhost:5167/api/Todo/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your setup
        },
      });

       if (res.ok) {
        onDelete();
        // Optionally trigger a state update or refresh the list
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task", error);
    } finally {
      setConfirmDelete(false);
    }
  };


  return (
    <div className="flex items-center justify-between p-3 border border-gray-300 rounded hover:shadow-sm bg-gray-300">
      <div>
        <div className="flex items-center gap-6">
  <p className="font-medium text-black">{title}</p>
  <span
    className={`text-xs font-semibold px-2 py-1 rounded ${
      isCompleted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {isCompleted ? "Completed" : "Not Done"}
  </span>
</div>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
        </div>
      </div>

       <div className="relative " ref={menuRef}>
      <button 
        onClick={() => setShowMenu(!showMenu)}
      className="text-black hover:text-gray-600"> &#8942;</button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button
               onClick={() => {
              setShowMenu(false);
  setUpdatedTitle(title);
  setUpdatedDescription(description);
  setUpdatedIsCompleted(isCompleted);
  setShowUpdateForm(true);
}}
                className=" w-full text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 flex justify-center items-center"
              >
                Update
              </button>
            </li>
             <hr className="border-t border-gray-300 " />
            <li>
              <button
                onClick={() => {
                  setShowMenu(false);
                  // handle delete logic
                  console.log("Delete clicked");
                   setConfirmDelete(true);
                }}
                className=" w-full text-sm text-red-600 hover:bg-gray-100 px-4 py-2 flex justify-center items-center"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      )}

        {/* Confirm Delete Popup */}
        {confirmDelete && (
          <div className="fixed top-0 left-0 w-full h-full bg-transparent  backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <p className="text-gray-800 mb-4">Are you sure you want to delete this task?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  No
                </button>
                <button
                  onClick={deleteTask}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* update form  */}
        {showUpdateForm && (
  <div className="fixed top-0 left-0 w-full h-full bg-transparent  backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-[350px]">
      <h2 className="text-lg font-semibold mb-4">Update Task</h2>

      <input
        type="text"
        className="w-full mb-2 p-2 border rounded"
        placeholder="Title"
        value={updatedTitle}
        onChange={(e) => setUpdatedTitle(e.target.value)}
      />
      <textarea
        className="w-full mb-2 p-2 border rounded"
        placeholder="Description"
        value={updatedDescription}
        onChange={(e) => setUpdatedDescription(e.target.value)}
      />
      <label className="flex items-center mb-4 gap-2">
        <input
          type="checkbox"
          checked={updatedIsCompleted}
          onChange={(e) => setUpdatedIsCompleted(e.target.checked)}
        />
        Mark as completed
      </label>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowUpdateForm(false)}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={updateTask}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}



         </div>


    </div>
  );
};

export default TaskItem;