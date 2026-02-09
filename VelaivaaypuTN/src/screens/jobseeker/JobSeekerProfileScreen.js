import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { TextInput, Button, Title, Avatar, Appbar, Text, useTheme, Card, List, Divider, Chip, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../api/authApi';
import { loadUser, logoutUser } from '../../redux/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme';
import VerifiedBadge from '../../components/common/VerifiedBadge';

const JobSeekerProfileScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [form, setForm] = useState({
        name: '',
        bio: '',
        phone: '',
        location: '',
        skills: '',
        experience: ''
    });

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(loadUser()).unwrap();
        } catch (error) {
            console.error('Refresh Error:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                bio: user.bio || '',
                phone: user.phone || '',
                location: user.location || '',
                skills: user.skills ? user.skills.join(', ') : '',
                experience: user.experience ? String(user.experience) : ''
            });
        }
    }, [user]);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const updateData = {
                ...form,
                skills: form.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
                experience: parseInt(form.experience) || 0
            };
            await updateProfile(updateData);
            Alert.alert('Success', 'Profile Updated');
            dispatch(loadUser());
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const QuickStat = ({ label, value, icon, color }) => (
        <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
                <Icon name={icon} size={20} color={color} />
            </View>
            <View>
                <Text style={styles.statValText}>{value}</Text>
                <Text style={styles.statLabText}>{label}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Appbar.Header style={{ backgroundColor: '#fff', elevation: 0 }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="My Professional Profile" titleStyle={{ fontWeight: '800' }} />
                {!isEditing && (
                    <IconButton
                        icon="account-edit-outline"
                        onPress={() => setIsEditing(true)}
                        iconColor="#1A5F7A"
                    />
                )}
            </Appbar.Header>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />}
                >
                    {/* Hero Section */}
                    <View style={styles.hero}>
                        <View style={styles.avatarBox}>
                            <Avatar.Text
                                size={120}
                                label={user?.name ? user.name.substring(0, 2).toUpperCase() : 'JS'}
                                style={{ backgroundColor: '#10B981' }}
                                labelStyle={{ fontWeight: '800' }}
                            />
                            {isEditing && (
                                <TouchableOpacity style={styles.cameraBtn}>
                                    <Icon name="camera-plus" size={20} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Title style={styles.profileName}>{user?.name || 'User Name'}</Title>
                            {user?.isVerified && <VerifiedBadge size={22} style={{ marginLeft: 6, marginTop: 4 }} />}
                        </View>
                        <Text style={styles.professionText}>{user?.bio || 'Job Seeker'}</Text>

                        <View style={styles.quickStatsRow}>
                            <QuickStat label="Exp" value={`${user?.experience || 0}y`} icon="briefcase-outline" color="#3B82F6" />
                            <View style={styles.statDivider} />
                            <QuickStat label="Skills" value={user?.skills?.length || 0} icon="xml" color="#8B5CF6" />
                            <View style={styles.statDivider} />
                            <QuickStat label="Location" value={user?.location?.split(',')[0] || 'TN'} icon="map-marker-outline" color="#F43F5E" />
                        </View>
                    </View>

                    {isEditing ? (
                        <View style={styles.formPadding}>
                            <Title style={styles.formTitle}>Edit Professional Details</Title>

                            <TextInput
                                label="Full Name"
                                value={form.name}
                                onChangeText={(val) => handleChange('name', val)}
                                mode="outlined"
                                style={styles.input}
                                outlineStyle={{ borderRadius: 16 }}
                            />

                            <TextInput
                                label="Headline / Current Role"
                                value={form.bio}
                                onChangeText={(val) => handleChange('bio', val)}
                                mode="outlined"
                                style={styles.input}
                                outlineStyle={{ borderRadius: 16 }}
                                placeholder="E.g. Senior Frontend Developer"
                            />

                            <TextInput
                                label="Skills (comma separated)"
                                value={form.skills}
                                onChangeText={(val) => handleChange('skills', val)}
                                mode="outlined"
                                style={styles.input}
                                outlineStyle={{ borderRadius: 16 }}
                                placeholder="React, Node.js, TypeScript"
                            />

                            <View style={styles.rowInputs}>
                                <TextInput
                                    label="Exp (Years)"
                                    value={form.experience}
                                    onChangeText={(val) => handleChange('experience', val)}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                                    outlineStyle={{ borderRadius: 16 }}
                                />
                                <TextInput
                                    label="Location"
                                    value={form.location}
                                    onChangeText={(val) => handleChange('location', val)}
                                    mode="outlined"
                                    style={[styles.input, { flex: 2 }]}
                                    outlineStyle={{ borderRadius: 16 }}
                                />
                            </View>

                            <TextInput
                                label="Phone Number"
                                value={form.phone}
                                onChangeText={(val) => handleChange('phone', val)}
                                mode="outlined"
                                style={styles.input}
                                outlineStyle={{ borderRadius: 16 }}
                                keyboardType="phone-pad"
                            />

                            <View style={styles.formActions}>
                                <Button mode="outlined" onPress={() => setIsEditing(false)} style={styles.formBtn} contentStyle={{ height: 52 }}>Cancel</Button>
                                <Button mode="contained" onPress={handleUpdate} loading={loading} style={[styles.formBtn, { backgroundColor: '#10B981' }]} contentStyle={{ height: 52 }}>Save Profile</Button>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.profileBody}>
                            {/* Skills Section */}
                            <View style={styles.sectionHeader}>
                                <Title style={styles.sectionTitle}>Key Skills</Title>
                                <Icon name="check-decagram" size={20} color="#10B981" />
                            </View>
                            <View style={styles.skillsCloud}>
                                {user?.skills && user.skills.length > 0 ? (
                                    user.skills.map((skill, index) => (
                                        <Chip key={index} style={styles.skillChip} textStyle={styles.skillChipText}>
                                            {skill}
                                        </Chip>
                                    ))
                                ) : (
                                    <Text style={styles.emptyMsg}>No skills added yet.</Text>
                                )}
                            </View>

                            {/* Contact Surface */}
                            <Card style={styles.infoCard}>
                                <Card.Content>
                                    <List.Item
                                        title="Email Address"
                                        description={user?.email}
                                        left={props => <List.Icon {...props} icon="email-check" color="#10B981" />}
                                        style={styles.innerListItem}
                                    />
                                    <Divider style={styles.innerDivider} />
                                    <List.Item
                                        title="Phone Number"
                                        description={user?.phone || 'Add phone number'}
                                        left={props => <List.Icon {...props} icon="cellphone-sound" color="#10B981" />}
                                        style={styles.innerListItem}
                                    />
                                    <Divider style={styles.innerDivider} />
                                    <List.Item
                                        title="Subscription Status"
                                        description={user?.subscription?.tier || 'FREE'}
                                        left={props => <List.Icon {...props} icon="star-face" color="#FBC02D" />}
                                        right={() => <Button mode="text" labelStyle={{ fontWeight: '800', color: '#10B981' }} onPress={() => navigation.navigate('Subscription')}>Upgrade</Button>}
                                        style={styles.innerListItem}
                                    />
                                </Card.Content>
                            </Card>

                            <Button
                                mode="outlined"
                                icon="logout"
                                color="#EF4444"
                                style={styles.logoutBtn}
                                contentStyle={{ height: 50 }}
                                labelStyle={{ fontWeight: 'bold' }}
                                onPress={() => dispatch(logoutUser())}
                            >
                                Sign Out
                            </Button>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scroll: { paddingBottom: 60 },
    hero: { alignItems: 'center', padding: 30, backgroundColor: '#fff' },
    avatarBox: { position: 'relative', marginBottom: 20, ...theme.shadows.medium },
    cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1E293B', borderRadius: 20, width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff' },
    profileName: { fontSize: 28, fontWeight: '900', color: '#1E293B', textAlign: 'center' },
    professionText: { fontSize: 16, color: '#64748B', marginTop: 4, fontWeight: '600', letterSpacing: 0.5 },
    quickStatsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24, paddingVertical: 16, paddingHorizontal: 20, backgroundColor: '#F8FAFC', borderRadius: 24, ...theme.shadows.small },
    statItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    statValText: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
    statLabText: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
    statDivider: { width: 1, height: 24, backgroundColor: '#E2E8F0', mx: 12 },
    formPadding: { paddingHorizontal: 20 },
    formTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 20 },
    input: { marginBottom: 16, backgroundColor: '#fff' },
    rowInputs: { flexDirection: 'row', marginBottom: 0 },
    formActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
    formBtn: { flex: 1, borderRadius: 16 },
    profileBody: { paddingHorizontal: 20 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
    skillsCloud: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
    skillChip: { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5', borderWidth: 1 },
    skillChipText: { color: '#065F46', fontWeight: '700', fontSize: 13 },
    infoCard: { borderRadius: 24, backgroundColor: '#F8FAFC', elevation: 0, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 },
    innerListItem: { paddingLeft: 0, paddingVertical: 12 },
    innerDivider: { backgroundColor: '#F1F5F9' },
    logoutBtn: { marginTop: 10, borderRadius: 16, borderColor: '#FED7D7', borderWidth: 1 },
    emptyMsg: { color: '#94A3B8', fontSize: 14, fontStyle: 'italic' }
});

export default JobSeekerProfileScreen;
