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
    let dbUser = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { role: true },
    });

    // Fallback: if no User found by Supabase UID, try email lookup.
    // This handles ID mismatches that can occur during bulk import
    // (Prisma User.id ≠ Supabase auth UID).
    if (!dbUser && data.user.email) {
      const emailUser = await prisma.user.findUnique({
        where: { email: data.user.email },
        select: { id: true, role: true },
      });

      if (emailUser && emailUser.id !== data.user.id) {
        // Auto-sync: update Prisma User ID + FK references to match Supabase UID
        try {
          await prisma.$transaction(async (tx) => {
            await tx.$executeRaw`UPDATE "Student" SET "userId" = ${data.user.id} WHERE "userId" = ${emailUser.id}`;
            await tx.$executeRaw`UPDATE "Administration" SET id = ${data.user.id} WHERE id = ${emailUser.id}`;
            await tx.$executeRaw`UPDATE "User" SET id = ${data.user.id} WHERE id = ${emailUser.id}`;
          });
          console.log(
            `Synced Prisma User ID for ${data.user.email}: ${emailUser.id} → ${data.user.id}`,
          );
        } catch (syncErr) {
          console.error("Failed to sync User ID:", syncErr);
        }
        dbUser = { role: emailUser.role };
      }
    }

    if (!dbUser) {
      console.warn(
        "Authenticated Supabase user has no corresponding Prisma user row:",
        data.user.id,
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
