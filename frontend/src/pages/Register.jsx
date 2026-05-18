import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      const role = response.data.user.role;

      if (role === "manager") {

        navigate("/manager");

      } else {

        navigate("/dashboard");

      }

    } catch (error) {

      console.log(error.response.data);

      alert("Invalid Credentials");

    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-2xl w-[400px]">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Login
        </h1>

        <input
          className="w-full p-3 rounded bg-zinc-800 mb-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="w-full p-3 rounded bg-zinc-800 mb-6"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 py-3 rounded-lg text-lg font-semibold"
        >

          Login

        </button>

        <p className="mt-6 text-center text-zinc-400">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-400 ml-2"
          >

            Register

          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;