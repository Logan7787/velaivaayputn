import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const VerifiedBadge = ({ size = 20, showLabel = false, style }) => {
    return (
        <View style={[styles.container, style]}>
            <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
                <Icon name="check-bold" size={size * 0.7} color="#fff" />
            </View>
            {showLabel && (
                <Text style={[styles.label, { fontSize: size * 0.6 }]}>
                    Verified
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#3B82F6', // Verified Blue
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        marginLeft: 4,
        color: '#3B82F6',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    }
});

export default VerifiedBadge;
