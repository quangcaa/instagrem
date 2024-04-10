class ProfileController {
  
    async getUserProfile(req, res, next) {
        const user_id = req.params.user_id;
  
        try {
            const user = await User.findById(user_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProfileController();