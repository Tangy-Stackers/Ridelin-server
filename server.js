const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5004
const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
