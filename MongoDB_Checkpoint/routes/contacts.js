const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Task 2 & 8 — All contacts
router.get("/", async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

// Task 3 — One contact by ID
router.get("/:id", async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  res.json(contact);
});

// Task 4 — Age > 18
router.get("/filter/adults", async (req, res) => {
  const contacts = await Contact.find({ age: { $gt: 18 } });
  res.json(contacts);
});

// Task 5 — Age > 18 AND name contains "ah"
router.get("/filter/adults-ah", async (req, res) => {
  const contacts = await Contact.find({
    age: { $gt: 18 },
    $or: [
      { lastName:  { $regex: "ah", $options: "i" } },
      { firstName: { $regex: "ah", $options: "i" } },
    ],
  });
  res.json(contacts);
});

// Task 6 — Update Kefi Seif → Kefi Anis
router.put("/update/kefi", async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { lastName: "Kefi", firstName: "Seif" },
    { firstName: "Anis" },
    { new: true }
  );
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  res.json(contact);
});

// Task 7 — Delete contacts aged < 5
router.delete("/delete/under5", async (req, res) => {
  const result = await Contact.deleteMany({ age: { $lt: 5 } });
  res.json({ deleted: result.deletedCount });
});

module.exports = router;
