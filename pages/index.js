import Head from "next/head";
import Image from "next/image";
import Search from "../components/search/search";
import styles from "../styles/Home.module.css";

export default function Home() {
  // do redux manipulations here and send data into components
  return (
    <div className={styles.container}>
      <Search />
    </div>
  );
}
