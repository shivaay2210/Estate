import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log(newUser);
    res.status(201).json({ message: "User Created" });
  } catch (err) {
    console.log("DB Auth Error (Register) :: ", err);
    res.status(500).json({ message: "Failed to register!" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // when a client sends data via a request, Express (with the help of appropriate middleware) will parse the request body, and the data will be available in req.body.

    const user = await User.findOne({ username });
    // findOne returns first matching occurence while find return all matching
    // findOne : It returns a single document, or null if no documents match.
    // find : returns all documents that match the specified query criteria. It returns an array of documents, or an empty array if no documents match.

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this username not found!" });
    }

    // Check if the password is valid or not
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password does not match!" });
    }

    // Generate a JWT token
    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: true, // authorization
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    // const loggedInUser = await User.findById(user._id).select("-password");
    // const loggedInUser = await User.findOne({ _id: user._id }).select("-password");

    const userObj = user.toObject();
    const { password: userPassword, ...loggedInUser } = userObj;
    // Mongoose documents are instances of the Mongoose Document class. They come with additional properties and methods that are not part of a plain JavaScript object.
    // When you perform destructuring on a Mongoose document, you might not get a plain object but rather a special object that still behaves like a Mongoose document.

    console.log(user);
    console.log(userObj);

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json(loggedInUser);
  } catch (error) {
    console.log("DB Auth Error (Login) :: ", error);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  // console.log(req.cookies?.token);
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
