import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] =
    useState("employee");

  const handleRegister = async () => {

    try {

      await axios.post(
        "https://goal-tracker-hackathon.vercel.app//api/auth/register",
        {
          name,
          email,
          password,
          role
        }
      );

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {

      console.log(error.response.data);

      alert("Registration Failed");

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

      <h1>Register</h1>

      <br />

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <br /><br />

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

      <select
        value={role}
        onChange={(e) =>
          setRole(e.target.value)
        }
      >

        <option value="employee">
          Employee
        </option>

        <option value="manager">
          Manager
        </option>

      </select>

      <br /><br />

      <button onClick={handleRegister}>
        Register
      </button>

    </div>
  );
}

export default Register;