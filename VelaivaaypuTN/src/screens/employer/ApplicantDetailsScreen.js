import React from 'react';
import { View, StyleSheet, ScrollView, Linking, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Button, Chip, Divider, IconButton, Surface, useTheme } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ApplicantDetailsScreen = ({ route, navigation }) => {
    const { applicant, message } = route.params;
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const handleCall = () => {
        Linking.openURL(`tel:${applicant.phone}`);
    };

    const handleEmail = () => {
        Linking.openURL(`mailto:${applicant.email}`);
    };

    const Header = () => (
        <View style={[styles.headerContainer, { backgroundColor: theme.colors.primary }]}>
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
                    <View style={{ width: 48 }} />
                </View>
            </SafeAreaView>
            <View style={styles.headerBackground} />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
            <Header />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Avatar Section - Overlapping Header */}
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
                    <View style={[styles.infoItem, { borderColor: theme.colors.outlineVariant }]}>
                        <MaterialIcons name="work-outline" size={24} color={theme.colors.primary} />
                        <Text variant="labelLarge" style={{ marginTop: 4 }}>{applicant.experience || '0'} Years</Text>
                        <Text variant="bodySmall" style={{ color: 'gray' }}>Experience</Text>
                    </View>
                    <View style={[styles.infoItem, { borderColor: theme.colors.outlineVariant }]}>
                        <MaterialIcons name="verified" size={24} color={theme.colors.primary} />
                        <Text variant="labelLarge" style={{ marginTop: 4 }}>Verified</Text>
                        <Text variant="bodySmall" style={{ color: 'gray' }}>Status</Text>
                    </View>
                </View>

                {/* Application Message */}
                <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
                    <Card.Title
                        title="Application Message"
                        left={(props) => <MaterialIcons {...props} name="chat-bubble-outline" size={24} color={theme.colors.primary} />}
                    />
                    <Card.Content>
                        <View style={[styles.messageBox, { backgroundColor: theme.colors.elevation.level1 }]}>
                            <Text style={{ fontStyle: 'italic', color: theme.colors.onSurfaceVariant }}>
                                "{message}"
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* Professional Skills */}
                <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
                    <Card.Title
                        title="Professional Skills"
                        left={(props) => <MaterialIcons {...props} name="psychology" size={24} color={theme.colors.primary} />}
                    />
                    <Card.Content>
                        <View style={styles.skillsContainer}>
                            {applicant.skills && applicant.skills.length > 0 ? (
                                applicant.skills.map((skill, index) => (
                                    <Chip
                                        key={index}
                                        style={[styles.skillChip, { backgroundColor: theme.colors.secondaryContainer }]}
                                        textStyle={{ color: theme.colors.onSecondaryContainer }}
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
    headerContainer: {
        height: 180,
    },
    safeArea: {
        width: '100%',
    },
    appBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        height: 56,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: -60, // Negative margin to overlap
        marginBottom: 20,
    },
    avatarContainer: {
        borderRadius: 50,
        padding: 4,
        backgroundColor: '#fff',
    },
    nameText: {
        marginTop: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
        gap: 15,
    },
    infoItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        minWidth: 100,
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
    },
    messageBox: {
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#ccc',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillChip: {
        borderRadius: 20,
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
        gap: 16,
    },
    actionButton: {
        flex: 1,
        borderRadius: 8,
    }
});

export default ApplicantDetailsScreen;
