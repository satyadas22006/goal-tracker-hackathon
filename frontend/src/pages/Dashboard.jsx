import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

function Dashboard() {

  const navigate = useNavigate();

  const [goals, setGoals] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [thrustArea, setThrustArea] =
    useState("");

  const [uom, setUom] =
    useState("numeric");

  const [target, setTarget] =
    useState("");

  const [weightage, setWeightage] =
    useState("");

  useEffect(() => {

    fetchGoals();

  }, []);

  const fetchGoals = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        "https://goal-tracker-hackathon.vercel.app//api/goals",
        {
          headers: {
            authorization: token
          }
        }
      );

      setGoals(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const createGoal = async () => {

    try {

      const token =
        localStorage.getItem("token");

      await axios.post(
        "https://goal-tracker-hackathon.vercel.app//api/goals",
        {
          title,
          description,
          thrustArea,
          uom,
          target,
          weightage
        },
        {
          headers: {
            authorization: token
          }
        }
      );

      fetchGoals();

    } catch (error) {

      console.log(error.response.data);

    }

  };

  const updateGoal = async (
    id,
    actualAchievement,
    checkInStatus
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await axios.patch(
        `https://goal-tracker-hackathon.vercel.app//api/goals/update/${id}`,
        {
          actualAchievement,
          checkInStatus
        },
        {
          headers: {
            authorization: token
          }
        }
      );

      fetchGoals();

    } catch (error) {

      console.log(error.response.data);

    }

  };

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return (
    <div style={{ padding: "30px" }}>

      <h1>Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>

      <br /><br />

      <input
        type="text"
        placeholder="Goal Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <br /><br />

      <textarea
        placeholder="Goal Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="Thrust Area"
        value={thrustArea}
        onChange={(e) =>
          setThrustArea(e.target.value)
        }
      />

      <br /><br />

      <select
        value={uom}
        onChange={(e) =>
          setUom(e.target.value)
        }
      >

        <option value="numeric">
          Numeric
        </option>

        <option value="percentage">
          Percentage
        </option>

      </select>

      <br /><br />

      <input
        type="number"
        placeholder="Target"
        value={target}
        onChange={(e) =>
          setTarget(e.target.value)
        }
      />

      <br /><br />

      <input
        type="number"
        placeholder="Weightage"
        value={weightage}
        onChange={(e) =>
          setWeightage(e.target.value)
        }
      />

      <br /><br />

      <button onClick={createGoal}>
        Create Goal
      </button>

      <br /><br />

      <h2>Your Goals</h2>

      {goals.map((goal) => (

        <div
          key={goal._id}
          style={{
            border: "1px solid gray",
            padding: "20px",
            marginBottom: "20px"
          }}
        >

          <h3>{goal.title}</h3>

          <p>{goal.description}</p>

          <p>
            Progress:
            {" "}
            {goal.progress}%
          </p>

          <p>
            Status:
            {" "}
            {goal.status}
          </p>

          <input
            type="number"
            placeholder="Achievement"
            onChange={(e) =>
              goal.actualAchievementInput =
                e.target.value
            }
          />

          <br /><br />

          <select
            onChange={(e) =>
              goal.checkInStatusInput =
                e.target.value
            }
          >

            <option value="on-track">
              On Track
            </option>

            <option value="completed">
              Completed
            </option>

          </select>

          <br /><br />

          <button
            onClick={() =>
              updateGoal(
                goal._id,
                goal.actualAchievementInput,
                goal.checkInStatusInput
              )
            }
          >

            Update Goal

          </button>

        </div>

      ))}

    </div>
  );
}

export default Dashboard;