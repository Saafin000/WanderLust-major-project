if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
        ...obj,
        owner: process.env.SEED_OWNER_ID || '685eb7b828ffa7a07f104cd2',
        geometry: obj.geometry || { type: "Point", coordinates: [0, 0] }
    }));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
};

initDB();