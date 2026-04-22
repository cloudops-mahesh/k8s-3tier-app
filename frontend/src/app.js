const API = 'http://myapp.local:54758/api';
// ✅ Check backend and database status on page load
async function checkStatus() {
  // Check backend
  try {
    const res = await fetch(`${API}/health`);
    const data = await res.json();
    document.getElementById('backend-dot').classList.add('green');
    document.getElementById('backend-status').textContent = 'Backend is healthy ✅';
  } catch (err) {
    document.getElementById('backend-dot').classList.add('red');
    document.getElementById('backend-status').textContent = 'Backend unreachable ❌';
  }

  // Check database
  try {
    const res = await fetch(`${API}/db-info`);
    const data = await res.json();
    if (data.database === 'connected') {
      document.getElementById('db-dot').classList.add('green');
      document.getElementById('db-status').textContent = 'Database connected ✅';
    } else {
      document.getElementById('db-dot').classList.add('red');
      document.getElementById('db-status').textContent = 'Database disconnected ❌';
    }
  } catch (err) {
    document.getElementById('db-dot').classList.add('red');
    document.getElementById('db-status').textContent = 'Database unreachable ❌';
  }
}

// ✅ Load all users from backend
async function loadUsers() {
  try {
    const res = await fetch(`${API}/users`);
    const users = await res.json();
    const tbody = document.getElementById('users-table');

    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No users yet. Add one above!</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><span class="badge">active</span></td>
      </tr>
    `).join('');
  } catch (err) {
    document.getElementById('users-table').innerHTML =
      '<tr><td colspan="4" style="text-align:center;color:red;">Could not load users</td></tr>';
  }
}

// ✅ Add a new user
async function addUser() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('message');

  if (!name || !email) {
    msg.style.display = 'block';
    msg.className = 'error';
    msg.textContent = 'Please fill in both name and email!';
    return;
  }

  try {
    const res = await fetch(`${API}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });

    if (res.ok) {
      msg.style.display = 'block';
      msg.className = 'success';
      msg.textContent = `User "${name}" added successfully!`;
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      loadUsers();
    } else {
      throw new Error('Failed to add user');
    }
  } catch (err) {
    msg.style.display = 'block';
    msg.className = 'error';
    msg.textContent = 'Could not add user. Is the backend running?';
  }
}

// Run on page load
checkStatus();
loadUsers();