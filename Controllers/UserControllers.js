const User = require('../Model/UserModel');

// Get all users
const getAllUsers = async (req, res) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching users" });
    }

    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users });
};

// Create a new user
const createUser = async (req, res) => {
    const { name, email, password, passwordConfirm, mobileNumber, vehicleNumber, vehicleType } = req.body;

    let user;
    try {
        user = new User({
            name,
            email,
            password,
            passwordConfirm,
            mobileNumber,
            vehicleNumber,
            vehicleType
        });
        await user.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error creating user" });
    }

    if (!user) {
        return res.status(400).json({ message: "Unable to add user" });
    }

    return res.status(201).json({ user });
};

// Export the functions
exports.getAllUsers = getAllUsers;
exports.addUser = createUser; // or use `exports.createUser = createUser;` and import accordingly
