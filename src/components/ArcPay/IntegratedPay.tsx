import { OrderOut, OrderStatus } from '@arcpay/react-sdk/dist/types/order';
import OrderView from './OrderView';
import { useEffect, useState, useRef } from 'react';
import { useArcPay } from '@arcpay/react-sdk';
import ArcpayStatus from '@arcpay/react-sdk/dist/types/arcpay';

type Props = {
    orderId: string;
    onSuccess: () => void;
    onCancel: () => void;
};

function IntegratedPay({ orderId, onSuccess, onCancel }: Props) {
    const arcPay = useArcPay();
    const [order, setOrder] = useState<OrderOut | undefined>();
    const [isPaying, setIsPaying] = useState(false);
    const orderStatusRef = useRef<OrderStatus | undefined>();

    useEffect(() => {
        if (order) {
            orderStatusRef.current = order.status;
        }
    }, [order]);
    useEffect(() => {
        console.log(`IntegratedPay: Setting listener for order ${orderId}`);
        try {
            arcPay.onOrderChange(orderId, (o) => {
                console.log('IntegratedPay: order changed:', o);
                setOrder(o);

                if (o.status === OrderStatus.captured && orderStatusRef.current !== OrderStatus.captured) {
                    console.log("IntegratedPay: Detected CAPTURED status via listener, calling onSuccess");
                    onSuccess();
                    setIsPaying(false);
                }
                const previousStatus = orderStatusRef.current;
                orderStatusRef.current = o.status;

                if ((o.status === OrderStatus.failed || o.status === OrderStatus.canceled) &&
                    (previousStatus !== OrderStatus.failed && previousStatus !== OrderStatus.canceled)) {
                    console.log(`IntegratedPay: Detected ${o.status.toUpperCase()} status, calling onCancel`);
                    onCancel();
                    setIsPaying(false);
                }
            });
        } catch (error) {
            console.error("Error setting order change listener:", error);
        }
    }, [orderId, arcPay, onSuccess, onCancel]);

    const handlePayClick = async () => {
        if (!order || isPaying) return;
        setIsPaying(true);
        try {
            console.log(`IntegratedPay: Calling arcPay.pay for order ${orderId}`);
            const order_info = await arcPay.pay(orderId);
            console.log('IntegratedPay: arcPay.pay response:', order_info);

            if (order_info?.status === OrderStatus.captured && orderStatusRef.current !== OrderStatus.captured) {
                console.log("IntegratedPay: Detected CAPTURED status immediately after pay call, calling onSuccess");
                onSuccess();
                setIsPaying(false);
            }

        } catch (error) {
            console.error('IntegratedPay: arcPay.pay error:', error);
            setIsPaying(false);
            onCancel();
        }
    };


    if (!order) {
        return <>Loading Payment Details...</>;
    }

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
