const mongoose = require('mongoose');

const connectToDB = async (URL) => {
    return await mongoose.connect(URL);
}

module.exports = connectToDB;