const db = require('../index');

const User = db.user;

exports.userSeed = () => {
    User.create({
        name: "Ahya",
        email: "ahya@gmail.com",
        phone: "082763542900",
        password: "$2y$10$oh1910J9pLoI2YEKVyBHHuUQYIPBHDNDurr23qWck8crWWIVJMD2W"
    })
}