const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find({})
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get one user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("thoughts")
      .populate("friends")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user and their tnoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found." })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() =>
        res.json({
          message:
            "The user and and their thoughts have been successfully deleted.",
        })
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add a friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found." })
          : res.json({ user, message: "Friend successfully added." })
      )
      .catch((err) => res.status(500).json(err));
  },
  //  Delete a friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found." })
          : res.json({ user, message: "Friend successfully deleted." })
      )
      .catch((err) => res.status(500).json(err));
  },
};
