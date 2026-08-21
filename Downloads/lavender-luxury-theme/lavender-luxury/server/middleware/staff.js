exports.staffOnly = (req, res, next) => {
  if (!req.user || !['admin', 'employee'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Staff access only'
    });
  }
  next();
};
