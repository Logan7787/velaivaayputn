import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
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

    const renderItem = ({ item }) => (
        <Card style={styles.userCard}>
            <Card.Content style={styles.cardContent}>
                <View style={styles.userInfo}>
                    <Avatar.Text
                        size={46}
                        label={item.name.substring(0, 2).toUpperCase()}
                        style={{ backgroundColor: item.role === 'EMPLOYER' ? colors.secondary : colors.primary }}
                    />
                    <View style={styles.textContainer}>
                        <Title style={styles.userName}>{item.name}</Title>
                        <Text style={styles.userEmail}>{item.email}</Text>
                        <View style={styles.metaRow}>
                            <Chip
                                textStyle={{ fontSize: 10, marginVertical: -2 }}
                                style={[styles.roleChip, { backgroundColor: item.role === 'EMPLOYER' ? '#E0F2F1' : '#E3F2FD' }]}
                            >
                                {item.role}
                            </Chip>
                            <Text style={styles.dateText}>Joined: {new Date(item.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actionContainer}>
                    <Text style={{ fontSize: 10, color: item.isActive ? 'green' : 'red', fontWeight: 'bold', marginBottom: 5 }}>
                        {item.isActive ? 'ACTIVE' : 'BANNED'}
                    </Text>
                    <Switch
                        value={item.isActive}
                        onValueChange={() => toggleStatus(item.id, item.isActive)}
                        color={colors.primary}
                    />
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Title>User Management</Title>
                <View style={{ width: 24 }} />
            </View>

            {/* Filters */}
            <View style={styles.filterSection}>
                <Searchbar
                    placeholder="Search users..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={{ fontSize: 14 }}
                />
                <View style={styles.roleTabs}>
                    {['ALL', 'JOBSEEKER', 'EMPLOYER'].map(role => (
                        <TouchableOpacity
                            key={role}
                            style={[styles.roleTab, filterRole === role && { backgroundColor: colors.primary }]}
                            onPress={() => setFilterRole(role)}
                        >
                            <Text style={[styles.roleTabText, filterRole === role && { color: '#fff' }]}>{role}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Icon name="account-off" size={50} color="#ccc" />
                            <Text style={{ color: '#888', marginTop: 10 }}>No users found.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        elevation: 2
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterSection: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    searchBar: {
        elevation: 0,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        height: 48,
        marginBottom: 12
    },
    roleTabs: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 4
    },
    roleTab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 6,
        borderRadius: 8
    },
    roleTabText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666'
    },
    list: {
        padding: 16
    },
    userCard: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 1
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    textContainer: {
        marginLeft: 12,
        flex: 1
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20
    },
    userEmail: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roleChip: {
        height: 22,
        marginRight: 8
    },
    dateText: {
        fontSize: 11,
        color: '#999'
    },
    actionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50
    }
});

export default UserManagementScreen;
