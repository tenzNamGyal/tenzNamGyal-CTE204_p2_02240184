const API_URL = '/api/subjects';

function getGrade(m) {
  if (m >= 90) return 'A';
  if (m >= 80) return 'B';
  if (m >= 70) return 'C';
  if (m >= 60) return 'D';
  return 'F';
}

function getPoints(g) {
  return { A: 4, B: 3, C: 2, D: 1, F: 0 }[g];
}

async function loadSubjects() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to load subjects');
    const result = await response.json();
    render(result.data);
  } catch (err) {
    console.error('Error loading subjects:', err);
    document.getElementById('error').textContent = 'Could not connect to server.';
  }
}

async function addSubject() {
  const subject = document.getElementById('subject').value.trim();
  const marks   = Number(document.getElementById('marks').value);
  const credits = Number(document.getElementById('credits').value);
  const error   = document.getElementById('error');

  if (!subject || isNaN(marks) || marks < 0 || marks > 100) {
    error.textContent = 'Enter valid subject and marks (0–100)';
    return;
  }
  error.textContent = '';

  try {
    const response = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ subject, marks, credits })
    });

    if (!response.ok) {
      const data = await response.json();
      error.textContent = data.errors ? data.errors.join(', ') : 'Failed to add subject';
      return;
    }

    document.getElementById('form').reset();
    await loadSubjects();
  } catch (err) {
    error.textContent = 'Could not connect to server.';
  }
}

async function removeSubject(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) return;
    await loadSubjects();
  } catch (err) {
    console.error('Error deleting subject:', err);
  }
}

function render(data) {
  const list = document.getElementById('list');
  list.innerHTML = '';

  let totalCredits = 0, totalPoints = 0, totalMarks = 0;

  data.forEach(item => {
    const grade = getGrade(item.marks);
    const tr  = document.createElement('tr');
    
    const td1 = document.createElement('td'); td1.textContent = item.subject;
    const td2 = document.createElement('td'); td2.textContent = item.marks;
    const td3 = document.createElement('td'); td3.textContent = grade;
    const td4 = document.createElement('td'); td4.textContent = item.credits;
    
    const td5 = document.createElement('td');
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = () => removeSubject(item.id);
    td5.appendChild(btn);
    
    tr.append(td1, td2, td3, td4, td5);
    list.appendChild(tr);

    totalCredits += item.credits;
    totalPoints  += getPoints(grade) * item.credits;
    totalMarks   += item.marks;
  });

  const gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  const avg = data.length  ? (totalMarks  / data.length).toFixed(1)  : '0';

  document.getElementById('gpa').textContent   = gpa;
  document.getElementById('avg').textContent   = avg;
  document.getElementById('count').textContent = data.length;
}

document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  addSubject();
});

loadSubjects();