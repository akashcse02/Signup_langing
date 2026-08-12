// ১. চেক করা ইউজার লগইন করা আছে কিনা (Auth Guard)
const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
if (!currentUser) {
    // লগইন না থাকলে সাইনআপ/লগইন পেজে পাঠিয়ে দিবে
    window.location.href = '../singup.html'; 
}

// Header-এ ইউজারের নাম দেখানো
document.getElementById('user-greeting').innerText = `Hello, ${currentUser.name}`;

// লগআউট লজিক
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser'); // ইউজার ডাটা মুছে ফেলা
    window.location.href = '../singup.html'; // লগআউট হলে আবার লগইন পেজে যাবে
});

// ==========================================
// Post Upload, Like & Comment Logic
// ==========================================
const imageUpload = document.getElementById('image-upload');
const postCaption = document.getElementById('post-caption');
const postBtn = document.getElementById('post-btn');
const feedContainer = document.getElementById('feed-container');

// ডাটাবেজ (LocalStorage) থেকে পোস্টগুলো আনা
let posts = JSON.parse(localStorage.getItem('birdsPosts')) || [];

function savePosts() {
    localStorage.setItem('birdsPosts', JSON.stringify(posts));
}

// নতুন পোস্ট আপলোড করা
postBtn.addEventListener('click', () => {
    const file = imageUpload.files[0];
    const caption = postCaption.value.trim();

    if (!file) {
        alert('Please select an image of your bird!');
        return;
    }

    // ছবিকে ব্রাউজারে দেখানোর জন্য Base64 এ কনভার্ট করা
    const reader = new FileReader();
    reader.onload = function(e) {
        const newPost = {
            id: Date.now().toString(),
            author: currentUser.name,
            image: e.target.result,
            caption: caption,
            likes: [], 
            comments: [] 
        };
        posts.unshift(newPost); // নতুন পোস্ট সবার উপরে থাকবে
        savePosts();
        imageUpload.value = '';
        postCaption.value = '';
        renderFeed();
    };
    reader.readAsDataURL(file);
});

// ফিড রেন্ডার করা (সবগুলো পোস্ট দেখানো)
function renderFeed() {
    feedContainer.innerHTML = '';

    posts.forEach(post => {
        const hasLiked = post.likes.includes(currentUser.name);
        
        // কমেন্টগুলোর HTML তৈরি করা
        const commentsHTML = post.comments.map(c => 
            `<div class="comment"><strong>${c.author}:</strong> ${c.text}</div>`
        ).join('');

        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="post-header">${post.author}</div>
            <p class="post-caption">${post.caption}</p>
            <img src="${post.image}" class="post-image" alt="Bird Image">
            
            <div class="post-actions">
                <button class="action-btn ${hasLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
                    👍 ${hasLiked ? 'Liked' : 'Like'} (${post.likes.length})
                </button>
            </div>

            <div class="comments-section">
                <div class="comments-list">${commentsHTML}</div>
                <div class="comment-input-area">
                    <input type="text" id="comment-input-${post.id}" placeholder="Write a comment...">
                    <button onclick="addComment('${post.id}')">Post</button>
                </div>
            </div>
        `;
        feedContainer.appendChild(postElement);
    });
}

// লাইক দেওয়া বা তুলে নেওয়া
window.toggleLike = function(postId) {
    const post = posts.find(p => p.id === postId);
    const likeIndex = post.likes.indexOf(currentUser.name);
    
    if (likeIndex === -1) {
        post.likes.push(currentUser.name); 
    } else {
        post.likes.splice(likeIndex, 1); 
    }
    
    savePosts();
    renderFeed();
}

// কমেন্ট যোগ করা
window.addComment = function(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const text = commentInput.value.trim();
    
    if (text) {
        const post = posts.find(p => p.id === postId);
        post.comments.push({
            author: currentUser.name,
            text: text
        });
        savePosts();
        renderFeed();
    }
}

// প্রথমবার পেজ লোড হলে ফিড দেখানো
renderFeed();