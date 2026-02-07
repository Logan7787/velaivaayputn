import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Platform, StatusBar } from 'react-native';
import { Title, Text, Button, Card, Paragraph, Chip, Divider, ActivityIndicator, Avatar, useTheme, IconButton } from 'react-native-paper';
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

    const insets = useSafeAreaInsets();

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!job) return null;

    return (
        <View style={[styles.container, { backgroundColor: '#F8F9FA', paddingTop: insets.top }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
                {/* Hero Header */}
                <View style={styles.header}>
                    <IconButton
                        icon="arrow-left"
                        size={24}
                        onPress={() => navigation.goBack()}
                        style={[styles.backButton, { top: 10 }]}
                    />
                    <IconButton
                        icon={isSaved ? "bookmark" : "bookmark-outline"}
                        size={24}
                        color={isSaved ? colors.primary : '#666'}
                        onPress={() => setIsSaved(!isSaved)}
                        style={[styles.saveButton, { top: 10 }]}
                    />

                    <View style={styles.logoContainer}>
                        <Avatar.Text
                            size={80}
                            label={job.companyName.substring(0, 2).toUpperCase()}
                            style={{ backgroundColor: colors.primary }}
                        />
                    </View>

                    <Title style={styles.jobTitle}>{job.title}</Title>
                    <Text style={styles.companyName}>{job.companyName}</Text>

                    <View style={styles.headerMeta}>
                        <Icon name="map-marker" size={16} color="#666" />
                        <Text style={styles.metaText}>{job.location}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Icon name="clock-outline" size={16} color="#666" />
                        <Text style={styles.metaText}>{job.employmentType}</Text>
                    </View>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: colors.secondary }]}>Salary</Text>
                        <Text style={styles.statValue}>₹ {job.salary || 'N/A'}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: colors.secondary }]}>Experience</Text>
                        <Text style={styles.statValue}>{job.experience}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: colors.secondary }]}>Job Type</Text>
                        <Text style={styles.statValue}>{job.schedule || 'Full-time'}</Text>
                    </View>
                </View>

                {/* Tabs / Sections */}
                <View style={[styles.section, { borderTopLeftRadius: 30, borderTopRightRadius: 30 }]}>
                    <Title style={styles.sectionTitle}>Description</Title>
                    <Paragraph style={styles.descriptionText}>
                        {job.description}
                    </Paragraph>
                </View>

                <View style={styles.section}>
                    <Title style={styles.sectionTitle}>Requirements & Skills</Title>
                    <View style={styles.chipContainer}>
                        {job.skills && job.skills.map((skill, index) => (
                            <Chip key={index} style={styles.chip} textStyle={{ fontSize: 13, color: '#444' }}>{skill}</Chip>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Title style={styles.sectionTitle}>Contact Info</Title>
                    <View style={styles.contactRow}>
                        <Icon name="email" size={20} color={colors.primary} />
                        <Text style={styles.contactText}>{job.contactEmail}</Text>
                    </View>
                    <View style={styles.contactRow}>
                        <Icon name="phone" size={20} color={colors.primary} />
                        <Text style={styles.contactText}>{job.contactPhone}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.bottomBar, { paddingBottom: Math.max(16, insets.bottom), bottom: 0 }]}>
                <Button
                    mode="outlined"
                    icon="chat"
                    onPress={handleChat}
                    style={styles.chatButton}
                    labelStyle={{ color: colors.primary }}
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
            </View>
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
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 10,
    },
    saveButton: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    logoContainer: {
        marginBottom: 15,
        elevation: 5,
        borderRadius: 40,
    },
    jobTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    companyName: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    headerMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: '#666',
        marginLeft: 5,
        fontSize: 14,
    },
    dot: {
        marginHorizontal: 8,
        color: '#ccc',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 15,
        marginTop: 2,
        marginBottom: 10,
        justifyContent: 'space-around',
        elevation: 1,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    divider: {
        width: 1,
        backgroundColor: '#eee',
        height: '80%',
    },
    section: {
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#555',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    contactText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 16,
        elevation: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    chatButton: {
        flex: 1,
        marginRight: 10,
        borderRadius: 12,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    applyButton: {
        flex: 2,
        borderRadius: 12,
        paddingVertical: 2,
    }
});

export default JobDetailsScreen;
