export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session?.role) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    return next();
  };
}
