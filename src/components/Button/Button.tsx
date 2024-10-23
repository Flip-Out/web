import { GenericProps } from '../../types';
import styles from './Button.module.css';

interface ButtonProps extends GenericProps {
  className?: string;
}

export function Button({ children, className }: ButtonProps) {
  return <div className={`${styles.button} ${className}`}>{children}</div>;
}
