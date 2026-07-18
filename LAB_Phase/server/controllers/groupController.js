const Group = require("../models/Group");

const createGroup = async (req, res, next) => {
  try {
    const { name, memberIds } = req.body;
    const members = [...new Set([...memberIds, req.user._id.toString()])];

    if (members.length < 2) {
      return res.status(400).json({ message: "A group requires at least 2 members" });
    }

    const group = await Group.create({ name, admin: req.user._id, members });
    await group.populate("members", "displayName handle avatar isOnline");

    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
};

const getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "displayName handle avatar isOnline")
      .populate("admin", "displayName handle")
      .populate({ path: "lastMessage", populate: { path: "sender", select: "displayName" } });

    if (!group) return res.status(404).json({ message: "Group not found" });

    const isMember = group.members.some((m) => m._id.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: "Not a member of this group" });

    res.json(group);
  } catch (err) {
    next(err);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the admin can edit this group" });
    }

    const { name } = req.body;
    if (name) group.name = name;
    if (req.file) group.avatar = req.file.path;

    await group.save();
    await group.populate("members", "displayName handle avatar isOnline");
    res.json(group);
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the admin can add members" });
    }

    const { userId } = req.body;
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    group.members.push(userId);
    await group.save();
    await group.populate("members", "displayName handle avatar isOnline");
    res.json(group);
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the admin can remove members" });
    }

    group.members = group.members.filter((m) => m.toString() !== req.params.userId);
    await group.save();
    res.json({ message: "Member removed" });
  } catch (err) {
    next(err);
  }
};

const leaveGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.members = group.members.filter((m) => m.toString() !== req.user._id.toString());
    await group.save();
    res.json({ message: "Left group" });
  } catch (err) {
    next(err);
  }
};

const getUserGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "displayName handle avatar isOnline")
      .populate({ path: "lastMessage", populate: { path: "sender", select: "displayName" } })
      .sort({ updatedAt: -1 });
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

module.exports = { createGroup, getGroup, updateGroup, addMember, removeMember, leaveGroup, getUserGroups };
