import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { TextInput, Button, Title, Avatar, Appbar, Text, useTheme, Card, List, Switch, Divider, IconButton, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../api/authApi';
import { loadUser, logoutUser } from '../../redux/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme';
import VerifiedBadge from '../../components/common/VerifiedBadge';

const EmployerProfileScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [form, setForm] = useState({
        name: '',
        companyName: '',
        bio: '',
        phone: '',
        location: '',
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
                companyName: user.companyName || '',
                bio: user.bio || '',
                phone: user.phone || '',
                location: user.location || '',
            });
        }
    }, [user]);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateProfile(form);
            Alert.alert('Success', 'Company Profile Updated');
            dispatch(loadUser());
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const StatItem = ({ label, value, icon, color }) => (
        <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: color + '15' }]}>
                <Icon name={icon} size={24} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Appbar.Header style={{ backgroundColor: '#fff', elevation: 0 }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Company Profile" titleStyle={{ fontWeight: '800' }} />
                {!isEditing && (
                    <IconButton
                        icon="pencil-outline"
                        onPress={() => setIsEditing(true)}
                        iconColor="#1A5F7A"
                    />
                )}
            </Appbar.Header>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A5F7A']} />}
                >
                    {/* Header / Branding */}
                    <View style={styles.header}>
                        <View style={styles.avatarWrapper}>
                            <Avatar.Text
                                size={110}
                                label={user?.companyName ? user.companyName.substring(0, 1).toUpperCase() : 'C'}
                                style={{ backgroundColor: '#1A5F7A' }}
                                labelStyle={{ fontWeight: '800' }}
                            />
                            {isEditing && (
                                <TouchableOpacity style={styles.editAvatarBtn}>
                                    <Icon name="camera" size={20} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Title style={styles.companyTitle}>{user?.companyName || 'Set Company Name'}</Title>
                            {user?.isVerified && <VerifiedBadge size={22} style={{ marginLeft: 8, marginTop: 4 }} />}
                        </View>
                        <Text style={styles.adminName}>Managed by {user?.name}</Text>
                    </View>

                    {/* Hiring Stats Dashboard */}
                    <View style={styles.statsRow}>
                        <StatItem label="Total Jobs" value="12" icon="briefcase-check" color="#1A5F7A" />
                        <StatItem label="Active" value="5" icon="flash" color="#10B981" />
                        <StatItem label="Total Apps" value="148" icon="account-group" color="#F59E0B" />
                    </View>

                    {isEditing ? (
                        <View style={styles.formContainer}>
                            <Title style={styles.sectionTitle}>Edit Company Info</Title>

                            <TextInput
                                label="Company Name"
                                value={form.companyName}
                                onChangeText={(val) => handleChange('companyName', val)}
                                mode="outlined"
                                style={styles.input}
                                outlineStyle={{ borderRadius: 16 }}
                            />

                            <TextInput
                                label="Hiring Manager Name"
                                value={form.name}
                                onChangeText={(val) => handleChange('name', val)}
                                mode="outlined"
                                style={styles.input}
                                outlineStyle={{ borderRadius: 16 }}
                            />

                            <TextInput
                                label="Company Bio / Mission"
                                value={form.bio}
                                onChangeText={(val) => handleChange('bio', val)}
                                mode="outlined"
                                multiline
                                numberOfLines={4}
                                style={styles.input}
                                outlineStyle={{ borderRadius: 16 }}
                                placeholder="Describe what your company does..."
                            />

                            <TextInput
                                label="Official Phone"
                                value={form.phone}
                                onChangeText={(val) => handleChange('phone', val)}
                                mode="outlined"
                                style={styles.input}
                                outlineStyle={{ borderRadius: 16 }}
                            />

                            <TextInput
                                label="Headquarters Location"
                                value={form.location}
                                onChangeText={(val) => handleChange('location', val)}
                                mode="outlined"
                                style={styles.input}
                                outlineStyle={{ borderRadius: 16 }}
                            />

                            <View style={styles.actionButtons}>
                                <Button mode="outlined" onPress={() => setIsEditing(false)} style={styles.btn} contentStyle={{ height: 50 }}>Cancel</Button>
                                <Button mode="contained" onPress={handleUpdate} loading={loading} style={[styles.btn, { backgroundColor: '#1A5F7A' }]} contentStyle={{ height: 50 }}>Save Changes</Button>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.viewContainer}>
                            {/* Company Description */}
                            <Card style={styles.card}>
                                <Card.Content>
                                    <Title style={styles.cardTitle}>About Company</Title>
                                    <Paragraph style={styles.bioText}>
                                        {user?.bio || 'No company description provided yet. Add one to attract more candidates.'}
                                    </Paragraph>
                                </Card.Content>
                            </Card>

                            {/* Contact Info List */}
                            <List.Section style={styles.listSection}>
                                <List.Subheader style={styles.listSubheader}>Contact Details</List.Subheader>
                                <List.Item
                                    title="Email Address"
                                    description={user?.email}
                                    left={props => <List.Icon {...props} icon="email-outline" color="#1A5F7A" />}
                                    style={styles.listItem}
                                />
                                <List.Item
                                    title="Phone Number"
                                    description={user?.phone || 'Not specified'}
                                    left={props => <List.Icon {...props} icon="phone-outline" color="#1A5F7A" />}
                                    style={styles.listItem}
                                />
                                <List.Item
                                    title="Location"
                                    description={user?.location || 'Not specified'}
                                    left={props => <List.Icon {...props} icon="map-marker-outline" color="#1A5F7A" />}
                                    style={styles.listItem}
                                />
                            </List.Section>

                            {/* Account Actions */}
                            <Divider style={styles.fullDivider} />
                            <List.Item
                                title="Subscription Plan"
                                description={user?.subscription?.tier || 'FREE'}
                                left={props => <List.Icon {...props} icon="crown" color="#FBC02D" />}
                                right={() => <Button mode="text" labelStyle={{ fontWeight: '800' }} onPress={() => navigation.navigate('Subscription')}>Manage</Button>}
                                style={styles.listItem}
                            />
                            <List.Item
                                title="Sign Out"
                                titleStyle={{ color: '#EF4444', fontWeight: 'bold' }}
                                left={props => <List.Icon {...props} icon="logout" color="#EF4444" />}
                                onPress={() => dispatch(logoutUser())}
                                style={styles.listItem}
                            />
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
    header: { alignItems: 'center', padding: 30, backgroundColor: '#fff' },
    avatarWrapper: { position: 'relative', marginBottom: 20, ...theme.shadows.medium },
    editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1E293B', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
    companyTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', textAlign: 'center' },
    adminName: { fontSize: 16, color: '#64748B', marginTop: 4, fontWeight: '500' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 32 },
    statBox: { flex: 1, alignItems: 'center', padding: 12 },
    statIconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    statValue: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
    statLabel: { fontSize: 12, color: '#64748B', fontWeight: '700', marginTop: 2, textAlign: 'center' },
    formContainer: { paddingHorizontal: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 20 },
    input: { marginBottom: 16, backgroundColor: '#fff' },
    actionButtons: { flexDirection: 'row', gap: 12, marginTop: 10 },
    btn: { flex: 1, borderRadius: 16 },
    viewContainer: { paddingHorizontal: 20 },
    card: { borderRadius: 24, backgroundColor: '#F8FAFC', elevation: 0, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 },
    cardTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 10 },
    bioText: { color: '#475569', fontSize: 15, lineHeight: 22 },
    listSection: { marginTop: 0 },
    listSubheader: { fontSize: 14, fontWeight: '800', color: '#94A3B8', letterSpacing: 1, paddingLeft: 0 },
    listItem: { paddingLeft: 0, paddingVertical: 12 },
    fullDivider: { marginVertical: 8, backgroundColor: '#F1F5F9' }
});

export default EmployerProfileScreen;
