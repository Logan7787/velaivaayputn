import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboard from '../screens/admin/DashboardScreen';

const Stack = createStackNavigator();

const AdminNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
            {/* Add UserManagement screens here */}
        </Stack.Navigator>
    );
};

export default AdminNavigator;
