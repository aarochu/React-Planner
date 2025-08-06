import { useState, useEffect } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const hours = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
  "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
  "12:00 AM"
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("weekly-planner-tasks");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("weekly-planner-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (key, value) => {
    setTasks((prev) => ({ ...prev, [key]: value }));
  };

  const handleDelete = (key) => {
    const updated = { ...tasks };
    delete updated[key];
    setTasks(updated);
  };

  return (
    <div className="app">
      <h1>Aaron's Weekly Planner</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour}>
                <td className="time-cell">{hour}</td>
                {days.map((day) => {
                  const key = `${day}-${hour}`;
                  return (
                    <td key={key}>
                      <textarea
                        placeholder="Enter task..."
                        value={tasks[key] || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="task-textarea"
                      />
                      {tasks[key] && (
                        <button
                          onClick={() => handleDelete(key)}
                          className="delete-btn"
                          title="Delete task"
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
