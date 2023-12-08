import { Player } from "@lottiefiles/react-lottie-player";
import { CircularProgress } from "@mui/material";
import React from "react";

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="inherit" />
    </div>
  );
}

export default Loader;
