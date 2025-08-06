"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // prevent showing dashboard too early

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token, redirect immediately
    if (!token) {
      router.push("/");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch("http://localhost:5167/api/auth/protected-route", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
            setLoading(false); 
          // Token is invalid or expired
          localStorage.removeItem("token");
          router.push("/");
        } else {
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

  return <div>Hello, welcome to your dashboard!</div>;
}
