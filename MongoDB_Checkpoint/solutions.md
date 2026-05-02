# MongoDB Checkpoint — Solutions

## 1 — Display all contacts

```js
db.contactlist.find()
```

![alt text](screenshots/image.png)

---

## 2 — Display one contact by ID

```js
db.contactlist.findOne({ _id: ObjectId("<id>") })
```

![alt text](screenshots/image-1.png)

---

## 3 — Contacts with age > 18

```js
db.contactlist.find({ age: { $gt: 18 } })
```

![alt text](screenshots/image-2.png)

---

## 4 — Age > 18 AND name contains "ah"

```js
db.contactlist.find({
  age: { $gt: 18 },
  $or: [
    { lastName:  { $regex: "ah", $options: "i" } },
    { firstName: { $regex: "ah", $options: "i" } }
  ]
})
```

![alt text](screenshots/image-3.png)

---

## 5 — Update Kefi Seif → Kefi Anis

```js
db.contactlist.updateOne(
  { lastName: "Kefi", firstName: "Seif" },
  { $set: { firstName: "Anis" } }
)
```

![alt text](screenshots/image-4.png)

---

## 6 — Delete contacts aged under 5

```js
db.contactlist.deleteMany({ age: { $lt: 5 } })
```

![alt text](screenshots/image-5.png)

---

## 7 — Display all contacts (final)

```js
db.contactlist.find()
```

![alt text](screenshots/image-6.png)
