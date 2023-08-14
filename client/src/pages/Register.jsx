import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, FormRow, Alert } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from "../context/appContext";

// Initial States
const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

export default function Register() {
  const [values, setValues] = useState(initialState);

  // globalState and Navigate
  const { showAlert, isLoading, displayAlert, user, setupUser } =
    useAppContext();
  const navigate = useNavigate();

  // Toggle Member for Login/Register purpose
  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  // Handle inputfield changes
  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  // Handle Submit
  function onSubmit(e) {
    e.preventDefault();
    const { name, email, password, isMember } = values;

    // No Input Data case
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password };
    if (isMember) {
      setupUser({
        currentUser,
        endPoint: "login",
        alertText: "Login Success !! Redirecting...",
      });
    } else {
      setupUser({
        currentUser,
        endPoint: "register",
        alertText: "User Created !! Redirecting...",
      });
    }
  }

  // Navigate to dashboard if user login's or register's
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form onSubmit={onSubmit} className="form">
        <Logo />
        <h3>{values.isMember ? "Login" : "Register"}</h3>

        {showAlert && <Alert />}

        {/* Name Field */}
        {!values.isMember && (
          <FormRow
            name="name"
            type="text"
            handleChange={handleChange}
            value={values.name}
          />
        )}

        {/* Email Field */}
        <FormRow
          name="email"
          type="email"
          handleChange={handleChange}
          value={values.email}
        />

        {/* Password Field */}
        <FormRow
          name="password"
          type="password"
          handleChange={handleChange}
          value={values.password}
        />

        <button className="btn btn-block" type="submit">
          Submit
        </button>

        {/* Demo User Login */}
        <button
          type="button"
          className="btn btn-block btn-hipster"
          disabled={isLoading}
          onClick={() => {
            setupUser({
              currentUser: { email: "demoUser@demo.com", password: "demouser" },
              endPoint: "login",
              alertText: "Login Successful! Redirecting..",
            });
          }}
        >
          {isLoading ? "Loading..." : "Demo User"}
        </button>

        <p>
          {values.isMember ? "Not a member yet ?" : "Already a member?"}
          <button
            className="member-btn"
            type="button"
            onClick={toggleMember}
            disabled={isLoading}
          >
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}
