import User from "../../User/models/userModel.js";

// Fetch all user details
const getTotalUsers = async (req, res) => {
  try {
    // Only admin access this
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch all users from the database
    const users = await User.find({}, "name email password createdAt");

    // Send the list of users and the total count
    return res.status(200).json({
      totalUsers: users.length,
      users: users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching user details", error });
  }
};

export { getTotalUsers };
