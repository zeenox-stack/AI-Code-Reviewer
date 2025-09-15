require("dotenv").config();
const crypto = require("crypto"); 

module.exports = (req) => {
const signature = req.headers["x-hub-signature-256"]; 

if (!signature) return false; 

const hmac = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
const digest = "sha256=" + hmac.update(JSON.stringify(req.body)).digest("hex"); 

return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}