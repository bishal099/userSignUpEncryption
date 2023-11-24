import mongoose from "mongoose";

import {} from "dotenv/config";

export const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("===== Connected to MongoDB Successfully ======"))
    .catch((err) => console.log(`Sorry Connection failed due to error below! \n ${err}`))

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

const userModel = mongoose.model("Week6_User", userSchema);

export default userModel