const express = require("express");
const fs = require("fs");
const PORT = 3000;
const users = require("./MOCK_DATA.json");
const app = express();
app.use(express.json())

app.listen(PORT, () => {
  console.log("Server listening on PORT:", PORT);
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/users", (req, res) => {
  const html = `
        <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join()}
        </ul>
    `;
  res.send(html);
});

//group the CRUD in a single route
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.filter((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const {first_name, last_name, email, gender, job_title} = req.body;
    const userIndex = users.findIndex((user) => user.id === id);
    users[userIndex] = Object.assign(users[userIndex], {
        first_name: first_name || users[userIndex].first_name,
        last_name: last_name || users[userIndex].last_name,
        email: email || users[userIndex].email,
        gender: gender || users[userIndex].gender,
        job_title: job_title || users[userIndex].job_title,

    })
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "User is updated" });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const user = users.filter((user) => user.id !== id);
    console.log(user);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(user), (err, data) => {
      return res.json({ status: "User is Deleted" });
    });
  });

app.post("/api/users", (req, res) => {
  // TODO: Create new user
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "pending", id: users.length });
  });
});
