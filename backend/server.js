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
      try {
        // The code to handle parsing the form data is the same as in the previous answer

        // Assuming you're receiving the file in "file" field and other data in the request
        const file = req.files[0];
        const fileName = req.body.fileName;
        const nftMetadata = req.body.asset;
        console.log(file, fileName, nftMetadata);

        // Create the "uploads" directory if it doesn't exist
        const uploadDir = path.join(__dirname, "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }

        // Save the file to a specific location on the server using createWriteStream
        const savePath = "./uploads/" + fileName; // Change the path as per your requirement

        const writeStream = fs.createWriteStream(savePath);
        writeStream.write(file.buffer);
        writeStream.end();

        writeStream.on("finish", async () => {
          // File saved successfully, you can now continue processing the metadata or respond to the client
          const formData = new FormData();

          const readStream = fs.createReadStream(savePath);
          formData.append("file", readStream);

          const metadata = JSON.stringify({
            name: fileName,
          });
          formData.append("pinataMetadata", metadata);

          const options = JSON.stringify({
            cidVersion: 0,
          });
          formData.append("pinataOptions", options);

          try {
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
              maxBodyLength: "Infinity",
              headers: {
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: JWT,
              },
            });
            console.log(response.data);

            const nftJson = JSON.parse(nftMetadata);

            const data = {
              pinataOptions: {
                cidVersion: 1,
              },
              pinataMetadata: {
                name: "nft metadata",
                keyvalues: {},
              },
              pinataContent: {
                ...nftJson,
                properties: nftJson.attributes,
                image: `ipfs://${response.data.IpfsHash}`,
              },
            };

            const config = {
              method: "post",
              url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
              headers: {
                "Content-Type": "application/json",
                Authorization: JWT,
              },
              data: JSON.stringify(data),
            };

            const resp = await axios(config);

            return res
              .status(200)
              .json({ content: { upload: { metadata: nftMetadata, url: `ipfs://${resp.data.IpfsHash}` } } });
          } catch (error) {
            console.log(error);
          }
          return res.json({ message: "File uploaded and saved successfully." });
        });

        writeStream.on("error", (err) => {
          console.error("Error saving the file:", err);
          return res.status(500).json({ error: "Failed to save the file." });
        });
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Server error." });
      }
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
