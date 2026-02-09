import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EmployerDashboard from '../screens/employer/DashboardScreen';
import SubscriptionScreen from '../screens/common/SubscriptionScreen';
import PostJobScreen from '../screens/employer/PostJobScreen';
import JobApplicationsScreen from '../screens/employer/JobApplicationsScreen';
import ApplicantDetailsScreen from '../screens/employer/ApplicantDetailsScreen';
import ChatListScreen from '../screens/common/ChatListScreen';
import ChatScreen from '../screens/common/ChatScreen';
import EmployerProfileScreen from '../screens/employer/EmployerProfileScreen';

const Stack = createStackNavigator();

const EmployerNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="EmployerDashboard" component={EmployerDashboard} options={{ headerShown: false }} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PostJob" component={PostJobScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={EmployerProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="JobApplications" component={JobApplicationsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ApplicantDetails" component={ApplicantDetailsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Messages' }} />
            <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
    );
};

export default EmployerNavigator;
