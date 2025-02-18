const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const { user } = req;

    console.log("🛑 Middleware Authorize:");
    console.log("🔑 Allowed Roles (before flatten):", allowedRoles);

    // 🔥 Asegurar que allowedRoles sea un array plano
    const flatRoles = allowedRoles.flat();

    console.log("🔑 Allowed Roles (after flatten):", flatRoles);
    console.log("👤 User Role from Token:", `"${user.role}"`);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: No user found in request." });
    }

    if (!flatRoles.includes(user.role)) {
      console.log("❌ Access Denied: User role not in allowed roles.");
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }

    console.log("✅ Access Granted!");
    next();
  };
};

module.exports = authorize;
