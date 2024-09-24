import { ErrorOutline } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notFound">
      <div className="notFoundContainer">
        {/* <Typography variant="h3">Oops...</Typography> */}
        {/* <img src={notFound} alt="Not Found" /> */}
        <ErrorOutline   style={{ color: "red"}}/>
        <Typography variant="h2" style={{ padding: "2vmax" }}>
          Oops...Page Not Found
        </Typography>

        <Link to="/">
          <Typography variant="h5">Go to Home</Typography>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;