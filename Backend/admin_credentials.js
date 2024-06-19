const { User } = require("./models/student")
async function fetchAdminCredentials() {
    const admin_data = User.find({ role: "admin" });
    console.log(admin_data)
    const admin_id = admin_data._id;

}
export { admin_id };