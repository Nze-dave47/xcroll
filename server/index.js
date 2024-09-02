const express = require("express");
const cors = require("cors");
const axios = require("axios");
const config = require("./config.json");

const server = express();
// const hostname = "192.168.29.251" || "127.0.0.1";
const hostname = "127.0.0.1";
const port = 5000 || 8000;

const options = {
  origin: "*",
};

server.use(cors(options));

server.use("/api/posts", async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Default limit to 5

    // Ensure page and limit are positive numbers
    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive numbers" });
    }

    // Fetch data from the external API
    const response = await axios.get(
      "https://api.fikfap.com/hashtags?includePostSamples=true",
      config,
    );

    // Calculate pagination details
    const totalPosts = response.data.posts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalPosts);

    // Slice the posts array for pagination
    const paginatedPosts = response.data.posts.slice(startIndex, endIndex);

    res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: page,
      posts: paginatedPosts,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

server.use("/api/video/:url", async (req, res) => {
  try {
    const videoUrl = decodeURIComponent(req.params.url);

    if (!videoUrl) {
      throw new Error("No video URL found");
    }

    const videoResponse = await axios.get(videoUrl, {
      headers: config.headers,
      responseType: "stream",
    });

    const contentLength = videoResponse.headers["content-length"];
    const contentType = videoResponse.headers["content-type"];

    res.setHeader("Content-Length", contentLength);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Accept-Ranges", "bytes");

    const range = req.headers.range;
    if (range) {
      const [start, end] = range.replace(/bytes=/, "").split("-");
      const startByte = parseInt(start, 10);
      const endByte = end ? parseInt(end, 10) : parseInt(contentLength, 10) - 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${startByte}-${endByte}/${contentLength}`,
        "Accept-Ranges": "bytes",
        "Content-Length": endByte - startByte + 1,
        "Content-Type": contentType,
      });

      videoResponse.data.pipe(res, { start: startByte, end: endByte });
    } else {
      res.setHeader("Content-Length", contentLength);
      videoResponse.data.pipe(res);
    }
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ error: error.message });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running @ http://${hostname}:${port}`);
});
