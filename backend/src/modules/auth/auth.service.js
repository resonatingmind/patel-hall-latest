import { prisma } from "../../config/prisma.js";
import { supabase as supabaseAdmin } from "../../config/supabase.js";

const ROLL_NO_REGEX = /^\d{2}[A-Z]{2}\d{5}$/; // e.g., 24PH10032
const ROOM_NO_REGEX = /^[A-Z]\d{3}$/; // e.g., B110
const YEAR_REGEX = /^[1-9]$/; // Single digit 1-9

/**
 * Registers a new student in Supabase Auth and the Prisma database.
 * A confirmation email is sent automatically by Supabase.
 */
const signUpService = async ({
  email,
  password,
  firstName,
  lastName,
  rollNo,
  roomNo,
  year,
}) => {
  // ── Validation ──────────────────────────────────────────────────────────────
  if (!firstName?.trim()) throw new Error("First Name is required.");

  if (!email?.endsWith("@kgpian.iitkgp.ac.in"))
    throw new Error("Please use your institute email (@kgpian.iitkgp.ac.in).");

  if (!ROLL_NO_REGEX.test(rollNo))
    throw new Error("Invalid Roll Number format. Expected format: 24MA10032");

  if (!roomNo?.trim()) throw new Error("Room Number is required.");
  if (!ROOM_NO_REGEX.test(roomNo))
    throw new Error(
      "Invalid Room Number format. Expected format: C210 (Block + 3 digits)",
    );

  if (!year?.trim()) throw new Error("Year is required.");
  if (!YEAR_REGEX.test(year))
    throw new Error("Year must be a single digit (1-9).");

  // ── Duplicate check ──────────────────────────────────────────────────────────
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("A user with this email already exists.");

  // ── Create user in Supabase Auth ─────────────────────────────────────────────
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: false, // Supabase will send a confirmation email
    user_metadata: {
      first_name: firstName,
      last_name: lastName ?? "",
      roll_no: rollNo,
      room_no: roomNo,
      year,
    },
  });

  if (error) throw new Error(error.message);

  const authUser = data.user;

  // ── Create user record in Prisma ─────────────────────────────────────────────
  const user = await prisma.user.create({
    data: {
      id: authUser.id,
      email: authUser.email,
      role: "STUDENT",
      firstName,
      lastName: lastName ?? null,
      rollNo,
      roomNo,
      year,
    },
  });

  return user;
};

/**
 * Checks whether a user with the given email already exists in the database.
 */
const checkUserService = async (email) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  return { exists: !!existing };
};

export { signUpService, checkUserService };
