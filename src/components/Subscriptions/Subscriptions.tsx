import React, { useEffect, useState, useCallback } from 'react';
import Cash from '../../assets/Cash';
import Crystals from '../../assets/Crystals';
import InternalCurrency from '../../assets/InternalCurrency';
import Power from '../../assets/Power';
import TonCurrency from '../../assets/TonCurrency';
import { GenericProps, PurchaseType, Subscription } from '../../types';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import styles from './Subscriptions.module.css';
import { loadFromLocalStorage, LOCAL_STORAGE } from '../../utils/localStorage';
import { useStoreApi } from '../../hooks/useStoreApi';
import { useDispatch } from '../../store/dispatch';
import { addNotification, updateLoadingState } from '../../store/actions';
import { PaymentMethodModal } from '../PaymentMethodModal/PaymentMethodModal';
import { ArcPayModal } from '../ArcPay/ArcPayModal';

interface SubscriptionProps extends GenericProps {
    subscriptions: Array<Subscription>;
    activeSubscriptions: Array<number>;
    handleBuyInit: (url: string, title: string) => void;
}

export function Subscriptions({
                                  subscriptions,
                                  handleBuyInit,
                                  activeSubscriptions,
                              }: SubscriptionProps) {
    const { createOrder: createAeonOrder } = useStoreApi();
    const { dispatch } = useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
    const [isArcPayModalOpen, setIsArcPayModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        const user = loadFromLocalStorage(LOCAL_STORAGE.TELEGRAM_AUTH_DATA);
        setIsLoggedIn(!!user);
    }, []);

    const handleAeonPayment = useCallback((subscription: Subscription) => {
        if (!subscription) return;
        const amount = subscription.currency + '00';
        dispatch(updateLoadingState(true));
        setIsPaymentMethodModalOpen(false); // Close method modal

        createAeonOrder({
            purchase_type: PurchaseType.SUBSCRIPTION,
            amount,
            purchaseId: subscription.id,
        }).then(
            (data) => {
                handleBuyInit(data?.data.paymentLink || '', subscription.details);
                dispatch(updateLoadingState(false));
                setSelectedSubscription(null);
            },
            (e) => {
                dispatch(addNotification({ message: e?.message || 'Aeon payment failed.', type: 'error' }));
                dispatch(updateLoadingState(false));
                setSelectedSubscription(null);
            }
        );
    }, [dispatch, createAeonOrder, handleBuyInit]);


    const handleArcPayPayment = useCallback((subscription: Subscription) => {
        if (!subscription) return;
        setSelectedSubscription(subscription);
        setIsPaymentMethodModalOpen(false);
        setIsArcPayModalOpen(true);
    }, []);

    const handleSubscribeClick = useCallback((subscription: Subscription) => {
        setSelectedSubscription(subscription);
        setIsPaymentMethodModalOpen(true);
    }, []);

    const handleArcPaySuccess = useCallback(() => {
        dispatch(addNotification({ message: 'ArcPay payment successful!', type: 'success'}));
        setIsArcPayModalOpen(false);
        setSelectedSubscription(null);
    }, [dispatch]);

    const handleArcPayCancel = useCallback(() => {
        if (isArcPayModalOpen) {
            dispatch(addNotification({ message: 'ArcPay payment cancelled or failed.', type: 'info'}));
        }
        setIsArcPayModalOpen(false);
        setSelectedSubscription(null);
    }, [dispatch, isArcPayModalOpen]);

    const handlePaymentMethodModalClose = useCallback(() => {
        setIsPaymentMethodModalOpen(false);
        setSelectedSubscription(null);
    }, []);

    return (
        <React.Fragment>
            {subscriptions.map((subscription, index) => (
                <Card className={styles.subscription} key={index}>
                    <div className={styles.subscriptionWrapper}>
                        <div className={styles.details}>
                            <div className={styles.detailsTitle}>{subscription.details}</div>
                            <div className={styles.additionalInfo}>
                                <div>{subscription.additionalInfo}</div>
                                <div className={styles.list}>
                                    <div className={styles.ability}>
                                        <Power className={styles.icon} />
                                        <div className={styles.pink}>+{subscription.xploit}</div>
                                    </div>
                                    <div className={styles.ability}>
                                        <Crystals className={styles.icon} />
                                        <div className={styles.orange}>+{subscription.chip}</div>
                                    </div>
                                    <div className={styles.ability}>
                                        <Cash className={styles.icon} />
                                        <div className={styles.turqouise}>+{subscription.items}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.currencyWrapper}>
                            <div className={styles.currency}>
                                <div>{subscription.currency}</div>
                                <InternalCurrency className={styles.payIcon} />
                                <>/</>
                                <div>{subscription.tonCurrency}</div>
                                <TonCurrency className={styles.payIcon} />
                            </div>
                            <Button
                                handleClick={() => handleSubscribeClick(subscription)}
                                disabled={
                                    !isLoggedIn ||
                                    activeSubscriptions.includes(subscription.id) ||
                                    isArcPayModalOpen || isPaymentMethodModalOpen 
                                }
                            >
                                {activeSubscriptions.includes(subscription.id) ? 'Subscribed' : 'Subscribe'}
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}

            <PaymentMethodModal
                isOpen={isPaymentMethodModalOpen}
                onClose={handlePaymentMethodModalClose}
                subscription={selectedSubscription}
                onSelectAeon={handleAeonPayment}
                onSelectArcPay={handleArcPayPayment}
            />

            {selectedSubscription && (
                <ArcPayModal
                    isOpen={isArcPayModalOpen}
                    onClose={handleArcPayCancel}
                    amount={selectedSubscription.tonCurrency.toString()}
                    currency="TON"
                    purchaseId={selectedSubscription.id}
                    description={selectedSubscription.details}
                    onSuccess={handleArcPaySuccess}
                />
            )}

        </React.Fragment>
    );
}