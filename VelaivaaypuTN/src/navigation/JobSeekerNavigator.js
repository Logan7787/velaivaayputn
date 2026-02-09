import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import JobSeekerHomeScreen from '../screens/jobseeker/HomeScreen';

import JobDetailsScreen from '../screens/jobseeker/JobDetailsScreen';

import SubscriptionScreen from '../screens/common/SubscriptionScreen';
import ChatListScreen from '../screens/common/ChatListScreen';
import ChatScreen from '../screens/common/ChatScreen';
import JobSeekerProfileScreen from '../screens/jobseeker/JobSeekerProfileScreen';

const Stack = createStackNavigator();

const JobSeekerNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="JobSeekerHome" component={JobSeekerHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Messages' }} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={JobSeekerProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default JobSeekerNavigator;
