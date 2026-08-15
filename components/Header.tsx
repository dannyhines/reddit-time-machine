import Image from "next/image";
import React from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header className={styles.app_header}>
      <Link href='/' className={styles.app_header_link}>
        <div className={styles.app_logo}>
          <Image src='/reddit-icon.png' height={40} width={40} alt='Logo' />
        </div>
        <span className={styles.app_title}>Reddit Time Machine</span>
      </Link>
    </header>
  );
};

export default Header;
