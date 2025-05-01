import { Pay } from './Pay';
import styles from './ArcPayModal.module.css';
import { Box, Dialog, useMediaQuery, useTheme } from '@mui/material';

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
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            open={isOpen}
            fullScreen={fullScreen}
            aria-labelledby="responsive-dialog"
            maxWidth="sm"
            style={{ border: 'rgba(48, 238, 227, 0.2)' }}
        >
            <Box display="flex" flexDirection="column" className={styles.wrapper}>
                <Pay
                    amount={amount}
                    currency={currency}
                    purchaseId={purchaseId}
                    description={description}
                    onSuccess={onSuccess}
                    onCancel={onClose}
                />
            </Box>
        </Dialog>
    );
}