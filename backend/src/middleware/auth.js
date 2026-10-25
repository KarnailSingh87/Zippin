import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "greatstack";
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  const roles = req.user?.roles || [];
  const hasAccess =
    roles.includes("admin") ||
    roles.includes("super_admin") ||
    roles.includes("store_manager");
  if (!req.user || !hasAccess) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    const hasRole = roles.some(
      (r) => allowedRoles.includes(r) || r === "super_admin" || r === "admin"
    );
    if (!req.user || !hasRole) {
      return res.status(403).json({
        message: `Forbidden: requires role (${allowedRoles.join(", ")})`,
      });
    }
    next();
  };
}
