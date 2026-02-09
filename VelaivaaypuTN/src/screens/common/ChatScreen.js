import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Text } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar, Message } from 'react-native-gifted-chat';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessages } from '../../api/chatApi';
import { receiveMessage } from '../../redux/chatSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Use a consistent Socket URL
const SOCKET_URL = 'https://velaivaayputn.onrender.com';

const ChatScreen = ({ route, navigation }) => {
    const { chatId, otherUser } = route.params;
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: otherUser?.name || 'Chat',
            headerShown: true
        });
    }, [otherUser]);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => console.log('[Socket] Connected to server'));
        newSocket.on('connect_error', (err) => console.error('[Socket] Connection Error:', err.message));

        newSocket.emit('join_chat', chatId);
        console.log('[Socket] Joining chat:', chatId);

        newSocket.on('receive_message', (msg) => {
            console.log('[Socket] Received new message:', msg.id);
            const giftedMessage = {
                _id: msg.id,
                text: msg.content,
                createdAt: new Date(msg.createdAt),
                user: {
                    _id: msg.senderId,
                    name: msg.sender?.name,
                    avatar: msg.sender?.profileImage
                }
            };

            setMessages(previousMessages => GiftedChat.append(previousMessages, giftedMessage));

            // Sync with ChatList in Redux
            dispatch(receiveMessage({ chatId, message: msg }));
        });

        fetchHistory();

        return () => newSocket.disconnect();
    }, [chatId]);

    const fetchHistory = async () => {
        try {
            console.log('[Chat] Fetching history for:', chatId);
            const history = await getChatMessages(chatId);
            console.log('[Chat] History received, count:', history.length);
            const formatted = history.map(msg => ({
                _id: msg.id,
                text: msg.content,
                createdAt: new Date(msg.createdAt),
                user: {
                    _id: msg.senderId,
                    name: msg.sender?.name,
                    avatar: msg.sender?.profileImage
                }
            }));
            setMessages(formatted.reverse());
        } catch (error) {
            console.error('History Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSend = useCallback((newMessages = []) => {
        const msg = newMessages[0];

        if (socket) {
            socket.emit('send_message', {
                chatId,
                senderId: user.id,
                content: msg.text
            });
        }
    }, [socket, chatId, user]);

    const renderBubble = (props) => {
        const { key, ...rest } = props;
        return (
            <Bubble
                {...rest}
                wrapperStyle={{
                    right: { backgroundColor: colors.primary },
                    left: { backgroundColor: '#f0f0f0' }
                }}
                textStyle={{
                    right: { color: '#fff' },
                    left: { color: '#333' }
                }}
            />
        );
    };

    const renderSend = (props) => {
        const { key, ...rest } = props;
        return (
            <Send {...rest}>
                <View style={styles.sendButton}>
                    <Icon name="send" size={24} color={colors.primary} />
                </View>
            </Send>
        );
    };

    const renderMessage = (props) => {
        const { key, ...rest } = props;
        return <Message key={key} {...rest} />;
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: '#fff' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!user) return null;

    console.log('[Chat] Rendering with messages:', messages.length, 'User:', user?.id);

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: user?.id,
                        name: user?.name,
                        avatar: user?.profileImage
                    }}
                    renderMessage={renderMessage}
                    renderBubble={renderBubble}
                    renderSend={renderSend}
                    placeholder="Type a message..."
                    showUserAvatar
                    alwaysShowSend
                    scrollToBottom
                    infiniteScroll
                    renderUsernameOnMessage
                    renderChatEmpty={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
                        </View>
                    )}
                    renderInputToolbar={(props) => {
                        const { key, ...rest } = props;
                        return (
                            <InputToolbar
                                {...rest}
                                containerStyle={styles.inputToolbar}
                            />
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendButton: {
        marginRight: 10,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputToolbar: {
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        backgroundColor: '#fff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scaleY: -1 }] // GiftedChat inverted list
    },
    emptyText: {
        marginTop: 10,
        color: '#94A3B8',
        fontSize: 14,
    }
});

export default ChatScreen;
