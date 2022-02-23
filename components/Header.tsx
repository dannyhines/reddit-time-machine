import React from "react";
import styles from "../styles/Home.module.css";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header className={styles.app_header}>
      <img
        src="/reddit-icon.png"
        className={styles.app_logo}
        alt="Reddit Logo"
      />
      <h4 style={{ margin: 0 }}>Reddit Time Machine</h4>
    </header>
  );
};

export default Header;
