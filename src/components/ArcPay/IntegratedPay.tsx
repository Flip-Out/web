import { OrderOut, OrderStatus } from '@arcpay/react-sdk/dist/types/order';
import OrderView from './OrderView';
import { useState } from 'react'; // Removed useEffect, useRef
import { useArcPay } from '@arcpay/react-sdk';
import ArcpayStatus from '@arcpay/react-sdk/dist/types/arcpay';

type Props = {
    order: OrderOut; // Receive the full order object as prop
    onPay: () => Promise<void>; // Callback to trigger payment via parent
    onCancel: () => void;
};

function IntegratedPay({ order, onPay, onCancel }: Props) {
    const arcPay = useArcPay();
    const [isPaying, setIsPaying] = useState(false);

    const handlePayClick = async () => {
        if (!order || isPaying) return;
        setIsPaying(true);
        try {
            console.log('handlePayClick:onPay');
            await onPay();
        } catch (error) {
            console.error('IntegratedPay: onPay trigger error:', error);
            setIsPaying(false);
        }
    };

    if (!order) {
        // This case should ideally be handled by the parent now
        return <>Loading Payment Details...</>;
    }

    // Determine canPay based on the order prop passed down
    const canPay = !isPaying && (order.status === OrderStatus.created || order.status === OrderStatus.pending);

    return (
        <>
            <OrderView order={order} />

            {arcPay.arcPayStatus === ArcpayStatus.disconnected && (
                <button onClick={() => arcPay.connect()}>Connect Wallet</button>
            )}

            {arcPay.arcPayStatus === ArcpayStatus.connected && (
                <>
                    <button onClick={handlePayClick} disabled={!canPay || isPaying}>
                        {isPaying ? 'Processing...' : `Pay (${order.amount} ${order.currency})`}
                    </button>
                    <button onClick={() => arcPay.disconnect()} style={{marginLeft: '10px'}}>Disconnect Wallet</button>
                </>
            )}
            <button onClick={onCancel} style={{marginLeft: '10px'}} disabled={isPaying}>Cancel</button>
        </>
    );
}

export default IntegratedPay;
