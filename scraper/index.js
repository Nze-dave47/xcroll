const axios = require("axios");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

async function fetchLinks() {
  try {
    const url = "https://api.fikfap.com/hashtags?includePostSamples=true";

    const res = await axios.get(url, config);

    const posts = res.data.posts.map((post) => post.videoFileOriginalUrl);

    const links = posts.join("\n");

    fs.writeFileSync(path.join("data", "links.txt"), links);
    console.log("file created @ ./data/links.txt");
    console.log("run ./download.sh to start downloading the videos.");
    console.log(
      "warning! there are around 2000 files, you can press Ctrl+C to stop downloading anytime.",
    );
  } catch (error) {
    console.error("Error fetching links:", error);
  }
}

fetchLinks();
