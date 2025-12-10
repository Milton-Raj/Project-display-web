const bcrypt = require('bcryptjs');

const password = "Mstepham*02";

console.log("Generating hash for:", password);
const newHash = bcrypt.hashSync(password, 10);
console.log("NEW HASH:", newHash);

console.log("Verifying new hash...");
const match = bcrypt.compareSync(password, newHash);
console.log("Match result:", match);
