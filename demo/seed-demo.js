// seed-demo.js — Preloads realistic checkpoints into VS Code's extension storage
// Ensures your live demo NEVER fails due to missing data or blank screens!

const fs = require("fs");
const path = require("path");
const os = require("os");

const sampleDataPath = path.join(__dirname, "sample-sessions.json");
if (!fs.existsSync(sampleDataPath)) {
  console.error("Error: sample-sessions.json not found in demo folder.");
  process.exit(1);
}

const sampleData = fs.readFileSync(sampleDataPath, "utf8");

// Known VS Code storage directories across platforms
const home = os.homedir();
const possibleStorageDirs = [
  // macOS standard VS Code
  path.join(home, "Library/Application Support/Code/User/globalStorage/contextswitch-team.contextswitch"),
  // macOS VS Code Insiders
  path.join(home, "Library/Application Support/Code - Insiders/User/globalStorage/contextswitch-team.contextswitch"),
  // macOS Cursor / forks
  path.join(home, "Library/Application Support/Cursor/User/globalStorage/contextswitch-team.contextswitch"),
  // Linux standard
  path.join(home, ".config/Code/User/globalStorage/contextswitch-team.contextswitch"),
  // Windows standard
  process.env.APPDATA
    ? path.join(process.env.APPDATA, "Code/User/globalStorage/contextswitch-team.contextswitch")
    : null,
].filter(Boolean);

let seeded = 0;

for (const dir of possibleStorageDirs) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    const targetFile = path.join(dir, "sessions.json");
    fs.writeFileSync(targetFile, sampleData, "utf8");
    console.log(`✅ Seeded demo sessions into: ${targetFile}`);
    seeded++;
  } catch (err) {
    // skip non-existent root paths
  }
}

// Also seed into local workspace storage fallback if needed
const localFallback = path.join(__dirname, "../.contextswitch-data");
try {
  fs.mkdirSync(localFallback, { recursive: true });
  fs.writeFileSync(path.join(localFallback, "sessions.json"), sampleData, "utf8");
  console.log(`✅ Seeded demo sessions into local fallback: ${localFallback}/sessions.json`);
} catch (err) {}

console.log("\n🚀 Demo data ready! Launch your extension and open the Dashboard.");
