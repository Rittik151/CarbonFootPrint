import React, { useState, useEffect } from "react";

const FixedServerTimer = ({ isButton = false }) => {
  const [timeString, setTimeString] = useState("");
  const [faded, setFaded] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const date = String(now.getDate()).padStart(2, "0");
      const day = days[now.getDay()];
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      setTimeString(
        `${year}-${month}-${date} (${day})\n${hours}:${minutes}:${seconds} +05:30`,
      );
    };

    updateTimer(); // run immediately
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval); // cleanup
  }, []);

  if (isButton) {
    return (
      <div
        style={{
          ...styles.timerButton,
          opacity: faded ? 0.3 : 1,
          transform: hovering ? "scale(1.05)" : "scale(1)",
          background: hovering
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(255, 255, 255, 0.1)",
          borderColor: hovering
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(255, 255, 255, 0.3)",
        }}
        onClick={() => setFaded(!faded)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        title="Click to toggle"
      >
        {timeString.split("\n").map((line, index) => (
          <div key={index} style={styles.line}>
            {line}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.timer,
          ...(faded ? styles.faded : {}),
        }}
        onClick={() => setFaded(!faded)}
      >
        {timeString.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111",
  },
  timer: {
    position: "relative",
    width: "200px",
    height: "120px",
    padding: "20px",
    backgroundImage:
      'url("https://img.atcoder.jp/assets/contest/digitalclock.png")',
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    textAlign: "center",
    fontSize: "15px",
    cursor: "pointer",
    userSelect: "none",
    color: "white",
    fontFamily: "monospace",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "opacity 0.3s ease",
  },
  timerButton: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "8px",
    padding: "10px 15px",
    textAlign: "center",
    fontSize: "12px",
    cursor: "pointer",
    userSelect: "none",
    color: "#fff",
    fontFamily: "monospace",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },
  line: {
    margin: "2px 0",
  },
};

export default FixedServerTimer;
