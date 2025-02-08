const User = require("../models/user");

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({
            message: "Server error while retrieving profile"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        // Fields that are allowed to be updated
        const allowedUpdates = [
            'firstName',
            'lastName',
            'email',
        ];

        // Filter out any fields that aren't in allowedUpdates
        const updates = Object.keys(req.body)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // If trying to update email, check if it's already taken
        if (updates.email && updates.email !== user.email) {
            const emailExists = await User.findOne({ email: updates.email });
            if (emailExists) {
                return res.status(400).json({
                    message: "Email already in use"
                });
            }
        }

        // Update the user
        Object.assign(user, updates);
        await user.save();

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({
            message: "Server error while updating profile"
        });
    }
};

module.exports = {
    getProfile,
    updateProfile
}; 