import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { List, Avatar, Text, useTheme, Divider, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from '../../redux/chatSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatListScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { conversations, loading } = useSelector(state => state.chat);
    const { user } = useSelector(state => state.auth);
    const [searchQuery, setSearchQuery] = React.useState('');

    useEffect(() => {
        dispatch(fetchConversations());
    }, [dispatch]);

    const onRefresh = () => {
        dispatch(fetchConversations());
    };

    const getOtherUser = (item) => {
        return user.role === 'EMPLOYER' ? item.jobSeeker : item.employer;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const renderItem = ({ item }) => {
        const otherUser = getOtherUser(item);
        const lastMessage = item.messages?.[0];

        return (
            <List.Item
                title={otherUser?.name || 'User'}
                description={lastMessage?.content || 'No messages yet'}
                descriptionNumberOfLines={1}
                titleStyle={{ fontWeight: 'bold' }}
                left={props => (
                    <Avatar.Text
                        {...props}
                        size={50}
                        label={otherUser?.name ? otherUser.name.substring(0, 2).toUpperCase() : 'U'}
                        style={{ backgroundColor: colors.primary }}
                    />
                )}
                right={() => (
                    <View style={styles.rightContent}>
                        <Text style={styles.time}>{formatDate(item.updatedAt)}</Text>
                        {item.job && (
                            <View style={styles.jobTag}>
                                <Text style={styles.jobText}>{item.job.title}</Text>
                            </View>
                        )}
                    </View>
                )}
                onPress={() => navigation.navigate('Chat', { chatId: item.id, otherUser })}
                style={styles.listItem}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>

            <Searchbar
                placeholder="Search conversations..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                iconColor={colors.primary}
            />

            {loading && conversations.length === 0 ? (
                <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
            ) : conversations.length === 0 ? (
                <View style={styles.center}>
                    <Icon name="message-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No conversations yet</Text>
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={Divider}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[colors.primary]} />
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    searchBar: {
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 12,
        elevation: 1,
        height: 45,
    },
    listItem: {
        paddingVertical: 10,
    },
    rightContent: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    time: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    jobTag: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    jobText: {
        fontSize: 10,
        color: '#666',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 10,
        color: '#999',
        fontSize: 16,
    }
});

export default ChatListScreen;
