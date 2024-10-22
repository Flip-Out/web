import { GenericProps } from '../../types';
import styles from './Card.module.css';

interface CardProps extends GenericProps {
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}
