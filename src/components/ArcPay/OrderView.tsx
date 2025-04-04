import { OrderOut, OrderStatus } from '@arcpay/react-sdk/dist/types/order';
import React from 'react';

interface OrderViewProps {
    order: OrderOut;
}

const formatOrderStatus = (status: OrderStatus): string => {
    switch (status) {
        case OrderStatus.created:
            return 'Order Created';
        case OrderStatus.pending:
            return 'Pending Payment';
        case OrderStatus.processing:
            return 'Processing';
        case OrderStatus.received:
            return 'Completed (Received)';
        case OrderStatus.captured:
            return 'Payment Complete';
        case OrderStatus.failed:
            return 'Payment Failed';
        case OrderStatus.canceled:
            return 'Canceled';
        default:
            // FIX: Since all known enum cases are handled, TS infers 'status' as 'never'.
            // If an unexpected status string somehow appears, just return it directly.
            // It's already a string because OrderStatus is a string enum.
            return status;
    }
};


const OrderView: React.FC<OrderViewProps> = ({ order }) => {
    if (!order) {
        return <div className="order-view">Loading order details...</div>;
    }

    return (
        <div className="order-view">
            <h2>Order Details</h2>
            <p>
                <strong>Order ID:</strong> {order.orderId} ({order.uuid})
            </p>
            <p>
                <strong>Status:</strong>{' '}
                {formatOrderStatus(order.status)}
            </p>
            <p>
                <strong>Created At:</strong>{' '}
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
            </p>
            <p>
                <strong>Amount:</strong> {order.amount} {order.currency}
            </p>
            <p>
                <strong>Testnet:</strong> {order.testnet ? 'Yes' : 'No'}
            </p>

            {order.customer && (
                <div className="customer-info">
                    <h3>Customer Information</h3>
                    <p>
                        <strong>Wallet:</strong> {order.customer.wallet}
                    </p>
                </div>
            )}

            {order.txn && (
                <div className="txn-info">
                    <h3>Transaction Information</h3>
                    <p>
                        <strong>Transaction ID:</strong>{' '}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://${
                                order.testnet ? 'testnet.' : ''
                            }tonviewer.com/transaction/${order.txn.hash}`}>
                            {order.txn.hash.substring(0, 6)}...{order.txn.hash.substring(order.txn.hash.length - 4)}
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};

export default OrderView;
