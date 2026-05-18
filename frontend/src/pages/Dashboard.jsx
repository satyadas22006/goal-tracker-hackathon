import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {

  const navigate = useNavigate();

  const [goals, setGoals] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [thrustArea, setThrustArea] = useState("");
  const [uom, setUom] = useState("numeric");

  const [target, setTarget] = useState("");
  const [weightage, setWeightage] = useState("");

  useEffect(() => {

    fetchGoals();

  }, []);

  const fetchGoals = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "goal-tracker-hackathon-production.up.railway.app/api/goals",
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

      const token = localStorage.getItem("token");

      await axios.post(
        "goal-tracker-hackathon-production.up.railway.app/api/goals",
        {
          title,
          description,
          thrustArea,
          uom,
          target: Number(target),
          weightage: Number(weightage)
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

      const token = localStorage.getItem("token");

      await axios.patch(
        `goal-tracker-hackathon-production.up.railway.app/api/goals/update/${id}`,
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
    <div className="min-h-screen bg-black text-white p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-5xl font-bold">
          Employee Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 px-5 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

      <div className="bg-zinc-900 p-6 rounded-xl mb-10">

        <h2 className="text-2xl font-semibold mb-5">
          Create Goal
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            className="p-3 rounded bg-zinc-800"
            type="text"
            placeholder="Goal Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <input
            className="p-3 rounded bg-zinc-800"
            type="text"
            placeholder="Thrust Area"
            value={thrustArea}
            onChange={(e) =>
              setThrustArea(e.target.value)
            }
          />

          <textarea
            className="p-3 rounded bg-zinc-800 md:col-span-2"
            placeholder="Goal Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <select
            className="p-3 rounded bg-zinc-800"
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

            <option value="timeline">
              Timeline
            </option>

            <option value="zero">
              Zero-Based
            </option>

          </select>

          <input
            className="p-3 rounded bg-zinc-800"
            type="number"
            placeholder="Target"
            value={target}
            onChange={(e) =>
              setTarget(e.target.value)
            }
          />

          <input
            className="p-3 rounded bg-zinc-800"
            type="number"
            placeholder="Weightage"
            value={weightage}
            onChange={(e) =>
              setWeightage(e.target.value)
            }
          />

        </div>

        <button
          onClick={createGoal}
          className="mt-5 bg-blue-500 px-6 py-3 rounded-lg"
        >
          Create Goal
        </button>

      </div>

      <h2 className="text-3xl font-bold mb-6">
        Your Goals
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {goals.map((goal) => (

          <div
            key={goal._id}
            className="bg-zinc-900 p-5 rounded-xl"
          >

            <h3 className="text-2xl font-semibold mb-2">
              {goal.title}
            </h3>

            <p className="text-zinc-400 mb-3">
              {goal.description}
            </p>

            <p>
              <strong>Thrust Area:</strong>
              {" "}
              {goal.thrustArea}
            </p>

            <p>
              <strong>Target:</strong>
              {" "}
              {goal.target}
            </p>

            <p>
              <strong>Weightage:</strong>
              {" "}
              {goal.weightage}%
            </p>

            <p>
              <strong>Progress:</strong>
              {" "}
              {goal.progress.toFixed(0)}%
            </p>

            <p>
              <strong>Status:</strong>
              {" "}
              {goal.status}
            </p>

            <p>
              <strong>Check-In:</strong>
              {" "}
              {goal.checkInStatus}
            </p>

            <p>
              <strong>Manager Comment:</strong>
              {" "}
              {goal.managerComment || "None"}
            </p>

            <div className="mt-5">

              <input
                className="p-3 rounded bg-zinc-800 w-full mb-3"
                type="number"
                placeholder="Achievement"
                onChange={(e) =>
                  goal.actualAchievementInput =
                    e.target.value
                }
              />

              <select
                className="p-3 rounded bg-zinc-800 w-full mb-3"
                onChange={(e) =>
                  goal.checkInStatusInput =
                    e.target.value
                }
              >

                <option value="not-started">
                  Not Started
                </option>

                <option value="on-track">
                  On Track
                </option>

                <option value="completed">
                  Completed
                </option>

              </select>

              <button
                onClick={() =>
                  updateGoal(
                    goal._id,
                    Number(
                      goal.actualAchievementInput
                    ),
                    goal.checkInStatusInput
                  )
                }
                className="bg-green-500 px-5 py-2 rounded-lg"
              >

                Update Progress

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Dashboard;