import React, { useState, useEffect } from "react";

const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

const HOURS = [
  "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
  "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
  "6 PM", "7 PM", "8 PM", "9 PM", "10 PM",
  "11 PM", "12 AM",
];

const loadFont = () => {
  if (!document.getElementById("orbitron-font")) {
    const link = document.createElement("link");
    link.id = "orbitron-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap";
    document.head.appendChild(link);
  }
};
loadFont();

export default function App() {
  const turquoise = "#40e0d0";

  const defaultVars = {
    "--bg-color": "#0d1117",
    "--text-color": turquoise,
    "--secondary-text": "#8b949e",
    "--input-bg": "#161b22",
    "--input-color": turquoise,
    "--button-bg": turquoise,
    "--button-hover-bg": "#32cfc9",
    "--glow-color": turquoise,
  };

  // Points state
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem("points");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Point animation state
  const [pointAnim, setPointAnim] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  // Todos state
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  // Selected day from dropdown
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);

  // Selected hour for new todo
  const [selectedHour, setSelectedHour] = useState(HOURS[0]);

  // Text input for new task
  const [inputText, setInputText] = useState("");

  // Dark mode toggle
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });

  // Glow animation on add
  const [glowingId, setGlowingId] = useState(null);

  // Congratulation popup
  const [showCongrats, setShowCongrats] = useState(false);

  // === CUSTOM CSS INPUT WITH SANITIZER & WARNING ===
  const [customCSS, setCustomCSS] = useState(() => localStorage.getItem("customCSS") || "");
  const [warning, setWarning] = useState("");

  function sanitizeCSS(input) {
    let sanitized = input;

    const disallowedProps = [
      /position\s*:\s*fixed\s*;?/gi,
      /display\s*:\s*none\s*;?/gi,
      /visibility\s*:\s*hidden\s*;?/gi,
      /z-index\s*:\s*\d+\s*;?/gi,
      /pointer-events\s*:\s*none\s*;?/gi,
      /opacity\s*:\s*0\s*;?/gi,
      /overflow\s*:\s*hidden\s*;?/gi,
    ];

    disallowedProps.forEach(pattern => {
      sanitized = sanitized.replace(pattern, "");
    });

    sanitized = sanitized.replace(/@import[^;]+;/gi, "");
    sanitized = sanitized.replace(/@font-face\s*{[^}]*}/gi, "");
    sanitized = sanitized.replace(/@keyframes\s+[^{]+{[^}]*}/gi, "");
    sanitized = sanitized.replace(/@-webkit-keyframes\s+[^{]+{[^}]*}/gi, "");
    sanitized = sanitized.replace(/@-moz-keyframes\s+[^{]+{[^}]*}/gi, "");
    sanitized = sanitized.replace(/@-o-keyframes\s+[^{]+{[^}]*}/gi, "");
    sanitized = sanitized.replace(/expression\s*\([^)]*\)/gi, "");

    return sanitized;
  }

  function handleCSSChange(value) {
    const disallowedCheck = [
      /position\s*:\s*fixed\s*;?/i,
      /display\s*:\s*none\s*;?/i,
      /visibility\s*:\s*hidden\s*;?/i,
      /z-index\s*:\s*\d+\s*;?/i,
      /pointer-events\s*:\s*none\s*;?/i,
      /opacity\s*:\s*0\s*;?/i,
      /overflow\s*:\s*hidden\s*;?/i,
      /@import/i,
      /@font-face/i,
      /@keyframes/i,
      /expression\s*\(/i,
    ];

    const found = disallowedCheck.some(pattern => pattern.test(value));
    if (found) {
      setWarning("Warning: Some CSS properties or rules you entered were removed for safety.");
    } else {
      setWarning("");
    }

    const sanitized = sanitizeCSS(value);
    setCustomCSS(sanitized);
  }

  useEffect(() => {
    localStorage.setItem("customCSS", customCSS);
  }, [customCSS]);

  useEffect(() => {
    let styleTag = document.getElementById("custom-style");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "custom-style";
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = customCSS
      ? `#custom-css-container { ${customCSS} }`
      : "";
  }, [customCSS]);

  // Save/load points, todos, dark mode
  useEffect(() => {
    localStorage.setItem("points", points);
  }, [points]);
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(defaultVars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    if (darkMode) {
      root.style.setProperty("--bg-color", "#0d1117");
      root.style.setProperty("--text-color", turquoise);
      root.style.setProperty("--secondary-text", "#8b949e");
      root.style.setProperty("--input-bg", "#161b22");
      root.style.setProperty("--input-color", turquoise);
      root.style.setProperty("--button-bg", turquoise);
      root.style.setProperty("--button-hover-bg", "#32cfc9");
      root.style.setProperty("--glow-color", turquoise);
    } else {
      root.style.setProperty("--bg-color", "#f5f5f7");
      root.style.setProperty("--text-color", "#222222");
      root.style.setProperty("--secondary-text", "#555555");
      root.style.setProperty("--input-bg", "#ffffff");
      root.style.setProperty("--input-color", "#222222");
      root.style.setProperty("--button-bg", "#40e0d0");
      root.style.setProperty("--button-hover-bg", "#32cfc9");
      root.style.setProperty("--glow-color", "#40e0d0");
    }
  }, [darkMode]);

  useEffect(() => {
    if (glowingId === null) return;
    const timeout = setTimeout(() => setGlowingId(null), 1500);
    return () => clearTimeout(timeout);
  }, [glowingId]);

  useEffect(() => {
    if (!pointAnim) return;
    const timeout = setTimeout(() => setPointAnim(null), 1500);
    return () => clearTimeout(timeout);
  }, [pointAnim]);

  useEffect(() => {
    if (!showCongrats) return;
    const timeout = setTimeout(() => setShowCongrats(false), 2000);
    return () => clearTimeout(timeout);
  }, [showCongrats]);

  function addPoints(amount) {
    setPoints((prev) => prev + amount);
    setPointAnim(`+${amount}`);
    setAnimKey((k) => k + 1);
  }

  function addTodo() {
    if (!inputText.trim()) return;
    const newTodo = {
      id: Date.now(),
      day: selectedDay,
      hour: selectedHour,
      text: inputText.trim(),
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInputText("");
    setGlowingId(newTodo.id);
    addPoints(5);
  }

  function toggleComplete(id) {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          if (!todo.completed) {
            addPoints(10);
            setShowCongrats(true);
          }
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function todosForHour(hour) {
    return todos.filter((todo) => todo.day === selectedDay && todo.hour === hour);
  }

  const bgColor = "var(--bg-color)";
  const textColor = "var(--text-color)";
  const secondaryText = "var(--secondary-text)";
  const inputBg = "var(--input-bg)";
  const inputColor = "var(--input-color)";
  const buttonBg = "var(--button-bg)";
  const buttonHoverBg = "var(--button-hover-bg)";
  const glowColor = "var(--glow-color)";

  function resetCustomCSS() {
    setCustomCSS("");
    setWarning("");
  }

  return (
    <div
      id="custom-css-container"
      style={{
        maxWidth: 700,
        margin: "20px auto",
        fontFamily: "'Orbitron', monospace, monospace",
        backgroundColor: bgColor,
        color: textColor,
        padding: 24,
        borderRadius: 12,
        minHeight: "100vh",
        boxSizing: "border-box",
        userSelect: "none",
        transition: "background-color 0.3s ease, color 0.3s ease",
        position: "relative",
      }}
    >
      {/* Title & Points */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontWeight: "500",
            fontSize: 28,
            letterSpacing: "0.15em",
            margin: 0,
            userSelect: "text",
            color: turquoise,
          }}
        >
          Aaron's Planner
        </h1>

        <div
          style={{
            backgroundColor: buttonBg,
            color: "white",
            padding: "10px 18px",
            borderRadius: 20,
            fontWeight: "700",
            fontSize: 16,
            letterSpacing: "0.1em",
            userSelect: "none",
            boxShadow: `0 0 10px 3px ${glowColor}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 90,
            justifyContent: "center",
            fontFamily: "'Orbitron', monospace, monospace",
          }}
          aria-label={`You have ${points} points`}
        >
          Points: {points}
          {pointAnim && (
            <span
              key={animKey}
              style={{
                color: "#ffffff",
                fontWeight: "700",
                fontSize: 18,
                animation: "pointGainAnim 1.5s ease forwards",
                userSelect: "none",
                textShadow: `0 0 8px ${glowColor}`,
              }}
              aria-live="polite"
            >
              {pointAnim}
            </span>
          )}
        </div>
      </header>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          backgroundColor: buttonBg,
          color: "white",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: 14,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          transition: "background-color 0.25s ease",
          userSelect: "none",
          marginBottom: 20,
          display: "block",
          marginLeft: "auto",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverBg)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonBg)}
        aria-label="Toggle light/dark mode"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* CUSTOM CSS INPUT */}
      <section
        style={{
          marginBottom: 20,
          backgroundColor: inputBg,
          padding: 12,
          borderRadius: 8,
          userSelect: "text",
        }}
      >
        <label
          htmlFor="custom-css"
          style={{ color: secondaryText, fontWeight: "600", marginBottom: 6, display: "block" }}
        >
          Paste your custom CSS here:
        </label>
        <textarea
          id="custom-css"
          value={customCSS}
          onChange={(e) => handleCSSChange(e.target.value)}
          placeholder="e.g., body { background-color: #123456; } .task { font-style: italic; }"
          rows={6}
          style={{
            width: "100%",
            backgroundColor: inputBg,
            color: inputColor,
            fontFamily: "monospace",
            borderRadius: 8,
            padding: 10,
            border: "none",
            resize: "vertical",
            fontSize: 14,
            userSelect: "text",
          }}
          aria-label="Custom CSS input"
        />
        {warning && (
          <p
            style={{ color: "#ff5555", marginTop: 6, fontWeight: "600" }}
            role="alert"
            aria-live="assertive"
          >
            {warning}
          </p>
        )}
        <button
          onClick={resetCustomCSS}
          style={{
            marginTop: 10,
            backgroundColor: buttonBg,
            border: "none",
            padding: "8px 14px",
            color: "white",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "600",
            letterSpacing: "0.1em",
            userSelect: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonBg)}
          aria-label="Reset custom CSS"
        >
          Reset Custom CSS
        </button>
      </section>

      {/* Add task controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 28,
          flexWrap: "wrap",
          userSelect: "text",
        }}
      >
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "none",
            backgroundColor: inputBg,
            color: inputColor,
            flexGrow: 1,
            minWidth: 140,
            fontWeight: "500",
            letterSpacing: "0.05em",
            fontSize: 15,
            cursor: "pointer",
            userSelect: "text",
          }}
          aria-label="Select day"
        >
          {DAYS.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <select
          value={selectedHour}
          onChange={(e) => setSelectedHour(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "none",
            backgroundColor: inputBg,
            color: inputColor,
            flexGrow: 1,
            minWidth: 120,
            fontWeight: "500",
            letterSpacing: "0.05em",
            fontSize: 15,
            cursor: "pointer",
            userSelect: "text",
          }}
          aria-label="Select hour"
        >
          {HOURS.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Add task..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
          style={{
            flexGrow: 3,
            padding: 10,
            borderRadius: 8,
            border: "none",
            backgroundColor: inputBg,
            color: inputColor,
            fontWeight: "500",
            letterSpacing: "0.05em",
            fontSize: 15,
            userSelect: "text",
          }}
          aria-label="Task description input"
        />

        <button
          onClick={addTodo}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            backgroundColor: buttonBg,
            color: "white",
            cursor: "pointer",
            fontWeight: "700",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            userSelect: "none",
            boxShadow: glowingId ? `0 0 20px 6px ${glowColor}` : "none",
            animation: glowingId ? "glowPulse 1.5s ease" : "none",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonBg)}
          aria-label="Add task"
        >
          Add
        </button>
      </div>

      {/* Tasks for selected day */}
      <section>
        {HOURS.map((hour) => {
          const hourTodos = todosForHour(hour);
          return (
            <div
              key={`${selectedDay}-${hour}`}
              style={{
                marginBottom: 16,
                padding: "12px 16px",
                borderRadius: 10,
                backgroundColor: darkMode ? "#121b26" : "#e3e8eb",
                userSelect: "text",
              }}
              aria-label={`${selectedDay} at ${hour}`}
            >
              <div
                style={{
                  fontWeight: "700",
                  marginBottom: 8,
                  color: darkMode ? turquoise : "#106267",
                  fontSize: 15,
                  userSelect: "text",
                }}
              >
                {hour}
              </div>

              {hourTodos.length === 0 ? (
                <em
                  style={{
                    color: secondaryText,
                    fontSize: 13,
                    userSelect: "none",
                  }}
                >
                  No tasks
                </em>
              ) : (
                hourTodos.map((todo) => (
                  <div
                    key={todo.id}
                    style={{
                      backgroundColor: todo.completed
                        ? darkMode
                          ? "#303030"
                          : "#c7d2d8"
                        : inputBg,
                      borderRadius: 8,
                      marginBottom: 8,
                      padding: "8px 12px",
                      boxShadow: todo.completed ? `0 0 10px 2px ${glowColor}` : "none",
                      userSelect: "text",
                      cursor: "default",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 14,
                      color: todo.completed ? "#aaaaaa" : inputColor,
                      textDecoration: todo.completed ? "line-through" : "none",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    <span>{todo.text}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => toggleComplete(todo.id)}
                        aria-label={
                          todo.completed ? "Mark task as incomplete" : "Mark task as complete"
                        }
                        title={todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
                        style={{
                          cursor: "pointer",
                          border: "none",
                          backgroundColor: todo.completed ? "#444" : turquoise,
                          color: "white",
                          borderRadius: 6,
                          padding: "2px 6px",
                          fontSize: 12,
                          userSelect: "none",
                          fontWeight: "700",
                        }}
                      >
                        {todo.completed ? "Undo" : "Done"}
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        aria-label="Delete task"
                        title="Delete task"
                        style={{
                          cursor: "pointer",
                          border: "none",
                          backgroundColor: "#ff4444",
                          color: "white",
                          borderRadius: 6,
                          padding: "2px 6px",
                          fontSize: 12,
                          userSelect: "none",
                          fontWeight: "700",
                        }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </section>

      {/* Congratulations popup */}
      {showCongrats && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: turquoise,
            color: bgColor,
            padding: "18px 32px",
            borderRadius: 16,
            fontWeight: "700",
            fontSize: 24,
            boxShadow: `0 0 20px 6px ${turquoise}`,
            userSelect: "none",
            zIndex: 10000,
            animation: "fadeInOut 2s ease forwards",
          }}
        >
          🎉 Congratulations! Task completed! 🎉
        </div>
      )}

      <style>{`
        @keyframes glowPulse {
          0% {
            box-shadow: 0 0 6px 2px transparent;
          }
          50% {
            box-shadow: 0 0 12px 4px var(--glow-color);
          }
          100% {
            box-shadow: 0 0 6px 2px transparent;
          }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes pointGainAnim {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
