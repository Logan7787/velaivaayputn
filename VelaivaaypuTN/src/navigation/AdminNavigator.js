import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboard from '../screens/admin/DashboardScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import VerificationCenterScreen from '../screens/admin/VerificationCenterScreen';

const Stack = createStackNavigator();

const AdminNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
            <Stack.Screen name="UserManagement" component={UserManagementScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VerificationCenter" component={VerificationCenterScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AdminNavigator;
