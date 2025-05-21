const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Read stats from file
function readDataFile() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {
      "Full Stack Web Development": 0,
      "Python for Data Science": 0
    };
  }
}

// Write stats to file
function writeDataFile(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// Register route
app.post("/register", (req, res) => {
  const { name, email, course } = req.body;
  if (!name || !email || !course) {
    return res.status(400).send("All fields are required.");
  }

  const data = readDataFile();
  data[course] = (data[course] || 0) + 1;
  writeDataFile(data);
  console.log(`✅ Registered: ${name} for ${course}`);
  res.redirect("/thankyou.html");
});

// GET stats
app.get("/api/stats", (req, res) => {
  const data = readDataFile();
  res.json(data);
});

// ✅ RESET stats
app.get("/reset-stats", (req, res) => {
  const resetData = {
    "Full Stack Web Development": 0,
    "Python for Data Science": 0
  };
  writeDataFile(resetData);
  console.log("🔄 Stats reset to 0.");
  res.send("✅ Stats reset to 0.");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


