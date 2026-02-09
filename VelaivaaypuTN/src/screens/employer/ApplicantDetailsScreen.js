import React from 'react';
import { View, StyleSheet, ScrollView, Linking, Dimensions, StatusBar, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Text, Card, Avatar, Button, Chip, Divider, IconButton, Surface, useTheme, Menu, TextInput } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { initiateChat } from '../../api/chatApi';
import { updateApplicationStatus } from '../../api/jobApi';
import { useDispatch } from 'react-redux';
import { showToast } from '../../redux/uiSlice';

const { width } = Dimensions.get('window');

const ApplicantDetailsScreen = ({ route, navigation }) => {
    const { applicant, message, jobId, applicationId, currentStatus, notes: initialNotes } = route.params;
    const theme = useTheme();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const [status, setStatus] = React.useState(currentStatus);
    const [notes, setNotes] = React.useState(initialNotes || '');
    const [savingNotes, setSavingNotes] = React.useState(false);
    const [menuVisible, setMenuVisible] = React.useState(false);

    const STATUS_OPTIONS = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED'];

    const handleCall = () => {
        Linking.openURL(`tel:${applicant.phone}`);
    };

    const handleEmail = () => {
        Linking.openURL(`mailto:${applicant.email}`);
    };

    const handleChat = async () => {
        try {
            const chat = await initiateChat(jobId, applicant.id);
            navigation.navigate('Chat', {
                chatId: chat.id,
                otherUser: { name: applicant.name }
            });
        } catch (error) {
            dispatch(showToast({ message: 'Failed to start chat', type: 'error' }));
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        setMenuVisible(false);
        try {
            await updateApplicationStatus(applicationId, newStatus);
            setStatus(newStatus);
            dispatch(showToast({ message: `Status updated to ${newStatus}`, type: 'success' }));
        } catch (error) {
            dispatch(showToast({ message: 'Failed to update status', type: 'error' }));
        }
    };

    const handleSaveNotes = async () => {
        setSavingNotes(true);
        try {
            await updateApplicationStatus(applicationId, status, notes);
            dispatch(showToast({ message: 'Notes saved successfully', type: 'success' }));
        } catch (error) {
            dispatch(showToast({ message: 'Failed to save notes', type: 'error' }));
        } finally {
            setSavingNotes(false);
        }
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'SHORTLISTED': return '#0EA5E9';
            case 'HIRED': return '#10B981';
            case 'REJECTED': return '#EF4444';
            case 'INTERVIEW': return '#F59E0B';
            default: return '#64748B';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Absolute Header Background */}
            <View style={[styles.headerBackground, { backgroundColor: theme.colors.primary }]} />

            {/* Sticky Header / AppBar */}
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.appBar}>
                    <IconButton
                        icon="arrow-left"
                        iconColor={theme.colors.onPrimary}
                        size={24}
                        onPress={() => navigation.goBack()}
                    />
                    <Text variant="titleMedium" style={{ color: theme.colors.onPrimary, fontWeight: '600' }}>
                        Applicant Profile
                    </Text>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <IconButton
                                icon="dots-vertical"
                                iconColor={theme.colors.onPrimary}
                                size={24}
                                onPress={() => setMenuVisible(true)}
                            />
                        }
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <Menu.Item
                                key={opt}
                                onPress={() => handleStatusUpdate(opt)}
                                title={opt}
                                titleStyle={{ color: opt === status ? theme.colors.primary : '#333', fontWeight: opt === status ? 'bold' : 'normal' }}
                            />
                        ))}
                    </Menu>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Avatar Section */}
                <View style={styles.profileSection}>
                    <Surface style={styles.avatarContainer} elevation={4}>
                        <Avatar.Text
                            size={100}
                            label={applicant.name.substring(0, 2).toUpperCase()}
                            style={{ backgroundColor: theme.colors.secondary }}
                            labelStyle={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}
                        />
                    </Surface>
                    <Text variant="headlineMedium" style={[styles.nameText, { color: theme.colors.text }]}>
                        {applicant.name}
                    </Text>
                    <View style={styles.locationContainer}>
                        <MaterialIcons name="location-on" size={16} color={theme.colors.secondary} />
                        <Text variant="bodyMedium" style={{ color: theme.colors.secondary, marginLeft: 4 }}>
                            {applicant.location || 'Location N/A'}
                        </Text>
                    </View>
                </View>

                {/* Quick Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <MaterialIcons name="work-outline" size={28} color={theme.colors.primary} />
                        <Text style={styles.infoLabel}>{applicant.experience || '0'} Years</Text>
                        <Text style={styles.infoSub}>Experience</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <MaterialIcons name="verified" size={28} color={getStatusColor(status)} />
                        <Text style={[styles.infoLabel, { color: getStatusColor(status) }]}>{status}</Text>
                        <Text style={styles.infoSub}>Status</Text>
                    </View>
                </View>

                {/* Application Message */}
                <Card style={styles.card} mode="elevated">
                    <Card.Title
                        title="Application Message"
                        titleStyle={{ fontWeight: 'bold' }}
                        left={(props) => <MaterialIcons {...props} name="chat-bubble-outline" size={24} color={theme.colors.primary} />}
                    />
                    <Card.Content>
                        <View style={styles.messageBox}>
                            <Text style={{ fontStyle: 'italic', color: '#555', fontSize: 16, lineHeight: 24 }}>
                                "{message}"
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* Professional Skills */}
                <Card style={styles.card} mode="elevated">
                    <Card.Title
                        title="Professional Skills"
                        titleStyle={{ fontWeight: 'bold' }}
                        left={(props) => <MaterialIcons {...props} name="psychology" size={24} color={theme.colors.primary} />}
                    />
                    <Card.Content>
                        <View style={styles.skillsContainer}>
                            {applicant.skills && applicant.skills.length > 0 ? (
                                applicant.skills.map((skill, index) => (
                                    <Chip
                                        key={index}
                                        style={styles.skillChip}
                                        textStyle={{ color: '#5E35B1', fontWeight: '600' }}
                                    >
                                        {skill}
                                    </Chip>
                                ))
                            ) : (
                                <Text style={{ color: 'gray' }}>No skills listed.</Text>
                            )}
                        </View>
                    </Card.Content>
                </Card>

                {/* Private Notes Section */}
                <Card style={styles.card} mode="elevated">
                    <Card.Title
                        title="Private Candidate Notes"
                        titleStyle={{ fontWeight: 'bold' }}
                        left={(props) => <MaterialIcons {...props} name="note-add" size={24} color={theme.colors.primary} />}
                    />
                    <Card.Content>
                        <Paragraph style={styles.notesHelp}>
                            Only visible to your recruitment team.
                        </Paragraph>
                        <TextInput
                            mode="outlined"
                            placeholder="Add interview feedback or general thoughts..."
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={4}
                            style={styles.notesInput}
                            outlineStyle={{ borderRadius: 12 }}
                        />
                        <Button
                            mode="contained"
                            onPress={handleSaveNotes}
                            loading={savingNotes}
                            style={styles.saveNotesBtn}
                        >
                            Save Notes
                        </Button>
                    </Card.Content>
                </Card>

                {/* Bio / About */}
                <Card style={[styles.card, { marginBottom: 100, backgroundColor: theme.colors.surface }]} mode="elevated">
                    <Card.Title
                        title="About Candidate"
                        left={(props) => <MaterialIcons {...props} name="person-outline" size={24} color={theme.colors.primary} />}
                    />
                    <Card.Content>
                        <Text style={{ lineHeight: 22, color: theme.colors.onSurface }}>
                            {applicant.bio || 'No bio information provided by this candidate.'}
                        </Text>
                    </Card.Content>
                </Card>
            </ScrollView>

            {/* Sticky Bottom Actions */}
            <Surface style={[styles.bottomActions, { borderTopColor: theme.colors.outlineVariant, paddingBottom: insets.bottom + 16 }]} elevation={4}>
                <Button
                    mode="outlined"
                    icon="email"
                    onPress={handleEmail}
                    style={[styles.actionButton, { borderColor: theme.colors.primary }]}
                    textColor={theme.colors.primary}
                >
                    Email
                </Button>
                <Button
                    mode="contained"
                    icon="chat"
                    onPress={handleChat}
                    style={[styles.actionButton, { backgroundColor: '#1A5F7A' }]}
                >
                    Chat
                </Button>
                <Button
                    mode="contained"
                    icon="phone"
                    onPress={handleCall}
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                >
                    Call
                </Button>
            </Surface>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 180,
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        height: 56,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingTop: 120, // Push content down to overlap properly
        paddingBottom: 100,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        borderRadius: 60,
        padding: 4,
        backgroundColor: '#fff',
        elevation: 6,
    },
    nameText: {
        marginTop: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        fontSize: 24,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
        gap: 16,
    },
    infoItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#DDD',
        borderStyle: 'dashed',
        backgroundColor: '#fff',
        minWidth: 120,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#333',
    },
    infoSub: {
        fontSize: 12,
        color: '#777',
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        elevation: 2,
    },
    messageBox: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        marginTop: 0,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillChip: {
        borderRadius: 12,
        backgroundColor: '#EDE7F6', // Light purple
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        gap: 16,
        elevation: 8,
    },
    actionButton: {
        flex: 1,
        borderRadius: 12,
        borderWidth: 1,
    },
    notesHelp: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 10,
        marginTop: -5,
    },
    notesInput: {
        backgroundColor: '#fff',
        marginBottom: 12,
        fontSize: 14,
    },
    saveNotesBtn: {
        borderRadius: 8,
        backgroundColor: '#1A5F7A',
    }
});

export default ApplicantDetailsScreen;
