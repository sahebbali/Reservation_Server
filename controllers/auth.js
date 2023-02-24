const User=require( "../models/Auth.js");
const bcrypt =require( "bcryptjs");
const { createError } =require( "../utils/error.js");
const jwt = require("jsonwebtoken");

//  const register = async (req, res, next) => {
//   try {
//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(req.body.password, salt);

//     const newUser = new User({
//       ...req.body,
//       password: hash,
//     });

//     await newUser.save();
//     res.status(200).send("User has been created.");
//   } catch (err) {
//     console.log("register fail!!");
//     console.log(err);

//     next(err);
//   }
// };
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: '1h',
    });

    // Return the user and token as a response
    res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .status(200)
    .json({ details: { token,username,email,
    "message": "register successful!"} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

 const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails,"access_token": token,
      "message": "Login successful!"}, isAdmin });
  } catch (err) {
    next(err);
  }
};

// module.exports = register;
// module.exports = login;
module.exports ={
  login, register
 };