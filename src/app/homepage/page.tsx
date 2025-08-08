// File: /pages/Dashboard.tsx

"use client"
import React, {useState} from 'react';
import Sidebar from '@/components/sidebar/sidebar';
import TaskList from '@/components/tasks/taskList';

const Dashboard: React.FC = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <TaskList />
    </div>
  );
};

export default Dashboard;
