// Role-based access control middleware
// Usage: authorizeRoles('admin') or authorizeRoles('admin', 'client')
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized – Please login' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden – Role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
