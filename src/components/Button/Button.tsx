import { GenericProps } from '../../types';
import styles from './Button.module.css';

interface ButtonProps extends GenericProps {
  className?: string;
  handleClick: () => void;
}

export function Button({ children, className, handleClick }: ButtonProps) {
  return (
    <div className={`${styles.button} ${className}`} onClick={handleClick}>
      {children}
    </div>
  );
}
