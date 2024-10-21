import styles from './Header.module.css';
import Logo from '../../assets/Logo';
import UserInfo from '../UserInfo/UserInfo';

export default function Header() {
  return (
    <div className={styles.header}>
      <Logo />
      <span className={styles.title}>store</span>
      <UserInfo />
    </div>
  );
}
