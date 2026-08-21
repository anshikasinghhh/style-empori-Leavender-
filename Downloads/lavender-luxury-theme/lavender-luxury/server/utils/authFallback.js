const DEFAULT_AUTH_USERS = [
  { id: 'default-admin', name: 'Admin User', email: 'admin@vastra.com', password: 'admin123', role: 'admin', avatar: '' },
  { id: 'default-customer', name: 'Customer User', email: 'customer@vastra.com', password: 'customer123', role: 'customer', avatar: '' },
  { id: 'default-employee', name: 'Employee User', email: 'employee@vastra.com', password: 'employee123', role: 'employee', avatar: '' }
];

const normalizeEmail = (email) => email?.trim().toLowerCase();

const getDefaultAuthUser = (email) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;
  return DEFAULT_AUTH_USERS.find((user) => user.email === normalizedEmail) || null;
};

const authenticateDefaultUser = ({ email, password }) => {
  const fallbackUser = getDefaultAuthUser(email);
  if (!fallbackUser) return null;
  if (fallbackUser.password !== password) return null;
  return { ...fallbackUser };
};

const sanitizeUserForResponse = (user) => ({
  _id: user._id || user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || '',
  canManageCoupons: user.canManageCoupons || false
});

module.exports = {
  DEFAULT_AUTH_USERS,
  getDefaultAuthUser,
  authenticateDefaultUser,
  sanitizeUserForResponse
};
