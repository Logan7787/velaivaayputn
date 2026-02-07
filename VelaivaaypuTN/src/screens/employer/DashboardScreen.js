import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Image, StatusBar, TouchableOpacity } from 'react-native';
import { Title, Text, Button, Card, Paragraph, Divider, useTheme, Avatar, IconButton, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutUser } from '../../redux/authSlice';
import { getMyJobs } from '../../api/jobApi';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmployerDashboard = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [jobs, setJobs] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Stats
    const totalApplications = jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0);
    const activeJobs = jobs.filter(j => j.status === 'OPEN').length;

    const fetchMyJobs = async () => {
        try {
            const data = await getMyJobs();
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchMyJobs();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchMyJobs();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F8F9FA' }]} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>Welcome, {user?.name?.split(' ')[0] || 'Employer'}</Text>
                        <Text style={styles.subtext}>{user?.companyName || 'Company Admin'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Avatar.Text
                            size={40}
                            label={user?.name ? user.name.substring(0, 2).toUpperCase() : 'EM'}
                            style={{ backgroundColor: colors.secondary }}
                        />
                    </TouchableOpacity>
                </View>

                {/* Quick Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{jobs.length}</Text>
                        <Text style={styles.statLabel}>Total Jobs</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{activeJobs}</Text>
                        <Text style={styles.statLabel}>Active</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{totalApplications}</Text>
                        <Text style={styles.statLabel}>Applicants</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
            >
                {/* Subscription Card */}
                <Card style={styles.planCard}>
                    <Card.Content style={styles.planContent}>
                        <View>
                            <Text style={styles.planLabel}>Current Plan</Text>
                            <Title style={styles.planName}>{user?.subscription?.tier || 'BASIC'}</Title>
                            <Text style={styles.planUsage}>
                                {user?.subscription?.jobPostsUsed || 0} / {user?.subscription?.jobPostsLimit || 15} Posts Used
                            </Text>
                        </View>
                        <Button
                            mode="contained"
                            compact
                            onPress={() => navigation.navigate('Subscription')}
                            style={{ borderRadius: 20 }}
                        >
                            Upgrade
                        </Button>
                    </Card.Content>
                </Card>

                <View style={styles.sectionHeader}>
                    <Title>Recent Job Posts</Title>
                    <Button mode="text" onPress={() => { }}>View All</Button>
                </View>

                {jobs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="briefcase-plus-outline" size={60} color="#ccc" />
                        <Paragraph style={{ color: '#888', marginTop: 10 }}>You haven't posted any jobs yet.</Paragraph>
                        <Button mode="contained" onPress={() => navigation.navigate('PostJob')} style={{ marginTop: 15 }}>
                            Post Results
                        </Button>
                    </View>
                ) : (
                    jobs.map((job) => (
                        <Card key={job.id} style={styles.jobCard} onPress={() => navigation.navigate('JobApplications', { jobId: job.id, jobTitle: job.title })}>
                            <Card.Content>
                                <View style={styles.jobHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Title style={styles.jobTitle}>{job.title}</Title>
                                        <Text style={styles.jobDate}>Posted on: {new Date(job.createdAt || Date.now()).toLocaleDateString()}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: job.status === 'OPEN' ? '#E8F5E9' : '#FFEBEE' }]}>
                                        <Text style={{ color: job.status === 'OPEN' ? 'green' : 'red', fontSize: 10, fontWeight: 'bold' }}>
                                            {job.status}
                                        </Text>
                                    </View>
                                </View>

                                <Divider style={{ marginVertical: 10 }} />

                                <View style={styles.jobFooter}>
                                    <View style={styles.footerItem}>
                                        <Icon name="account-group" size={16} color="#666" />
                                        <Text style={styles.footerText}>{job.applicationCount || 0} Applications</Text>
                                    </View>
                                    <Icon name="chevron-right" size={20} color="#ccc" />
                                </View>
                            </Card.Content>
                        </Card>
                    ))
                )}
            </ScrollView>

            <FAB
                style={[styles.fab, { backgroundColor: colors.secondary }]}
                icon="plus"
                color="#fff"
                label="Post Job"
                onPress={() => navigation.navigate('PostJob')}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 40,
        marginBottom: -20, // Overlap effect
        zIndex: 1,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 15,
        padding: 15,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
        height: '100%',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 30,
        paddingBottom: 80,
    },
    planCard: {
        borderRadius: 15,
        elevation: 4,
        backgroundColor: '#fff',
        marginBottom: 20,
        marginTop: 5,
    },
    planContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planLabel: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    planUsage: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    jobCard: {
        marginBottom: 15,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    jobDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    jobFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        marginLeft: 6,
        color: '#555',
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
        padding: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default EmployerDashboard;
