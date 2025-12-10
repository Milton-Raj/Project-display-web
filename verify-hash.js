const bcrypt = require('bcryptjs');

const password = "Mstepham*02";
const hash = "$2b$10$wlWKiyj/d6W5sHgIVQV2JuzXCqMEbGDn28t/AlImkVGPF25Ai4CfC";

console.log("Testing password:", password);
console.log("Testing hash:", hash);

bcrypt.compare(password, hash).then(result => {
    console.log("Match result:", result);
    if (result) {
        console.log("SUCCESS: Password matches hash!");
    } else {
        console.log("FAILURE: Password does NOT match hash.");
    }
}).catch(err => {
    console.error("Error verifying:", err);
});
