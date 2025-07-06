const { server } = require("./src/app");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
