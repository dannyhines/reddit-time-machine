import Image from "next/image";
import React from "react";
import styles from "../styles/Home.module.css";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header className={styles.app_header}>
      <div className={styles.app_logo}>
        <Image src="/reddit-icon.png" height={45} width={45} alt="Logo" />
      </div>
      <h1 style={{ fontSize: 24 }}>Reddit Time Machine</h1>
    </header>
  );
};

export default Header;
