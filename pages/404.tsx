import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from "../styles/Home.module.css";

const NotFoundPage: NextPage = () => (
  <div>
    <Head>
      <title>Page not found - Reddit Time Machine</title>
      <meta name='robots' content='noindex' />
    </Head>
    <Header />
    <main className={styles.main}>
      <div className={styles.content_view} style={{ minHeight: "65vh", textAlign: "center", paddingTop: 80 }}>
        <h2>This date is outside the archive</h2>
        <p>Choose a date between 2009 and 2022 to continue exploring Reddit history.</p>
        <Link href='/'>Choose another date</Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFoundPage;
