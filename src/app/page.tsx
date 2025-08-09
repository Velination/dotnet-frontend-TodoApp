'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
   const [formData, setFormData] = useState({ fullname: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading ] = useState(false);
  const [message, setMessage ] = useState('');
  const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState("");
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [showLoginPassword, setShowLoginPassword] = useState(false);


  // signup handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
     setError("");

 if (!formData.fullname || !formData.email || !formData.password || !formData.confirmPassword) {
    setMessage(' All fields are required');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setMessage(' Passwords do not match.');
    return;
  }

  setLoading(true);
  setMessage('');

    try {
      const res = await fetch('https://dotnet-backend-todoapp.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( formData ),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      // Success
      setMessage('✅ Signup successful!');
      
      // Delay and switch to login state
      setTimeout(() => {
        setIsLogin(true);
        setMessage('');
      }, 2000);

    } catch (error: any) {
      setMessage(` ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  // login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://dotnet-backend-todoapp.onrender.com/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
      } else {
        // Save token to local storage
        localStorage.setItem("token", data.token);

        // Redirect 
        window.location.href = "/dashboard"; 
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
   
   <div className="w-full h-screen flex items-center justify-center bg-gray-100 overflow-hidden relative">
     <div className="relative w-full max-w-5xl h-[600px] rounded-lg shadow-lg overflow-hidden flex transition-all duration-700 ease-in-out">
        {!isLogin ? (
         <div className="flex h-screen w-screen">
       {/* Left Side with Image */}
    <div className="w-1/2 h-full relative hidden md:block ">
      <Image
        src="" // Replace with your actual image path
        alt="Signup"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center text-white text-3xl font-bold">
        Welcome Back!
      </div>
    </div>

    {/* Right Side with Centered Form */}
    <div className="w-full md:w-1/2 h-screen flex pt-10 justify-center bg-white px-6  ">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center ">Sign Up</h2>
        <form className="space-y-5" onSubmit={handleSignup}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your username"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
           <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
          </button>
        </div>
      </div>


         <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {showConfirmPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} /> }
          </button>
        </div>
      </div>



          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Show success or error message */}
        {message && (
         <p className="mt-4 text-sm text-center text-green-500">{message}</p>
          )}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
         <button onClick={() => setIsLogin(true)} className="underline">Login</button> 
        </p>
      </div>
    </div>


    </div>
        ) : (
          <div className="w-full h-full flex">
            {/* Left Side (Black) with Login Form */}
            
             <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-white px-6 py-10">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Log in </h2>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
         

          <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showLoginPassword ? 'text' : 'password'}
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowLoginPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {showLoginPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
          </button>
        </div>
      </div>

           {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
             disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-sm">
                Dont have an account?{' '}
                <button onClick={() => setIsLogin(false)} className="underline">Sign Up</button>
              </p>
      </div>
    </div>

            {/* Right Side (White) with Image */}
            <div className="w-1/2 bg-black  items-center justify-center hidden md:block">
              <Image
                src=""
                alt="Login Illustration"
                width={350}
                height={400}
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
}


