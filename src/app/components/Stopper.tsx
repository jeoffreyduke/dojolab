import { useMediaQuery } from "@mui/material";
import React from "react";

function Stopper() {
  const isMobile = useMediaQuery("(max-width: 576px)");

  return (
    <div>{isMobile && <div style={{ height: "10rem", width: "100%" }} />}</div>
  );
}

export default Stopper;
