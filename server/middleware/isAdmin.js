const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ msg: 'Only admin can perform this action' });
  }
  next();
};

module.exports = isAdmin;
