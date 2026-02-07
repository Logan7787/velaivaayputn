import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { getChatMessages } from '../../api/chatApi';

// Connect to the Cloud Backend (or Local if testing locally)
// IMPORT BASE_URL from axios config to stay consistent? 
// For now, let's hardcode or better, grab it from a config file if possible.
// But we know axios.config has the right URL.
const SOCKET_URL = 'https://velaivaayputn.onrender.com'; // Or http://10.0.2.2:5000 if local

const ChatScreen = ({ route, navigation }) => {
    const { chatId, otherUser } = route.params;
    const { user } = useSelector(state => state.auth);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Initialize Socket
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // 2. Join Room
        newSocket.emit('join_chat', chatId);

        // 3. Listen for Messages
        newSocket.on('receive_message', (msg) => {
            // Transform to GiftedChat format
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
        });

        // 4. Load History
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
            // GiftedChat expects newest first, backend returns oldest first usually for reading.
            // We need to reverse if backend is ASC. My backend was orderBy createdAt ASC.
            setMessages(formatted.reverse());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onSend = useCallback((newMessages = []) => {
        // Optimistic Update
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

        const msg = newMessages[0];

        // Send to Socket
        if (socket) {
            socket.emit('send_message', {
                chatId,
                senderId: user.id,
                content: msg.text
            });
        }
    }, [socket, chatId, user]);

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: { backgroundColor: '#2196f3' },
                    left: { backgroundColor: '#e0e0e0' }
                }}
            />
        );
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#2196f3" /></View>;
    }

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user.id,
                }}
                renderBubble={renderBubble}
                placeholder="Type a message..."
                showUserAvatar
                alwaysShowSend
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
    }
});

export default ChatScreen;
