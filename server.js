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

app.get("/api", async function (req, res) {
  if (!req.headers["x-subdomain"]) {
    return res.json({ subdomin: "" });
  }

  const domin = await firestore.collection("domins").where("domin", "==", req.headers["x-subdomain"]).get();

  if (domin.docs.length === 0) {
    return res.json({ subdomin: req.headers["x-subdomain"], isFound: false });
  }

  res.json({ subdomin: req.headers["x-subdomain"], isFound: true });
});

app.post("/api/sing-up", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;

  const user = await auth.createUserWithEmailAndPassword(email, password);

  await firestore.collection("customers").doc(user.user.uid).set({
    email,
    firstName,
    lastName,
  });

  await firestore.collection("domins").add({ domin: `${firstName}-${lastName}`, userId: user.user.uid });

  res.status(200).json({ msg: "succeed" });
});

app.post("/api/sing-in", async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await auth.signInWithEmailAndPassword(email, password);

    const userDoc = await firestore.collection("customers").doc(user.user.uid).get();
    const domin = await firestore.collection("domins").where("userId", "==", user.user.uid).get();

    res.status(200).json({
      msg: "succeed",
      data: {
        dominData: domin.docs[0].data(),
        userData: { ...userDoc.data(), id: user.user.uid },
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
});

app.post("/api/is-owner", async function (req, res) {
  const { uid, subDomin } = req.body;

  const dominData = await firestore.collection("domins").where("domin", "==", subDomin).get();

  const ownerData = await firestore.collection("customers").doc(dominData.docs[0].data().userId).get();

  if (!uid) {
    return res.status(200).json({ isOwner: false, ownerData: ownerData.data() });
  }

  const isOwner = dominData.docs[0].data().userId === uid;

  if (!isOwner) {
    return res.status(200).json({ isOwner: false, ownerData: ownerData.data() });
  }

  res.status(200).json({ isOwner: true, ownerData: ownerData.data() });

  res.status(200).json({ done: "done" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
