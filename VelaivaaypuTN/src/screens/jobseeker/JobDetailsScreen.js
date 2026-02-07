import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Platform, StatusBar } from 'react-native';
import { Title, Text, Button, Card, Paragraph, Chip, Divider, ActivityIndicator, Avatar, useTheme, IconButton, Surface } from 'react-native-paper';
import { getJobById, applyForJob } from '../../api/jobApi';
import { initiateChat } from '../../api/chatApi';
import { useSelector } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const JobDetailsScreen = ({ route, navigation }) => {
    const { jobId } = route.params;
    const { colors } = useTheme();
    const { user } = useSelector(state => state.auth);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await getJobById(jobId);
                setJob(data);
            } catch (error) {
                Alert.alert('Error', 'Failed to load job details');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [jobId]);

    const handleApply = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to apply for jobs', [
                { text: 'Cancel' },
                { text: 'Login', onPress: () => navigation.navigate('Login') }
            ]);
            return;
        }

        if (user.role === 'EMPLOYER') {
            Alert.alert('Restricted', 'Employers cannot apply for jobs.');
            return;
        }

        setApplying(true);
        try {
            await applyForJob(jobId, `I am interested in this ${job.title} position.`);
            Alert.alert('Success', 'Application Submitted Successfully!', [
                { text: 'OK' }
            ]);
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to apply';
            Alert.alert('Application Failed', msg);
        } finally {
            setApplying(false);
        }
    };

    const handleChat = async () => {
        if (!user) {
            navigation.navigate('Login');
            return;
        }

        try {
            // Create or Get existing Chat Room
            const chat = await initiateChat(jobId, job.employerId);

            // Navigate to Chat Screen
            navigation.navigate('ChatScreen', {
                chatId: chat.id,
                otherUser: { name: job.companyName }
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to start chat');
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!job) return null;

    return (
        <View style={[styles.container, { backgroundColor: '#F8F9FA' }]}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Header Background */}
            <View style={[styles.headerBackground, { backgroundColor: colors.primary }]} />

            {/* Sticky Header Actions */}
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.appBar}>
                    <IconButton
                        icon="arrow-left"
                        iconColor="#fff"
                        size={24}
                        onPress={() => navigation.goBack()}
                    />
                    <IconButton
                        icon={isSaved ? "bookmark" : "bookmark-outline"}
                        iconColor="#fff"
                        size={24}
                        onPress={() => setIsSaved(!isSaved)}
                    />
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Surface style={styles.logoContainer} elevation={4}>
                        {job.companyLogo ? (
                            <Avatar.Image size={80} source={{ uri: job.companyLogo }} />
                        ) : (
                            <Avatar.Text
                                size={80}
                                label={job.companyName.substring(0, 2).toUpperCase()}
                                style={{ backgroundColor: colors.surface }}
                                color={colors.primary}
                                labelStyle={{ fontWeight: 'bold', fontSize: 28 }}
                            />
                        )}
                    </Surface>

                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.companyName}>{job.companyName}</Text>

                    <View style={styles.headerMeta}>
                        <View style={styles.metaBadge}>
                            <Icon name="map-marker" size={14} color="#555" />
                            <Text style={styles.metaText}>{job.location}</Text>
                        </View>
                        <View style={styles.metaBadge}>
                            <Icon name="clock-outline" size={14} color="#555" />
                            <Text style={styles.metaText}>{job.employmentType}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Info Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Salary</Text>
                        <Text style={[styles.statValue, { color: '#2E7D32' }]}>₹ {job.salary || 'N/A'}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Experience</Text>
                        <Text style={styles.statValue}>{job.experience}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Schedule</Text>
                        <Text style={styles.statValue}>{job.schedule || 'Full-time'}</Text>
                    </View>
                </View>

                {/* Description Section */}
                <Card style={styles.sectionCard} mode="elevated">
                    <Card.Title title="Job Description" titleStyle={styles.cardTitle} left={props => <Icon {...props} name="text-box-outline" size={24} color={colors.primary} />} />
                    <Card.Content>
                        <Paragraph style={styles.descriptionText}>
                            {job.description}
                        </Paragraph>
                    </Card.Content>
                </Card>

                {/* Skills Section */}
                <Card style={styles.sectionCard} mode="elevated">
                    <Card.Title title="Requirements & Skills" titleStyle={styles.cardTitle} left={props => <Icon {...props} name="format-list-checks" size={24} color={colors.primary} />} />
                    <Card.Content>
                        <View style={styles.chipContainer}>
                            {job.skills && job.skills.map((skill, index) => (
                                <Chip key={index} style={styles.chip} textStyle={{ fontSize: 13, color: '#1A5F7A' }}>{skill}</Chip>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                {/* Contact Section */}
                <Card style={[styles.sectionCard, { marginBottom: 100 }]} mode="elevated">
                    <Card.Title title="Contact Info" titleStyle={styles.cardTitle} left={props => <Icon {...props} name="card-account-phone-outline" size={24} color={colors.primary} />} />
                    <Card.Content>
                        <View style={styles.contactRow}>
                            <Icon name="email" size={20} color={colors.primary} />
                            <Text style={styles.contactText}>{job.contactEmail}</Text>
                        </View>
                        <View style={styles.contactRow}>
                            <Icon name="phone" size={20} color={colors.primary} />
                            <Text style={styles.contactText}>{job.contactPhone}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>

            {/* Bottom Action Bar */}
            <Surface style={[styles.bottomBar, { paddingBottom: Math.max(16, insets.bottom) }]} elevation={8}>
                <Button
                    mode="outlined"
                    icon="chat"
                    onPress={handleChat}
                    style={[styles.chatButton, { borderColor: colors.primary }]}
                    textColor={colors.primary}
                >
                    Chat
                </Button>
                <Button
                    mode="contained"
                    onPress={handleApply}
                    loading={applying}
                    style={[styles.applyButton, { backgroundColor: colors.primary }]}
                    labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                >
                    Apply Now
                </Button>
            </Surface>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 160,
    },
    safeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        height: 56,
        alignItems: 'center',
    },
    scrollContent: {
        paddingTop: 100, // Push content down
        paddingBottom: 20,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    logoContainer: {
        marginBottom: 16,
        borderRadius: 50,
        padding: 4,
        backgroundColor: '#fff',
        elevation: 6,
    },
    jobTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 4,
    },
    companyName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        fontWeight: '500',
    },
    headerMeta: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    metaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E1E8ED',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    metaText: {
        color: '#555',
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    statLabel: {
        fontSize: 11,
        color: '#888',
        textTransform: 'uppercase',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    sectionCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#555',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: '#E0F7FA',
        borderRadius: 8,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#F9F9F9',
        padding: 12,
        borderRadius: 10,
    },
    contactText: {
        marginLeft: 12,
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        gap: 16,
    },
    chatButton: {
        flex: 1,
        borderRadius: 12,
        borderWidth: 1,
    },
    applyButton: {
        flex: 2,
        borderRadius: 12,
    }
});

export default JobDetailsScreen;
