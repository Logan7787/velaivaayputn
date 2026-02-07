import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { Title, Text, Card, DataTable, ActivityIndicator, Button, useTheme, Avatar, Surface, IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { logoutUser } from '../../redux/authSlice';
import api from '../../api/axios.config';

const AdminDashboard = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const StatCard = ({ title, value, icon, color }) => (
        <Surface style={styles.statCard} elevation={2}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Icon name={icon} size={28} color={color} />
            </View>
            <View>
                <Text style={styles.statLabel}>{title}</Text>
                <Title style={styles.statValue}>{value || 0}</Title>
            </View>
        </Surface>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Title style={styles.headerTitle}>Admin Panel</Title>
                    <Text style={styles.headerSubtitle}>System Overview</Text>
                </View>
                <IconButton
                    icon="logout"
                    size={24}
                    color={colors.error}
                    onPress={() => dispatch(logoutUser())}
                />
            </View>

            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: 50 + insets.bottom }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Total Users"
                        value={stats?.users?.total}
                        icon="account-group"
                        color="#4CAF50"
                    />
                    <StatCard
                        title="Revenue"
                        value={`₹${stats?.revenue || 0}`}
                        icon="currency-inr"
                        color="#FF9800"
                    />
                    <StatCard
                        title="Active Jobs"
                        value={stats?.jobs?.active}
                        icon="briefcase-check"
                        color="#2196F3"
                    />
                    <StatCard
                        title="Total Jobs"
                        value={stats?.jobs?.total}
                        icon="briefcase-outline"
                        color="#9C27B0"
                    />
                </View>

                {/* Quick Actions */}
                <Title style={styles.sectionTitle}>Quick Actions</Title>
                <Card style={styles.actionCard} onPress={() => navigation.navigate('UserManagement')}>
                    <Card.Content style={styles.actionContent}>
                        <View style={styles.actionLeft}>
                            <Avatar.Icon size={40} icon="account-cog" style={{ backgroundColor: colors.primary }} />
                            <View style={{ marginLeft: 15 }}>
                                <Title style={{ fontSize: 16 }}>User Management</Title>
                                <Text style={{ color: '#666', fontSize: 12 }}>Manage users, roles, and bans</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={24} color="#ccc" />
                    </Card.Content>
                </Card>

                <Card style={styles.actionCard} onPress={() => { }}>
                    <Card.Content style={styles.actionContent}>
                        <View style={styles.actionLeft}>
                            <Avatar.Icon size={40} icon="file-document-edit" style={{ backgroundColor: colors.secondary }} />
                            <View style={{ marginLeft: 15 }}>
                                <Title style={{ fontSize: 16 }}>Content Moderation</Title>
                                <Text style={{ color: '#666', fontSize: 12 }}>Review reported jobs and posts</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={24} color="#ccc" />
                    </Card.Content>
                </Card>

                {/* Recent Activity (Placeholder) */}
                <Title style={styles.sectionTitle}>Recent Activity</Title>
                <Surface style={styles.activityCard}>
                    <Text style={{ textAlign: 'center', padding: 20, color: '#888' }}>
                        System logs and recent signups will appear here.
                    </Text>
                </Surface>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: '#f5f5f5'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333'
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666'
    },
    content: {
        padding: 20
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    statCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    iconContainer: {
        padding: 8,
        borderRadius: 10,
        marginBottom: 10
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600'
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 5
    },
    actionCard: {
        marginBottom: 15,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 1
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    activityCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center'
    }
});

export default AdminDashboard;
