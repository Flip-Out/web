import { GenericProps } from '../../types';
import styles from './Button.module.css';
import classnames from 'classnames';

interface ButtonProps extends GenericProps {
  className?: string;
  disabled?: boolean;
  handleClick: () => void;
}

export function Button({
  children,
  className,
  handleClick,
  disabled = false,
}: ButtonProps) {
  const handleButtonClick = () => {
    if (!disabled && handleClick) {
      handleClick();
    }
  };

  return (
    <div
      className={classnames(styles.button, className, {
        [styles.disabled]: disabled,
      })}
      onClick={handleButtonClick}
    >
      {children}
    </div>
  );
}
