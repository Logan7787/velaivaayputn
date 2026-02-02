import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Text, Card, DataTable, ActivityIndicator, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/authSlice';
import api from '../../api/axios.config';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/admin/dashboard');
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator /></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Title>Admin Dashboard</Title>
                <Button onPress={() => dispatch(logoutUser())}>Logout</Button>
            </View>

            <View style={styles.statsRow}>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Title>{stats?.users?.total}</Title>
                        <Text>Total Users</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Title>{stats?.revenue}</Title>
                        <Text>Revenue (₹)</Text>
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.statsRow}>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Title>{stats?.jobs?.active}</Title>
                        <Text>Active Jobs</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.statCard}>
                    <Card.Content>
                        <Title>{stats?.jobs?.total}</Title>
                        <Text>Total Jobs</Text>
                    </Card.Content>
                </Card>
            </View>

            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <Card style={styles.actionCard}>
                <Card.Title title="User Management" />
                <Card.Actions>
                    <Button>View All Users</Button>
                </Card.Actions>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    statCard: {
        width: '48%',
        elevation: 2
    },
    sectionTitle: {
        marginTop: 20,
        marginBottom: 10
    },
    actionCard: {
        marginBottom: 10
    }
});

export default AdminDashboard;
