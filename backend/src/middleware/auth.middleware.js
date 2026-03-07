import { supabase } from "../config/supabase.js";

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

    // attach user to request
    req.user = data.user;

    // Fetch user from Supabase to attach role
    const { data: dbUser } = await supabase
      .from('User')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (dbUser) {
      req.role = dbUser.role;
    }

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export default authenticate;