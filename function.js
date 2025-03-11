/* function.js */

async function getPosts() {
  console.log("Retrieving posts from localStorage...");
  const posts = localStorage.getItem('posts');
  return posts ? JSON.parse(posts) : [];
}

async function addPost(content) {
  if (content.trim() === "") {
    alert("Please enter some content before submitting.");
    return;
  }
  const newPost = {
    content: content,
    timestamp: new Date().toISOString()
  };
  console.log("Attempting to add post:", newPost); // Debug log
  let posts = await getPosts();

  posts.push(newPost);
  localStorage.setItem('posts', JSON.stringify(posts));
  console.log("Post added successfully:", newPost);
  console.log("Current posts in local storage:", posts);

  // Ensure posts are displayed after adding a new post
  displayPosts(); // Call this to refresh the displayed posts
}

// Display posts on the latest posts page
async function displayPosts() {
  const postsContainer = document.getElementById('postsContainer');
  if (!postsContainer) return;
  postsContainer.innerHTML = "";
  let posts = await getPosts();
  console.log("Retrieved posts from local storage:", posts);

  // If there is a search query in the URL, filter the posts accordingly
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  if (query) {
    posts = posts.filter(post => post.content.toLowerCase().includes(query.toLowerCase()));
  }

  // Show the latest posts first
  posts = posts.reverse();

  if (posts.length === 0) {
    return; // Do not display any message
  }

  posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = "post"; // Add class for styling
    postDiv.style.border = "1px solid #ccc"; // Add border for box effect
    postDiv.style.padding = "10px"; // Add padding
    postDiv.style.borderRadius = "5px"; // Add rounded corners
    postDiv.innerHTML = `<p>${post.content}</p><small>${new Date(post.timestamp).toLocaleString()}</small>`;

    postsContainer.appendChild(postDiv);
  });
}

async function clearPosts() {
  localStorage.removeItem('posts');
  console.log("All posts cleared from local storage.");
  displayPosts(); // Refresh the displayed posts
}

function handlePostSubmission() {
  const submitButton = document.getElementById('submitPost');
  if (!submitButton) return;
  submitButton.addEventListener('click', () => {
    const postContent = document.getElementById('postContent');
    if (!postContent) return;
    addPost(postContent.value);
    postContent.value = "";
    // Display the confirmation message and fade it out after 2 seconds
    const submitMessage = document.getElementById('submitMessage');
    submitMessage.style.display = "block"; // Show the message
    submitMessage.innerHTML = "Post submitted."; // Set the message text

    if (submitMessage) {
      submitMessage.style.opacity = "1";
      fadeOutMessage(submitMessage, 5000);
    }
  });
}

// Initialize page-specific functions when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('submitPost')) {
    handlePostSubmission();
  }
  // Add event listener for clear posts button
  const clearButton = document.getElementById('clearPosts');
  if (clearButton) {
    clearButton.addEventListener('click', clearPosts);
  }
  if (document.getElementById('postsContainer')) {
    displayPosts(); // Ensure posts are displayed on page load
  }
});
