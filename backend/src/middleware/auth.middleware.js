import { supabase } from "../config/supabase.js";
import { prisma } from "../config/prisma.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach Supabase auth user to request
    req.user = data.user;

    // Fetch user (and role) from Prisma DB using the Supabase auth user id
    const dbUser = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { role: true },
    });

    if (!dbUser) {
      console.warn(
        "Authenticated Supabase user has no corresponding Prisma user row:",
        data.user.id
      );
      return res
        .status(403)
        .json({ message: "User not found in application database" });
    }

    req.role = dbUser.role; // e.g. "ADMIN", "WARDEN", "STUDENT", ...

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export default authenticate;