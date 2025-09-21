import { Link } from "react-router-dom";

import LogoImage from "../assets/images/logo.svg";

export default function Logo() {
  return (
    <Link to={"/"}>
      <img src={LogoImage} alt="Jobify Logo" className="logo" />
    </Link>
  );
}
