import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, Button, Card, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/authSlice';

const EmployerDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    return (
        <View style={styles.container}>
            <Title>Employer Dashboard</Title>
            <Text>Welcome, {user?.name}</Text>
            <Text>Company: {user?.companyName}</Text>

            <Card style={styles.card}>
                <Card.Title title="Job Posts" />
                <Card.Content>
                    <Paragraph>Plan: {user?.subscription?.tier}</Paragraph>
                    <Paragraph>Used: {user?.subscription?.jobPostsUsed} / {user?.subscription?.jobPostsLimit}</Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={() => console.log('Post Job')}>Post New Job</Button>
                </Card.Actions>
            </Card>

            <Button mode="contained" onPress={() => dispatch(logoutUser())} style={styles.logout}>
                Logout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    card: {
        marginTop: 20,
        marginBottom: 20
    },
    logout: {
        marginTop: 'auto'
    }
});

export default EmployerDashboard;
