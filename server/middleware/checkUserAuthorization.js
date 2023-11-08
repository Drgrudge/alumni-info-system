const checkUserAuthorization = async (req, res, next) => {
    const userId = req.user._id;
  
    try {
      const user = await NewUser.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Implement your authorization logic here
      // For example, check if the user has the required role or permissions
  
      // If authorized, continue to the next middleware or route
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = checkUserAuthorization;
  