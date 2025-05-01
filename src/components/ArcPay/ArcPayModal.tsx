import { Pay } from './Pay';
import styles from './ArcPayModal.module.css';

interface ArcPayModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: string;
    currency: string;
    purchaseId: number | string;
    description?: string;
    onSuccess: () => void;
}

export function ArcPayModal({
                                isOpen,
                                onClose,
                                amount,
                                currency,
                                purchaseId,
                                description,
                                onSuccess,
                            }: ArcPayModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <dialog className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <Pay
                    amount={amount}
                    currency={currency}
                    purchaseId={purchaseId}
                    description={description}
                    onSuccess={onSuccess}
                    onCancel={onClose}
                />
            </div>
        </dialog>
    );
}