import React, { useContext, useState } from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore.js";

function Navbar() {
  const { currentUser } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  // const user = true;

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if (currentUser) fetch();

  // console.log(number)

  return (
    <nav>
      <div className="left">
        <a
          href="/"
          className="logo"
        >
          <img
            src="/logo.png"
            alt=""
          />
          <span>MG Estate</span>
        </a>
        {/* <a href='/'>Home</a>
          <a href='/'>About</a>
          <a href='/'>Contact</a>
          <a href='/'>Agents</a> */}
      </div>

      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={currentUser.avatar || "/bg.png"}
              alt=""
            />
            <span>{currentUser.username}</span>
            <Link
              to="/profile"
              className="profile"
            >
              {number > 0 && <div className="notification"> {number} </div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <div className="nav-side-signin">
            <a href="/login">Sign in</a>
            <a
              href="/register"
              className="register"
            >
              {" "}
              Sign up{" "}
            </a>
          </div>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
          <a href="/">Agents</a>
          <a href="/">Sign in</a>
          <a href="/">Sign up</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
