const fs = require("fs");

exports.writeJSON = async (data) => {
  const json = JSON.stringify(data);
  try {
    await fs.writeFileSync("./score.json", json, "utf8");
  } catch (err) {
    console.log("Error writing file!");
    process.exit(1);
  }
};

exports.readJSON = async () => {
  try {
    const json = await fs.readFileSync("./score.json", "utf8");
    const data = JSON.parse(json);
    return data;
  } catch (err) {
    console.log("Error writing file!");
    process.exit(1);
  }
};
