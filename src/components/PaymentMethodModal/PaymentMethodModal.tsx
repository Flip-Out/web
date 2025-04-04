// src/components/PaymentMethodModal/PaymentMethodModal.tsx
import React from 'react';
import { Subscription } from '../../types';
import { Button } from '../Button/Button';
import styles from './PaymentMethodModal.module.css'; // We'll create this CSS file next

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscription: Subscription | null; // Pass the selected subscription
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
        return null; // Don't render anything if not open or no subscription selected
    }

    const handleAeonSelect = () => {
        onSelectAeon(subscription);
        // onClose(); // Aeon handler will close it after API call potentially
    };

    const handleArcPaySelect = () => {
        onSelectArcPay(subscription);
        // onClose(); // ArcPay handler might close it or navigate
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
                <h2>Choose Payment Method</h2>
                <p>Select how you'd like to pay for:</p>
                <p><strong>{subscription.details}</strong></p>
                <div className={styles.buttonContainer}>
                    <Button handleClick={handleAeonSelect} className={styles.paymentButton}>
                        Pay with Aeon {/* Or your actual name for this system */}
                    </Button>
                    <Button handleClick={handleArcPaySelect} className={styles.paymentButton}>
                        Pay with ArcPay
                    </Button>
                </div>
                <Button handleClick={onClose} variant="secondary" className={styles.closeButton}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}