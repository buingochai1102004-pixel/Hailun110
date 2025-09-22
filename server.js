const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Route kiểm tra key
app.post("/validate", (req, res) => {
  const { key } = req.body;
  if (!key) {
    return res.status(400).json({ error: "Missing key" });
  }

  // Demo key
  if (key === "Noob") {
    return res.send(`--REMOTE-SCRIPT
gg.toast("✅ Key hợp lệ, script đã chạy!")
`);
  } else {
    return res.status(401).json({ error: "Invalid key" });
  }
});

// Route root để test
app.get("/", (req, res) => {
  res.send("Server is running. Use POST /validate");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
