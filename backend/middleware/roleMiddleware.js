// roleMiddleware.js
// Usage: router.delete('/:id', auth, roleMiddleware('admin'), handler)

module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({ message: 'Access denied: no role found' });
    }

    if (req.userRole !== requiredRole) {
      return res.status(403).json({ 
        message: `Access denied: requires '${requiredRole}' role` 
      });
    }

    next();
  };
};
