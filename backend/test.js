const express = require("express");
const multer = require("multer"); // Required for handling multipart/form-data
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data");
const { Readable } = require("stream"); // Import Readable from the stream module
const fs = require("fs");
const path = require("path");
const JWT =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1ZDc1NjFjYy04ODA4LTQ1MzYtOWE0Yy1lMzUyN2ZkN2E4MzYiLCJlbWFpbCI6Imxldmltb3JpbjExQG91dGxvb2suY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImYxMDJmYzJkN2ZhMDIwOTE2NjkwIiwic2NvcGVkS2V5U2VjcmV0IjoiOWNlMDRkY2MyODg5MTZmNmRkYWY4MGI0NjI5MzIyOGU0MGNiMGYzM2M1NmNiYTRiZjRlNWNiYjFmZWQwZDA0ZiIsImlhdCI6MTY5MDEzMjk1NH0.YJ_Z51QRjVLy31XVw9SVtT3FK3h_hdTmlG8J0LRQSg0";
const app = express();
app.use(cors());

// Middleware to parse incoming request bodies (for JSON and form data)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle the POST request from the client
app.post("/api/", async (req, res) => {
  try {
    // Access the form data sent by the client using multer

    // For authentication, check the username and password from the request
    // console.log(req.headers);
    const username = req.headers.authorization.split(" ")[1];
    const password = req.headers.authorization.split(" ")[2];

    // Validate the credentials (compare with your stored credentials)
    // if (username !== "elitebug0" || password !== "asdf") {
    //   return res.status(401).json({ error: "Unauthorized." });
    // }

    const upload = multer().any();
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed." });
      }

      // Assuming you're receiving the file in "file" field and other data in the request
      const file = req.files[0];
      const fileName = req.body.fileName;
      const metadata = req.body.asset;

      console.log(metadata);

      const fileReadStream = Readable.from(file.buffer);
      // console.log(fileReadStream);
      const formData = new FormData();
      formData.append("file", fileReadStream);
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        });
        console.log("success", res.data);
        return res.json({ data: res.data });
      } catch (error) {
        console.log(error);
      }

      return res.json({ message: "File uploaded successfully." });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// Start the server on a specified port
const port = 5000; // You can change this to any port number you want
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
