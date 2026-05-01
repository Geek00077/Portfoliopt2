
// Base URL for all API requests
// In production, change this to your live domain e.g. 'https://yoursite.com/api'
const API_URL = 'http://localhost:5555/api' // dont forget to change this later

// ===== PROTECT THE PAGE =====
// Read the token that was saved to localStorage when the user logged in
const token = localStorage.getItem('token')

// If there is no token, the user is not logged in — send them back to the login page
if (!token) {
  window.location.href = 'index.html'
  throw new Error('No token') // stops the rest of the script from running

}

// ===== AUTH HEADER HELPER =====
// Every request to a protected route must include the JWT token in the Authorization header
// This function returns the headers object so we don't repeat it everywhere
function authHeader() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // format required by our authMiddleware.js
  }
}

// ===== LOGOUT =====
// When logout is clicked, remove the token from localStorage and go back to login
// Without the token, the user can no longer make authenticated requests
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location.href = 'index.html'
})

// ===== GET ALL Slugcats =====
async function getSlugcats() {
  // GET /api/Slugcats — protected route, needs Authorization header
  const res = await fetch(`${API_URL}/slugCats`, {
    method: 'GET',
    headers: authHeader()
  })

  const Slugcats = await res.json()

  if (!res.ok) {
    // If the request failed, show the error in the Slugcats container
    document.getElementById('SlugcatsList').textContent = Slugcats.message || 'Failed to load slugCats'
    return
  }

  // Pass the Slugcats array to the render function to display them on the page
  renderSlugcats(Slugcats)
}

// ===== RENDER SLUGCATS TO THE PAGE =====
function renderSlugcats(Slugcats) {
  const container = document.getElementById('SlugcatList')

  // Clear whatever was previously rendered so we don't get duplicates
  container.innerHTML = ''

  if (Slugcats.length === 0) {
    container.textContent = 'No slugCats yet. Add one above!'
    return
  }

  // Loop through each Slugcat and create HTML elements for it
  Slugcats.forEach(Slugcat => {
    const div = document.createElement('div')
    div.innerHTML = `
    <p><strong>Type:</strong> ${Slugcat.slugType}</p>
  <p>${Slugcat.description}</p>
  <img src="${Slugcat.imageUrl}" alt="${Slugcat.imageBackUp}" width="100">
    <button onclick="startEdit('${Slugcat._id}', '${Slugcat.description.replace(/'/g, "\\'")}')">Edit</button>
    <button onclick="deleteSlugcat('${Slugcat._id}')">Delete</button>
    <hr>
    `
    container.appendChild(div)
  })
}

// ===== CREATE A SLUGCAT =====
document.getElementById('createSlugcatForm').addEventListener('submit', async (e) => {
  // Prevent page refresh on form submit
  e.preventDefault()

  const slugType = document.getElementById('SlugType').value
  const description = document.getElementById('description').value
  const imageUrl = document.getElementById('imageURL').value
  const imageBackUp = document.getElementById('imageBackUp').value
  const divId = document.getElementById('DivId').value

  const res = await fetch(`${API_URL}/slugcats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      slugType,
      description,
      imageUrl,
      imageBackUp,
      divId
  })
})


  const data = await res.json()

  if (!res.ok) {
    // Show the error (e.g. "Please add a 'text' field")
    document.getElementById('createMsg').style.color = 'red'
    document.getElementById('createMsg').textContent = data.message || 'Failed to create Slugcat'
    return
  }

  // Show success message, clear the input, and refresh the Slugcat list
  // might have some issues
    document.getElementById('createMsg').style.color = 'green'
    document.getElementById('createMsg').textContent = 'Slugcat added!'
    document.getElementById('SlugcatType').value = ''
    document.getElementById('SlugcatDescription').value = ''
    document.getElementById('SlugcatImageURL').value = ''
    document.getElementById('SlugcatImageBackUp').value = ''
    document.getElementById('SlugCatDiv').value = ''
  getSlugcats()
})

// ===== DELETE A Slugcat =====
async function deleteSlugcat(id) {
  // Ask the user to confirm before permanently deleting
  const confirmed = confirm('Are you sure you want to delete this Slugcat?')
  if (!confirmed) return

  // DELETE /api/Slugcat/:id — the id is in the URL, no request body needed
  const res = await fetch(`${API_URL}/Slugcats/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.message || 'Failed to delete Slugcat')
    return
  }

  // Refresh the list
  getSlugcats()
}

// ===== SHOW EDIT FORM =====
// Called when the user clicks the Edit button on a Slugcat
// Populates the hidden edit section with the current Slugcat's id and text
function startEdit(id, currentText) {
  document.getElementById('editSection').style.display = 'block'
  document.getElementById('editSlugcatId').value = id         // store id in hidden input
  document.getElementById('editSlugcatText').value = currentText // pre-fill with current text
  document.getElementById('editMsg').textContent = ''       // clear any previous messages
  // Scroll the edit section into view so the user doesn't have to scroll manually
  document.getElementById('editSection').scrollIntoView()
}

// ===== CANCEL EDIT =====
// Hide the edit form without making any changes
document.getElementById('cancelEditBtn').addEventListener('click', () => {
  document.getElementById('editSection').style.display = 'none'
})

// ===== SAVE EDIT =====
document.getElementById('saveEditBtn').addEventListener('click', async () => {
  // Read the Slugcat id (from the hidden input) and the updated text
  const id = document.getElementById('editSlugcatId').value
  const text = document.getElementById('editSlugcatText').value

  // PUT /api/Slugcats/:id — sends the updated text in the request body
  const res = await fetch(`${API_URL}/Slugcat/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify({ text })
  })

  const data = await res.json()

  if (!res.ok) {
    document.getElementById('editMsg').style.color = 'red'
    document.getElementById('editMsg').textContent = data.message || 'Failed to update Slugcat'
    return
  }

  // Show success, hide the edit form, and refresh the Slugcats list
  document.getElementById('editMsg').style.color = 'green'
  document.getElementById('editMsg').textContent = 'Slugcat updated!'
  document.getElementById('editSection').style.display = 'none'
  getSlugcats()
})

// ===== LOAD SlugcatS ON PAGE LOAD =====
// Automatically fetch and display all Slugcats when dashboard.html is opened
getSlugcats()