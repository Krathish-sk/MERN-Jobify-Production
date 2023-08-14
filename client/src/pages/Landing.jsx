import main from "../assets/images/main.svg";
import { Logo } from "../components";
import Wrapper from "../assets/wrappers/LandingPage";
import { Link, Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import React from "react";

export default function Landing() {
  const { user } = useAppContext();
  return (
    <React.Fragment>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          {/* Info Content */}
          <div className="info">
            <h1>
              Job <span>Tracking </span>App
            </h1>
            <p>
              Track all of you're job applications with a single click anytime
              and anywhere.Simplify your job search and land next position
              sooner with Jobify. Jobify will help you organize any intresting
              positions you find on job boards and make sure you follow through
              them.
              <br />
              Break into tech and land a better-paying job.
            </p>
            <Link to="/register" className="btn btn-hero">
              Login/Register
            </Link>
          </div>
          {/* Image Content */}
          <img src={main} alt="Main pic" className="img main-img" />
        </div>
      </Wrapper>
    </React.Fragment>
  );
}
