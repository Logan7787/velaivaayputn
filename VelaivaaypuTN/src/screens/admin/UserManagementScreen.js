import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Title, Text, Card, Avatar, Button, Switch, ActivityIndicator, Searchbar, Appbar, Chip, useTheme, IconButton, Menu, Divider } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../api/axios.config';

const UserManagementScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
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

        // Search Filter
        if (searchQuery) {
            result = result.filter(u =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Role Filter
        if (filterRole !== 'ALL') {
            result = result.filter(u => u.role === filterRole);
        }

        setFilteredUsers(result);
    }, [searchQuery, users, filterRole]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (userId, currentStatus) => {
        try {
            await api.post('/admin/user-status', { userId });
            const updatedUsers = users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u);
            setUsers(updatedUsers);
        } catch (error) {
            Alert.alert('Error', 'Failed to update user status');
        }
    };

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const bannedUsers = totalUsers - activeUsers;

    const renderItem = ({ item }) => (
        <Card style={styles.userCard} onPress={() => { }}>
            <Card.Content style={styles.cardContent}>
                <View style={styles.userInfo}>
                    <Avatar.Text
                        size={50}
                        label={item.name.substring(0, 2).toUpperCase()}
                        style={{ backgroundColor: item.role === 'EMPLOYER' ? colors.secondary : '#5C6BC0', elevation: 2 }}
                        labelStyle={{ fontWeight: 'bold' }}
                    />
                    <View style={styles.textContainer}>
                        <Title style={styles.userName}>{item.name}</Title>
                        <Text style={styles.userEmail}>{item.email}</Text>
                        <View style={styles.metaRow}>
                            <View style={[styles.roleBadge, { backgroundColor: item.role === 'EMPLOYER' ? '#E0F2F1' : '#E8EAF6' }]}>
                                <Icon name={item.role === 'EMPLOYER' ? 'briefcase' : 'account'} size={12} color={item.role === 'EMPLOYER' ? '#00695C' : '#283593'} />
                                <Text style={[styles.roleText, { color: item.role === 'EMPLOYER' ? '#00695C' : '#283593' }]}>
                                    {item.role}
                                </Text>
                            </View>
                            <Text style={styles.dateText}>Joined {new Date(item.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actionContainer}>
                    <Switch
                        value={item.isActive}
                        onValueChange={() => toggleStatus(item.id, item.isActive)}
                        color={colors.primary}
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <Text style={[styles.statusText, { color: item.isActive ? '#4CAF50' : '#F44336' }]}>
                        {item.isActive ? 'Active' : 'Banned'}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Premium Header */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Title style={styles.headerTitle}>User Management</Title>
                    <IconButton icon="dots-vertical" iconColor="#fff" size={24} onPress={() => { }} />
                </View>

                {/* Search Bar in Header */}
                <Searchbar
                    placeholder="Search users by name or email..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={{ fontSize: 14 }}
                    iconColor={colors.primary}
                    elevation={2}
                />
            </View>

            {/* Content Listing */}
            <View style={styles.contentContainer}>
                {/* Quick Filter Tabs */}
                <View style={styles.filterRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {['ALL', 'JOBSEEKER', 'EMPLOYER'].map(role => (
                            <TouchableOpacity
                                key={role}
                                style={[styles.filterChip, filterRole === role && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                                onPress={() => setFilterRole(role)}
                            >
                                <Text style={[styles.filterText, filterRole === role && { color: '#fff' }]}>
                                    {role === 'ALL' ? 'All Users' : role === 'JOBSEEKER' ? 'Job Seekers' : 'Employers'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Summary Stats Row */}
                <View style={styles.statsRow}>
                    <Text style={styles.statsText}>
                        Total: <Text style={{ fontWeight: 'bold' }}>{filteredUsers.length}</Text>
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.dotItem}>
                            <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
                            <Text style={styles.dotText}>{activeUsers} Active</Text>
                        </View>
                        <View style={[styles.dotItem, { marginLeft: 10 }]}>
                            <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
                            <Text style={styles.dotText}>{bannedUsers} Banned</Text>
                        </View>
                    </View>
                </View>

                {loading ? (
                    <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
                ) : (
                    <FlatList
                        data={filteredUsers}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Icon name="account-search-outline" size={60} color="#ddd" />
                                <Text style={{ color: '#888', marginTop: 15, fontSize: 16 }}>No users found matching filters.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA'
    },
    header: {
        paddingTop: 10,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 6,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchBar: {
        elevation: 0,
        backgroundColor: '#fff',
        borderRadius: 12,
        height: 46,
    },
    contentContainer: {
        flex: 1,
        marginTop: 10,
    },
    filterRow: {
        marginBottom: 10,
        height: 40,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 10,
        justifyContent: 'center',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    statsText: {
        color: '#666',
        fontSize: 14,
    },
    dotItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    dotText: {
        fontSize: 12,
        color: '#777',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    list: {
        padding: 16,
        paddingTop: 5,
    },
    userCard: {
        marginBottom: 14,
        borderRadius: 16,
        backgroundColor: '#fff',
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    textContainer: {
        marginLeft: 14,
        flex: 1
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
        color: '#333'
    },
    userEmail: {
        fontSize: 13,
        color: '#777',
        marginBottom: 6
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginRight: 10,
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    dateText: {
        fontSize: 11,
        color: '#999'
    },
    actionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 8
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60
    }
});

export default UserManagementScreen;
