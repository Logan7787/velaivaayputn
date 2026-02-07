import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar, TouchableOpacity, Image } from 'react-native';
import { Title, Text, Button, Searchbar, Card, Chip, useTheme, Avatar, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutUser } from '../../redux/authSlice';
import { getAllJobs } from '../../api/jobApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const JobSeekerHomeScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchJobs = async () => {
        try {
            const data = await getAllJobs({ search: searchQuery });
            setJobs(data);
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [searchQuery]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchJobs();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Custom Header */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'} 👋</Text>
                        <Text style={styles.headerSubtitle}>Find your dream job today</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Avatar.Text
                            size={40}
                            label={user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                            style={{ backgroundColor: colors.secondary }}
                        />
                    </TouchableOpacity>
                </View>

                <Searchbar
                    placeholder="Search by title, skill, or company..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor={colors.primary}
                />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
            >
                {/* Premium Banner (Upgrade Plan) */}
                <Card style={[styles.bannerCard, { backgroundColor: '#EEF7F6' }]} mode="elevated">
                    <Card.Content style={styles.bannerContent}>
                        <View style={{ flex: 1 }}>
                            <Title style={{ color: colors.primary, fontSize: 18, fontWeight: 'bold' }}>Upgrade to Premium</Title>
                            <Text style={{ color: '#555', fontSize: 13, marginBottom: 8 }}>Get showcased to top recruiters & apply to more jobs.</Text>
                            <Button
                                mode="contained"
                                compact
                                style={{ alignSelf: 'flex-start', borderRadius: 20 }}
                                labelStyle={{ fontSize: 12 }}
                                onPress={() => navigation.navigate('Subscription')}
                            >
                                Upgrade Now
                            </Button>
                        </View>
                        <Icon name="crown" size={50} color={colors.secondary} style={{ opacity: 0.8 }} />
                    </Card.Content>
                </Card>

                <View style={styles.sectionHeader}>
                    <Title>Recommended Jobs</Title>
                    <TouchableOpacity onPress={() => { }}>
                        <Text style={{ color: colors.primary }}>View All</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Loading opportunities...</Text>
                    </View>
                ) : jobs.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon name="briefcase-off" size={60} color="#ccc" />
                        <Text style={{ marginTop: 10, color: '#888' }}>No jobs found matching your criteria.</Text>
                    </View>
                ) : (
                    jobs.map((job) => (
                        <Card key={job.id} style={styles.jobCard} onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}>
                            <Card.Content>
                                <View style={styles.jobHeader}>
                                    <View style={[styles.companyLogo, { backgroundColor: '#f0f0f0' }]}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>
                                            {job.companyName?.substring(0, 1) || 'C'}
                                        </Text>
                                    </View>
                                    <View style={styles.jobInfo}>
                                        <Title style={styles.jobTitle} numberOfLines={1}>{job.title}</Title>
                                        <Text style={styles.companyName}>{job.companyName}</Text>
                                    </View>
                                    <IconButton icon="bookmark-outline" size={24} iconColor={colors.primary} />
                                </View>

                                <View style={styles.metaContainer}>
                                    <View style={styles.metaItem}>
                                        <Icon name="map-marker" size={16} color="#777" />
                                        <Text style={styles.metaText}>{job.location}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <Icon name="clock-outline" size={16} color="#777" />
                                        <Text style={styles.metaText}>{job.employmentType}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <Icon name="cash" size={16} color="green" />
                                        <Text style={styles.metaText}>₹ {job.salary}</Text>
                                    </View>
                                </View>

                                <View style={styles.skillsContainer}>
                                    {job.skills && job.skills.slice(0, 3).map((skill, index) => (
                                        <Chip key={index} style={styles.skillChip} textStyle={{ fontSize: 10, color: '#555' }}>
                                            {skill}
                                        </Chip>
                                    ))}
                                    {job.skills && job.skills.length > 3 && (
                                        <Text style={{ fontSize: 11, color: '#777', alignSelf: 'center', marginLeft: 5 }}>+{job.skills.length - 3} more</Text>
                                    )}
                                </View>

                                <Text style={styles.postedDate}>Posted 2 days ago</Text>
                            </Card.Content>
                        </Card>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 10,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    searchBar: {
        borderRadius: 15,
        backgroundColor: '#fff',
        elevation: 4,
    },
    searchInput: {
        fontSize: 14,
    },
    content: {
        flex: 1,
        marginTop: 10,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    bannerCard: {
        marginBottom: 24,
        borderRadius: 15,
        borderLeftWidth: 5,
        borderLeftColor: '#159895', // Secondary color
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    jobCard: {
        marginBottom: 16,
        borderRadius: 15,
        backgroundColor: '#fff',
        elevation: 3,
    },
    jobHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    companyLogo: {
        width: 50,
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    jobInfo: {
        flex: 1,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    companyName: {
        fontSize: 14,
        color: '#666',
        marginTop: -3,
    },
    metaContainer: {
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    metaText: {
        fontSize: 12,
        color: '#777',
        marginLeft: 4,
        fontWeight: '500',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillChip: {
        marginRight: 8,
        marginBottom: 5,
        backgroundColor: '#f5f5f5',
        height: 26,
    },
    postedDate: {
        fontSize: 10,
        color: '#aaa',
        marginTop: 10,
        textAlign: 'right',
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
});

export default JobSeekerHomeScreen;
