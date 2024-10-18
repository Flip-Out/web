import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.h2}>Flip Out</h2>
        <h2 className={`${styles.h2} ${styles.h2_small}`}>Master your luck</h2>
        <h1 className={styles.h1}>COMING SOON...</h1>
      </div>
    </div>
  );
}
