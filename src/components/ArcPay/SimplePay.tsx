import { OrderOut, OrderStatus } from '@arcpay/react-sdk/dist/types/order';
import OrderView from './OrderView';
import { useEffect, useState, useRef } from 'react';
import { useArcPay } from '@arcpay/react-sdk';

type Props = {
    orderId: string;
    onSuccess: () => void;
    onCancel: () => void;
};

function SimplePay({ orderId, onSuccess, onCancel }: Props) {
    const arcPay = useArcPay();
    const [order, setOrder] = useState<OrderOut | undefined>();
    const orderStatusRef = useRef<OrderStatus | undefined>();

    useEffect(() => {
        if (order) {
            orderStatusRef.current = order.status;
        }
    }, [order]);

    useEffect(() => {
        try {
            arcPay.onOrderChange(orderId, (o) => {
                setOrder(o);
                if (o.status === OrderStatus.captured && orderStatusRef.current !== OrderStatus.captured) {
                    onSuccess();
                }
                const previousStatus = orderStatusRef.current;
                orderStatusRef.current = o.status;
                if ((o.status === OrderStatus.failed || o.status === OrderStatus.canceled) &&
                    (previousStatus !== OrderStatus.failed && previousStatus !== OrderStatus.canceled)) {
                    onCancel();
                }
            });
        } catch (error) {
            console.error("Error setting order change listener:", error);
        }
    }, [orderId, arcPay, onSuccess, onCancel]);

    if (!order) {
        return <>Loading Payment Link...</>;
    }

    const canPay = order.status === OrderStatus.created || order.status === OrderStatus.pending;

    return (
        <>
            <OrderView order={order} />
            {order.paymentUrl && canPay && (
                <button
                    onClick={() => window.open(order.paymentUrl, '_blank', 'noreferrer')}>
                    Pay ({order.amount} ${order.currency}) via Link
                </button>
            )}
            <button onClick={onCancel} style={{marginLeft: '10px'}}>Cancel</button>
        </>
    );
}
export default SimplePay;
