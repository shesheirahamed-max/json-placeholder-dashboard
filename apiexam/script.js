const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const postsContainer = document.getElementById('posts-container');

// ১. Fetch & Display Posts
async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        const posts = await response.json();
        
        // প্রথম ১০-১৫ টা পোস্ট দেখানোর জন্য slice ব্যবহার করতে পারেন (সব ১০০ টা দেখাতে slice বাদ দিন)
        const displayPosts = posts.slice(0, 15); 
        
        postsContainer.innerHTML = '';
        displayPosts.forEach(post => {
            const card = createCardElement(post);
            postsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        postsContainer.innerHTML = '<p>Failed to load posts.</p>';
    }
}

// কার্ড বানানোর ফাংশন
function createCardElement(post) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('id', `post-${post.id}`);

    card.innerHTML = `
        <h3 class="card-title">${post.title}</h3>
        <p class="card-body">${post.body}</p>
        <div class="card-actions">
            <button class="btn btn-edit" onclick="editPost(${post.id})">Edit</button>
            <button class="btn btn-delete" onclick="deletePost(${post.id})">Delete</button>
        </div>
    `;

    return card;
}

// ২. Edit Post (PUT Request)
async function editPost(id) {
    const cardElement = document.getElementById(`post-${id}`);
    const titleElement = cardElement.querySelector('.card-title');
    const currentTitle = titleElement.innerText;

    // Prompt দিয়ে নতুন টাইটেল চাওয়া
    const newTitle = prompt('Enter new title:', currentTitle);

    // ইউজার বাতিল করলে বা ফাঁকা রাখলে কিছু করবে না
    if (newTitle === null || newTitle.trim() === '') return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                title: newTitle
            })
        });

        if (response.ok) {
            // UI Update: পেজ রিলোড না করে টাইটেল চেঞ্জ
            titleElement.innerText = newTitle;
            alert('Post title updated successfully!');
        } else {
            alert('Failed to update post.');
        }
    } catch (error) {
        console.error('Error updating post:', error);
    }
}

// ৩. Delete Post (DELETE Request)
async function deletePost(id) {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // UI Update: DOM থেকে কার্ডটি মুছে ফেলা
            const cardElement = document.getElementById(`post-${id}`);
            cardElement.remove();
            alert('Post deleted successfully!');
        } else {
            alert('Failed to delete post.');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// পেজ লোড হলে API কল হবে
fetchPosts();