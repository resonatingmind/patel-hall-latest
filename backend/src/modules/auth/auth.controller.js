import { signUpService, checkUserService } from "./auth.service.js";

const signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName, rollNo, roomNo, year } =
      req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await signUpService({
      email,
      password,
      firstName,
      lastName,
      rollNo,
      roomNo,
      year,
    });

    res.status(201).json({
      message:
        "Registration successful! Please check your email for a confirmation link.",
      user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const result = await checkUserService(email);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { signUp, checkUser };
