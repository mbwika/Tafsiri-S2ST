
// const handleLogin = async (e) => {
//   e.preventDefault();

//   const form = e.target;
//   const username = form.username.value;
//   const password = form.password.value;

//   try {
//     const response = await fetch("http://localhost:3000/api/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ username, password })
//     });

//     const result = await response.json();

//     if (response.ok) {
//       // Handle successful login (e.g., save token or redirect)
//       alert("Login successful");
//       // localStorage.setItem("token", result.token);
//     } else {
//       alert(result.message || "Login failed");
//     }
//   } catch (err) {
//     console.error("Login error:", err);
//     alert("An error occurred. Try again later.");
//   }
// };


// import React, { useState } from 'react';

// const LoginForm = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       console.log('Login success!', data);
//       // Redirect or store token as needed
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
        
//         {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}
        
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-gray-600 mb-1" htmlFor="username">Username</label>
//             <input
//               type="text"
//               id="username"
//               className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600 mb-1" htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition-all"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-500 mt-4">
//           Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;
