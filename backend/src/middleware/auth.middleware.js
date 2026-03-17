import { supabase } from "../config/supabase.js";
import { prisma } from "../config/prisma.js";

const authenticate = async (req, res, next) => {
  let step = "init";
  try {
    step = "read-header";
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.error("[AUTH] No Authorization header");
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    step = "supabase-getUser";
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      console.error(
        `[AUTH] Supabase getUser failed at step '${step}':`,
        error?.message ?? "no user returned",
      );
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach Supabase auth user to request
    req.user = data.user;

    step = "prisma-findById";
    // Fetch user (and role) from Prisma DB using the Supabase auth user id
    let dbUser = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { role: true },
    });

    // Fallback: if no User found by Supabase UID, try email lookup.
    // This handles ID mismatches that can occur during bulk import
    // (Prisma User.id ≠ Supabase auth UID).
    if (!dbUser && data.user.email) {
      step = "prisma-findByEmail";
      const emailUser = await prisma.user.findUnique({
        where: { email: data.user.email },
        select: { id: true, role: true },
      });

      if (emailUser && emailUser.id !== data.user.id) {
        step = "prisma-syncId";
        // Auto-sync: update Prisma User ID + FK references to match Supabase UID
        try {
          await prisma.$transaction(async (tx) => {
            await tx.$executeRaw`UPDATE "Student" SET "userId" = ${data.user.id} WHERE "userId" = ${emailUser.id}`;
            await tx.$executeRaw`UPDATE "Administration" SET id = ${data.user.id} WHERE id = ${emailUser.id}`;
            await tx.$executeRaw`UPDATE "User" SET id = ${data.user.id} WHERE id = ${emailUser.id}`;
          });
        } catch (syncErr) {
          console.error("[AUTH] Failed to sync User ID:", syncErr.message);
        }
        dbUser = { role: emailUser.role };
      }
    }

    if (!dbUser) {
      console.warn(
        `[AUTH] No Prisma user row for supabase id=${data.user.id}, email=${data.user.email}`,
      );
      return res
        .status(403)
        .json({ message: "User not found in application database" });
    }

    req.role = dbUser.role; // e.g. "ADMIN", "WARDEN", "STUDENT", ...

    next();
  } catch (err) {
    console.error(`[AUTH] ❌ EXCEPTION at step '${step}':`, err.message);
    console.error(err.stack);
    res
      .status(401)
      .json({
        message: "Authentication failed",
        debugStep: step,
        debugError: err.message,
      });
  }
};

export default authenticate;
