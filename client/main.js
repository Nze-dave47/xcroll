import "./style.css";

// const hostname = "192.168.29.251" || "127.0.0.1";
const hostname = "127.0.0.1";
const port = 5000 || 8000;

const api_url = `http://${hostname}:${port}/api/`;

let currentPage = 1;
const limit = 5;

function showLoading(message) {
  document.querySelector("#app").innerHTML = `<div class="container">
    <nav>
      <p>xcroll</p>
    </nav>
    <main>
      <p class="message">${message}</p>
    </main>
  </div>`;
}

async function fetchVideo(url) {
  showLoading("Loading video...");

  try {
    const res = await fetch(api_url + "video/" + encodeURIComponent(url));

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const videoBlob = await res.blob();
    const videoUrl = URL.createObjectURL(videoBlob);

    showVideoPage(videoUrl);
  } catch (error) {
    console.error("Error fetching video:", error.message);
    document.querySelector("#app").innerHTML =
      `<div>Error loading video: ${error.message}</div>`;
  }
}

function showPostsPage(posts, totalPages) {
  const postsHTML = posts
    .map((post) => {
      if (post) {
        return `
          <div class="post card">
            <div class="card-header">
              <p>${post.label}</p>
              <span class="label">${post.hashtags[0].label}</span>
            </div>
            <button data-url="${post.videoFileOriginalUrl}">Play Video</button>
          </div>
        `;
      } else {
        return "";
      }
    })
    .join("");

  document.querySelector("#app").innerHTML = `
    <div class="container">
      <nav>
        <p>xcroll</p>
      </nav>
      <main>
        <h4>Posts</h4>
        <div id="postsContainer">${postsHTML}</div>
      </main>
      <footer>
        <div id="pagination">
          <button id="prevPage" ${currentPage <= 1 ? "disabled" : ""}>Previous</button>
          <span>Page ${currentPage} of ${totalPages}</span>
          <button id="nextPage" ${currentPage >= totalPages ? "disabled" : ""}>Next</button>
        </div>
      </footer>
    </div>
  `;

  document.querySelectorAll(".post button").forEach((button) => {
    button.addEventListener("click", () => {
      const videoUrl = button.getAttribute("data-url");
      fetchVideo(videoUrl);
    });
  });

  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      showData();
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      showData();
    }
  });
}

function showVideoPage(videoUrl) {
  document.querySelector("#app").innerHTML = `
    <div class="container">
      <nav>
        <button id="backToPosts">Back to Posts</button>
      </nav>
      <main>
      ${
        videoUrl
          ? `<video id="videoPlayer" autoplay controls loop>
        <source src="${videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>`
          : `<h2>No video selected</h2>`
      }
      </main>
    </div>
  `;

  document.getElementById("backToPosts").addEventListener("click", () => {
    showData(); // Reload posts page
  });
}

async function fetchData(page) {
  const cacheKey = `posts_page_${page}`;
  const cachedPosts = localStorage.getItem(cacheKey);

  if (cachedPosts) {
    return JSON.parse(cachedPosts);
  }

  showLoading("Loading posts...");

  try {
    const res = await fetch(`${api_url}posts?page=${page}&limit=${limit}`);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return { posts: [], totalPages: 0 };
  }
}

async function showData() {
  try {
    const { posts, totalPages } = await fetchData(currentPage);

    if (!posts || posts.length === 0) {
      document.querySelector("#app").innerHTML = `
        <div>
          No posts available.
        </div>
      `;
      return;
    }

    showPostsPage(posts, totalPages);
  } catch (error) {
    console.error("Error fetching or displaying data:", error);
    document.querySelector("#app").innerHTML = `
      <div>
        An error occurred while fetching the data.
      </div>
    `;
  }
}

showData();
