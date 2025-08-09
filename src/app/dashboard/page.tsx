"use client";

import  React ,{ useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar/sidebar';
import TaskList from '@/components/tasks/taskList';


export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // prevent showing dashboard too early
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
   const [refreshTasks, setRefreshTasks] = useState(false);

   const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

   const triggerTaskRefresh = () => setRefreshTasks(prev => !prev);

  useEffect(() => {
    
    const storedToken = localStorage.getItem("token");
console.log("Token in localStorage:", storedToken);

    // If no token, redirect immediately
    if (!storedToken) {
      router.push("/");
      return;
    }



    const verifyToken = async () => {
      try {
        const response = await fetch("https://dotnet-backend-todoapp.onrender.com/api/auth/protected-route", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
            setLoading(false); 
          // Token is invalid or expired
          localStorage.removeItem("token");
          router.push("/");
        } else {
          setToken(storedToken);
          setLoading(false); // Only show page if token is valid
        }
      } catch (error) {
        console.error("Auth check failed", error);
        router.push("/");
      }
    };

    verifyToken();
  }, [router]);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  return (
   
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} token={token} onTaskAdded={triggerTaskRefresh} />
      {token && <TaskList token={token} refreshTrigger={refreshTasks} />}
    </div>
    
  );
}








