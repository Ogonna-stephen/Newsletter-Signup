//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const serverless = require("serverless-http");
const router = express.Router();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", async (req, res) => {
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.email;
    
    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    let jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/efd1177a3b"
    // const options = {
    //     method: "POST",
    //     auth: "Ogoo:8e0b5464c5b51471713e0529ddc626a5-us21"
    // }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: "Bearer 51f70bb3d9cff360a611a861c9f3ebc3-us21"
        },
        body: jsonData
    })
    
    if(response.status === 200)
        return res.sendFile(__dirname + "/success.html");

    res.sendFile(__dirname + "/failure.html");
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("server is currently running on port 3000")
});

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);

// API KEY
// 51f70bb3d9cff360a611a861c9f3ebc3-us21

// list ID
// efd1177a3b