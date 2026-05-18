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
        "https://goal-tracker-hackathon.vercel.app//api/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      if (
        response.data.user.role === "manager"
      ) {

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
    <div style={{ padding: "40px" }}>

      <nav style={{ marginBottom: "30px" }}>

        <Link to="/login">
          Login
        </Link>

        {" | "}

        <Link to="/register">
          Register
        </Link>

      </nav>

      <h1>Login</h1>

      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
}

export default Login;