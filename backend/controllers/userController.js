import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

/**
 * @description Auth User
 * @route POST/api/users/login
 * @access public
 */

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dob: user.dob,
      contact: user.contact,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // UNAUTHORIZED
    throw new Error("Invalid email or password");
  }
});

/**
 * @description Get User Profile
 * @route POST/api/users/profile
 * @access private
 */

const getUserProfile = asyncHandler(async (req, res) => {
  const { getUser } = req.body;
  const user = await User.findById(getUser || req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dob: user.dob,
      contact: user.contact,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @description Register new User
 * @route POST/api/users
 * @access public
 */

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, dob, contact } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password, dob, contact });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @description Update user profile
 * @route POST/api/users/profile
 * @access private
 */

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.contact = req.body.contact || user.contact;
    user.dob = req.body.dob || user.dob;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      dob: updateUser.dob,
      contact: updateUser.contact,
      isAdmin: updateUser.isAdmin,
      token: generateToken(updateUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 *  @desc		Get all users
 *  @route	GET /api/users/
 * 	@access	private/admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

/**
 *  @desc		Get user by ID
 *  @route	GET /api/users/:id
 * 	@access	private/admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User Deleted" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 *  @desc		Get user by ID
 *  @route	GET /api/users/:id
 * 	@access	private/admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(-password);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 *  @desc		Update user
 *  @route	PUT /api/users/:id
 * 	@access	private/admin
 */
const updateUser = asyncHandler(
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.contact = req.body.contact || user.contact;
      user.dob = req.body.dob || user.dob;
      user.isAdmin = req.body.isAdmin;

      const updateUser = await user.save();

      res.json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        dob: updateUser.dob,
        contact: updateUser.contact,
        isAdmin: updateUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);
export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
};
