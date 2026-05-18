import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

function ManagerDashboard() {

  const navigate = useNavigate();

  const [goals, setGoals] = useState([]);

  useEffect(() => {

    fetchGoals();

  }, []);

  const fetchGoals = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/goals/all",
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

  const approveGoal = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/goals/approve/${id}`,
        {},
        {
          headers: {
            authorization: token
          }
        }
      );

      fetchGoals();

    } catch (error) {

      console.log(error);

    }
  };

  const addComment = async (
    id,
    managerComment
  ) => {

    try {

      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/goals/comment/${id}`,
        {
          managerComment
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

  const unlockGoal = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/goals/unlock/${id}`,
        {},
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

      <h1>Manager Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>

      <br /><br />

      {goals.map((goal) => (

        <div
          key={goal._id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "15px"
          }}
        >

          <h3>{goal.title}</h3>

          <p>{goal.description}</p>

          <p>Status: {goal.status}</p>

          <p>
            Employee: {goal.employeeId?.name}
          </p>

          <br />

          <textarea
            placeholder="Manager Comment"
            onChange={(e) =>
              goal.commentInput =
                e.target.value
            }
          />

          <br /><br />

          <button
            onClick={() =>
              addComment(
                goal._id,
                goal.commentInput
              )
            }
          >

            Save Comment

          </button>

          <br /><br />

          <p>
            Comment:
            {goal.managerComment}
          </p>

          {goal.status !== "approved" && (
            <button
              onClick={() =>
                approveGoal(goal._id)
              }
            >
              Approve
            </button>
          )}

          {goal.status === "approved" && (

            <button
              onClick={() =>
                unlockGoal(goal._id)
              }
            >

              Unlock Goal

            </button>

          )}

        </div>

      ))}

    </div>
  );
}

export default ManagerDashboard;