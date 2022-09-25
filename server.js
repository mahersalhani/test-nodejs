const express = require("express");
const { auth, firestore } = require("./firebaseConfig");
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());


// // allows to access routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.get("/api", function (req, res) {
  // if (req.headers["x-access-allow"] !== "allow") {
  //   return res.send("<h1>Page note found</h1>");
  // }

  res.json({ subdomin: req.headers["x-subdomain"] });
});


app.post("/api/sing-up", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;
  const user = await auth.createUserWithEmailAndPassword(email, password);
  
  await firestore.collection("customers").doc(user.user.uid).set({
    email,
    firstName,
    lastName
  });

  await firestore.collection('domins').add({admin: `${firstName}-${lastName}`, userId: user.user.uid})

  res.status(200).json({ msg: 'succeed' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
