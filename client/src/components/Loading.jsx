import React from "react";

const Loading = ({ center }) => {
  // Spinner style
  const spinnerStyle = {
    width: "64px",
    height: "64px",
    border: "6px solid #ccc",
    borderTop: "6px solid #2e86de", // Spinner color
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  // Centering overlay style
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.5)",
    zIndex: 9999,
  };

  return (
    <>
      {center ? (
        <div style={overlayStyle}>
          <div style={spinnerStyle}></div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={spinnerStyle}></div>
        </div>
      )}

      {/* Inline keyframes animation */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default Loading;
