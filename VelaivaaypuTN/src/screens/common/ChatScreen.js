import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessages } from '../../api/chatApi';
import { receiveMessage } from '../../redux/chatSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

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

        newSocket.emit('join_chat', chatId);

        newSocket.on('receive_message', (msg) => {
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
            const history = await getChatMessages(chatId);
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

    const renderBubble = (props) => (
        <Bubble
            {...props}
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

    const renderSend = (props) => (
        <Send {...props}>
            <View style={styles.sendButton}>
                <Icon name="send" size={24} color={colors.primary} />
            </View>
        </Send>
    );

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user.id,
                    name: user.name,
                }}
                renderBubble={renderBubble}
                renderSend={renderSend}
                placeholder="Type a message..."
                showUserAvatar
                alwaysShowSend
                scrollToBottom
                infiniteScroll
            />
        </View>
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
    }
});

export default ChatScreen;
