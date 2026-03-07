const authorize = (...roles) => {
  return (req, res, next) => {
    // Simple debug log to help trace role issues in development
    console.log("Authorize middleware:", {
      requiredRoles: roles,
      userRole: req.role,
      userId: req.user?.id,
    });

    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};

export default authorize;
