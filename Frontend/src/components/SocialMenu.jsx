import React, { useState } from "react";
import {
  FaFacebookF,
  FaWhatsapp,
  FaXTwitter,
  FaRedditAlien,
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
  FaYoutube,
} from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";
import "../styles/socialMenu.css";

const SocialMenu = ({ variant = "floating" }) => {
  const [active, setActive] = useState(false);

  const socialLinks = [
    { icon: <FaFacebookF />, color: "#1877f2", href: "https://www.facebook.com/profile.php?id=61566840202140" },
    { icon: <FaWhatsapp />, color: "#25d366", href: "https://whatsapp.com" },
    { icon: <FaXTwitter />, color: "#1b1e21", href: "https://x.com/rittik892005" },
    { icon: <FaRedditAlien />, color: "#ff5733", href: "https://www.reddit.com/user/HumbleTea298/" },
    { icon: <FaLinkedinIn />, color: "#0a66c2", href: "https://www.linkedin.com/in/rittik-pandit-/" },
    { icon: <FaInstagram />, color: "#c32aa3", href: "https://www.instagram.com/rsmp0813/?hl=en" },
    { icon: <FaGithub />, color: "#1b1e21", href: "https://github.com/Rittik151" },
    { icon: <FaYoutube />, color: "#ff0000", href: "https://youtube.com/@monarch-r5s-o?si=zzCyuYKlGG3mRsj_" },
  ];

  if (variant === "floating") {
    return (
      <div className="floating-social-menu">
        <div className={`menu ${active ? "active" : ""}`}>
          <div className="toggle" onClick={() => setActive(!active)}>
            <IoShareSocial />
          </div>

          {socialLinks.map((item, index) => {
            const angle = (360 / socialLinks.length) * index;
            return (
              <li
                key={index}
                style={{
                  "--angle": `${angle}deg`,
                  "--color": item.color,
                }}
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.icon}
                </a>
              </li>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default SocialMenu;