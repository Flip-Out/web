import Crystals from '../../assets/Crystals';
import Power from '../../assets/Power';
import { GenericProps } from '../../types';
import styles from './Currency.module.css';

interface CurrencyProps extends GenericProps {
  power: number;
  crystals: number;
  className?: string;
  direction?: 'straight' | 'revert';
}

export function Currency({
  power,
  crystals,
  className = '',
  direction = 'straight',
}: CurrencyProps) {
  const isStraight = direction === 'straight';
  return (
    <div className={`${styles.currency} ${className}`}>
      <div className={styles.details}>
        <Power className={isStraight ? styles.icon : styles.iconRevert} />
        <div className={styles.pink}>{power}</div>
      </div>
      <div className={styles.details}>
        <Crystals className={isStraight ? styles.icon : styles.iconRevert} />
        <div className={styles.orange}>{crystals}</div>
      </div>
    </div>
  );
}
