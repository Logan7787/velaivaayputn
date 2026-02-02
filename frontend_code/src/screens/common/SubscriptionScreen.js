import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Text, Card, Button, Paragraph, Portal, Modal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios.config';

const PLANS = [
    { id: 'BASIC', name: 'Basic Plan', price: '49', description: '15 Job Posts / 15 Contacts' },
    { id: 'STANDARD', name: 'Standard Plan', price: '99', description: '25 Job Posts / 25 Contacts' }
];

const SubscriptionScreen = () => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setVisible(true);
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Initiate Upgrade
            const { data: orderData } = await api.post('/subscriptions/upgrade', { tier: selectedPlan.id });

            console.log('Order Created:', orderData);

            // 2. MOCK Payment (Since we can't use native Razorpay SDK here)
            // In a real app, you would call RazorpayCheckout.open(options)

            // Simulating success after 2 seconds
            setTimeout(async () => {
                // 3. Verify Payment (Mocking signature)
                try {
                    await api.post('/subscriptions/verify', {
                        razorpay_order_id: orderData.orderId,
                        razorpay_payment_id: 'pay_mock_' + Date.now(),
                        razorpay_signature: 'mock_signature', // Backend needs to be updated to accept mock signature in dev mode or we fail here
                        tier: selectedPlan.id
                    });
                    alert('Subscription Upgraded Successfully!');
                    setVisible(false);
                } catch (verifyError) {
                    console.error(verifyError);
                    alert('Verification Failed');
                }
                setLoading(false);
            }, 2000);

        } catch (error) {
            console.error(error);
            alert('Payment Initiation Failed');
            setLoading(false);
            setVisible(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Title style={styles.title}>Upgrade Your Plan</Title>

            {PLANS.map(plan => (
                <Card key={plan.id} style={styles.card}>
                    <Card.Title title={plan.name} subtitle={`₹${plan.price} / month`} />
                    <Card.Content>
                        <Paragraph>{plan.description}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
                        <Button mode="contained" onPress={() => handleSelectPlan(plan)}>Choose Plan</Button>
                    </Card.Actions>
                </Card>
            ))}

            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
                    <Title>Confirm Subscription</Title>
                    <Paragraph>You are upgrading to {selectedPlan?.name}.</Paragraph>
                    <Paragraph>Amount: ₹{selectedPlan?.price}</Paragraph>
                    <Button mode="contained" onPress={handlePayment} loading={loading} style={styles.payButton}>
                        Pay Now (Razorpay)
                    </Button>
                    <Button onPress={() => setVisible(false)}>Cancel</Button>
                </Modal>
            </Portal>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1
    },
    title: {
        textAlign: 'center',
        marginBottom: 20
    },
    card: {
        marginBottom: 15
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 8
    },
    payButton: {
        marginVertical: 10
    }
});

export default SubscriptionScreen;
