import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Title, Text, Card, Avatar, Button, Switch, ActivityIndicator, Searchbar, Appbar, Chip, useTheme, IconButton, Menu, Divider, Surface } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAllUsers, toggleUserStatus } from '../../api/adminApi';
import { useDispatch } from 'react-redux';
import { showToast } from '../../redux/uiSlice';

const UserManagementScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('ALL'); // ALL, JOBSEEKER, EMPLOYER

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;

        if (searchQuery) {
            result = result.filter(u =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (filterRole !== 'ALL') {
            result = result.filter(u => u.role === filterRole);
        }

        setFilteredUsers(result);
    }, [searchQuery, users, filterRole]);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error('Fetch Users Error:', error);
            dispatch(showToast({ message: 'Failed to fetch users', type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            await toggleUserStatus(userId);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
            dispatch(showToast({
                message: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
                type: 'success'
            }));
        } catch (error) {
            dispatch(showToast({ message: 'Failed to update user status', type: 'error' }));
        }
    };

    const stats = {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        banned: users.length - users.filter(u => u.isActive).length,
    };

    const renderItem = ({ item }) => (
        <Surface style={styles.userCard} elevation={1}>
            <View style={styles.cardMain}>
                <Avatar.Text
                    size={48}
                    label={item.name.substring(0, 2).toUpperCase()}
                    style={{ backgroundColor: item.role === 'EMPLOYER' ? '#0EA5E9' : '#8B5CF6' }}
                    labelStyle={{ fontWeight: 'bold', fontSize: 18 }}
                />
                <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                        <Title style={styles.userName}>{item.name}</Title>
                        {item.isVerified && (
                            <Icon name="check-decagram" size={16} color="#0EA5E9" style={{ marginLeft: 4 }} />
                        )}
                    </View>
                    <Text style={styles.userEmail}>{item.email}</Text>
                    {item.companyName && <Text style={styles.companyText}>{item.companyName}</Text>}

                    <View style={styles.badgeRow}>
                        <View style={[styles.roleBadge, { backgroundColor: item.role === 'EMPLOYER' ? '#E0F2FE' : '#F5F3FF' }]}>
                            <Text style={[styles.roleText, { color: item.role === 'EMPLOYER' ? '#0369A1' : '#6D28D9' }]}>
                                {item.role}
                            </Text>
                        </View>
                        <Text style={styles.dateText}>Joined {new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                </View>

                <View style={styles.actionCol}>
                    <Switch
                        value={item.isActive}
                        onValueChange={() => handleToggleStatus(item.id, item.isActive)}
                        color="#1A5F7A"
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <Text style={[styles.statusIndicator, { color: item.isActive ? '#10B981' : '#EF4444' }]}>
                        {item.isActive ? 'Active' : 'Banned'}
                    </Text>
                </View>
            </View>
        </Surface>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#1A5F7A" />

            {/* Premium Header */}
            <View style={[styles.header, { backgroundColor: '#1A5F7A' }]}>
                <View style={styles.headerTop}>
                    <IconButton icon="arrow-left" iconColor="#fff" size={24} onPress={() => navigation.goBack()} />
                    <Title style={styles.headerTitle}>User Directory</Title>
                    <IconButton icon="tune-variant" iconColor="#fff" size={24} onPress={() => { }} />
                </View>

                <Searchbar
                    placeholder="Search name, email, or company..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={{ fontSize: 14 }}
                    placeholderTextColor="#94A3B8"
                    iconColor="#1A5F7A"
                    elevation={0}
                />
            </View>

            {/* Statistics Row */}
            <View style={styles.statsRow}>
                <Text style={styles.statsSummary}>Showing {filteredUsers.length} users</Text>
                <View style={styles.dotGroup}>
                    <View style={styles.dotItem}>
                        <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                        <Text style={styles.dotText}>{stats.active} Active</Text>
                    </View>
                    <View style={[styles.dotItem, { marginLeft: 12 }]}>
                        <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                        <Text style={styles.dotText}>{stats.banned} Banned</Text>
                    </View>
                </View>
            </View>

            {/* Role Filter Tabs */}
            <View style={styles.filterTabs}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    {['ALL', 'JOBSEEKER', 'EMPLOYER'].map(role => (
                        <TouchableOpacity
                            key={role}
                            style={[styles.tab, filterRole === role && styles.activeTab]}
                            onPress={() => setFilterRole(role)}
                        >
                            <Text style={[styles.tabText, filterRole === role && styles.activeTabText]}>
                                {role === 'ALL' ? 'Total Base' : role === 'JOBSEEKER' ? 'Job Seekers' : 'Employers'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#1A5F7A" /></View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Icon name="account-search-outline" size={64} color="#CBD5E1" />
                            <Text style={styles.emptyText}>No users found matching your filters.</Text>
                            <Button mode="text" labelStyle={{ color: '#1A5F7A' }} onPress={() => { setSearchQuery(''); setFilterRole('ALL'); }}>Clear Filters</Button>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC'
    },
    header: {
        paddingBottom: 20,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 8,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchBar: {
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 16,
        backgroundColor: '#fff',
        height: 48,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
    },
    statsSummary: {
        color: '#64748B',
        fontSize: 13,
        fontWeight: '600',
    },
    dotGroup: {
        flexDirection: 'row',
    },
    dotItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    dotText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
    },
    filterTabs: {
        marginVertical: 16,
        height: 40,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        marginRight: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    activeTab: {
        backgroundColor: '#1E293B',
        borderColor: '#1E293B',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    activeTabText: {
        color: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    list: {
        padding: 16,
        paddingTop: 0,
        paddingBottom: 40,
    },
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        marginBottom: 12,
    },
    cardMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
        marginLeft: 16,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    userEmail: {
        fontSize: 12,
        color: '#64748B',
        marginTop: -4,
    },
    companyText: {
        fontSize: 12,
        color: '#475569',
        fontStyle: 'italic',
        marginTop: 2,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginRight: 8,
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 10,
        color: '#94A3B8',
    },
    actionCol: {
        alignItems: 'center',
        paddingLeft: 8,
    },
    statusIndicator: {
        fontSize: 10,
        fontWeight: '900',
        marginTop: -4,
        textTransform: 'uppercase',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: '#64748B',
        marginTop: 16,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40,
    }
});

export default UserManagementScreen;
