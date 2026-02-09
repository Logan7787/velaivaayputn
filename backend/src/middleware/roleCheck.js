const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userRole = req.user.role?.toUpperCase();
        const upperAllowedRoles = allowedRoles.map(role => role.toUpperCase());

        console.log(`[RoleCheck] Checking access for role: ${userRole} (Original: ${req.user.role}) against [${upperAllowedRoles.join(', ')}]`);

        if (!userRole || !upperAllowedRoles.includes(userRole)) {
            console.error(`[RoleCheck] Forbidden: User role '${req.user.role}' not in [${allowedRoles.join(', ')}]`);
            return res.status(403).json({
                error: 'Forbidden: Insufficient permissions',
                details: `Role ${req.user.role} not allowed`
            });
        }

        console.log(`[RoleCheck] Access granted`);
        next();
    };
};

module.exports = checkRole;
