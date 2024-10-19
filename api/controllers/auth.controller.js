import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorhandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ success: true, message: "User created" });
  } catch (error) {
    next(error); // This sends the error to your error handler
  }
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    console.log("Attempting to find user with email:", email);
    const validUser = await User.findOne({ email });
    console.log("User found:", validUser);
    if (!validUser) return next(errorhandler(404, 'User Not Found!'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    console.log("Is password valid?", validPassword);
    if (!validPassword) return next(errorhandler(401, 'Invalid Password!'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser;

    res.cookie('access_token', token, { httpOnly: true }).status(200).json({ success: true, ...rest });
  } catch (error) {
    next(error);
  }
};
