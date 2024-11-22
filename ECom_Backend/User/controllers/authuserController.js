import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Signup User Only:
const signup = async (req, res) => {
  try {
    const joiSchema = Joi.object({
      name: Joi.string().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}"))
        .required(),
      email: Joi.string()
        .email({ tlds: { allow: ["com", "net"] } })
        .required(),
      role: Joi.string().valid("customer"),
    });

    const { error } = joiSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Signin Admin and User:
const signin = async (req, res) => {
  try {
    const joiSchema = Joi.object({
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}"))
        .required(),
      email: Joi.string()
        .email({ tlds: { allow: ["com", "net"] } })
        .required(),
    });

    const { error } = joiSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Check if account exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role ,name:user.name },
      "ABCD"
      // { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        userId: user._id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

export { signup, signin };
