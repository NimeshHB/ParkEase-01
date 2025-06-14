const User = require('../Model/UserModel');

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

//data insertion
const createUser = async (req, res, next) => {
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
    }
    // not insert users
    if (!user) {
        return res.status(404).json({ message: "Unable to add users" });
    }
    return res.status(200).json({ users });
}


exports.getAllUsers = getAllUsers;
exports.addUser = addUser;