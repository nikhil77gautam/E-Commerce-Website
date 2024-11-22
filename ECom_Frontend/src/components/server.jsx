// Protected token
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");

const adminToken = localStorage.getItem("adminToken");
const adminId = localStorage.getItem("adminId");
const adminRole = localStorage.getItem("adminRole");
const adminName = localStorage.getItem("adminName");

export { token, userId, userName, role, adminToken, adminId, adminRole, adminName };