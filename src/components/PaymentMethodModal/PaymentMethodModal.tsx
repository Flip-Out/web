import { Subscription } from '../../types';
import { Button } from '../Button/Button';
import styles from './PaymentMethodModal.module.css';

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscription: Subscription | null;
    onSelectAeon: (subscription: Subscription) => void;
    onSelectArcPay: (subscription: Subscription) => void;
}

export function PaymentMethodModal({
                                       isOpen,
                                       onClose,
                                       subscription,
                                       onSelectAeon,
                                       onSelectArcPay,
                                   }: PaymentMethodModalProps) {
    if (!isOpen || !subscription) {
        return null;
    }

    const handleAeonSelect = () => {
        onSelectAeon(subscription);
    };

    const handleArcPaySelect = () => {
        onSelectArcPay(subscription);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Choose Payment Method</h2>
                <p>Select how you'd like to pay for:</p>
                <p><strong>{subscription.details}</strong></p>
                <div className={styles.buttonContainer}>
                    <Button handleClick={handleAeonSelect} className={styles.paymentButton}>
                        Pay with Aeon
                    </Button>
                    <Button handleClick={handleArcPaySelect} className={styles.paymentButton}>
                        Pay with ArcPay
                    </Button>
                </div>
                <Button handleClick={onClose} className={`${styles.paymentButton} ${styles.closeButton}`}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
