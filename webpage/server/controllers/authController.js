const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/authHelpers");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        const match = await comparePassword(password, user.password);
        if (match) {
            const token = jwt.sign(
                {
                    email: user.email, 
                    id: user._id, 
                    firstName: user.firstName, 
                    lastName: user.lastName
                }, 
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            return res.status(200)
                     .header('Authorization', `Bearer ${token}`)
                     .json({
                         user: {
                             id: user._id,
                             email: user.email,
                             firstName: user.firstName,
                             lastName: user.lastName
                         }
                     });
        }
        
        return res.status(401).json({
            error: "Invalid credentials"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Server error during login"
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        if (!firstName) {
            return res.status(401).json({
                error: "First name is required"
            })
        }
        if (!lastName) {
            return res.status(401).json({
                error: "Last name is required"
            })
        }
        if (!password) {
            return res.status(401).json({
                error: "Password is required"
            })
        }
        const exists = await User.findOne({email});
        if (exists) {
            return res.status(400).json({
                error: "User already exists"
            })
        }

        const hashedPassword = await hashPassword(password);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })
        await user.save();
        return res.status(200).json(user);
    } catch (err) {
        console.log(err)
    }
}

const getUser = (req, res) => {
    try {
        const {token} = req.cookies;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
                if (err) throw err;
                res.json(user);
            })
        } else {
            res.json(null);
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    loginUser,
    registerUser,
    getUser,
}