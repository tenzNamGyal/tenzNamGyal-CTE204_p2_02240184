const API = "http://localhost:3000/api/subjects";

// ─── BOOTSTRAP ───────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  fetchAll();
  document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
    addSubject();
  });
});

// ─── FETCH ALL (on load) ──────────────────────────────────────────────────────
async function fetchAll() {
  try {
    const res  = await fetch(API);
    const data = await res.json();
    renderAll(data.subjects, data.stats);
  } catch {
    showError("Cannot reach server. Make sure the backend is running.");
  }
}

// ─── ADD SUBJECT ──────────────────────────────────────────────────────────────
async function addSubject() {
  const subject = document.getElementById("subject").value.trim();
  const marks   = document.getElementById("marks").value;
  const credits = Number(document.getElementById("credits").value);

  // Basic client-side guard (server also validates)
  if (!subject || marks === "" || isNaN(Number(marks))) {
    showError("Enter a valid subject name and marks (0–100).");
    return;
  }

  showError("");

  try {
    const res  = await fetch(API, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ subject, marks: Number(marks), credits }),
    });
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "Something went wrong.");
      return;
    }

    document.getElementById("form").reset();
    renderAll(data.subjects, data.stats);
  } catch {
    showError("Cannot reach server.");
  }
}

// ─── DELETE ONE SUBJECT ───────────────────────────────────────────────────────
async function removeSubject(id) {
  try {
    const res  = await fetch(`${API}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) renderAll(data.subjects, data.stats);
  } catch {
    showError("Cannot reach server.");
  }
}

// ─── CLEAR ALL ────────────────────────────────────────────────────────────────
async function clearAll() {
  if (!confirm("Remove all subjects?")) return;
  try {
    const res  = await fetch(API, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) renderAll(data.subjects, data.stats);
  } catch {
    showError("Cannot reach server.");
  }
}

// ─── RENDER ───────────────────────────────────────────────────────────────────
function renderAll(subjects, stats) {
  // Stats
  document.getElementById("gpa").textContent   = stats.gpa;
  document.getElementById("avg").textContent   = stats.average;
  document.getElementById("count").textContent = stats.count;

  // Table
  const list  = document.getElementById("list");
  const empty = document.getElementById("empty");
  list.innerHTML = "";

  if (!subjects.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  subjects.forEach((item) => {
    const tr = document.createElement("tr");

    // Subject
    const td1 = document.createElement("td");
    td1.textContent = item.subject;
    td1.style.fontWeight = "500";
    td1.style.textAlign  = "left";

    // Marks
    const td2 = document.createElement("td");
    td2.textContent = item.marks;
    td2.style.fontFamily = "'JetBrains Mono', monospace";

    // Grade badge
    const td3  = document.createElement("td");
    const span = document.createElement("span");
    span.textContent = item.grade;
    span.className   = `grade grade-${item.grade}`;
    td3.appendChild(span);

    // Credits
    const td4 = document.createElement("td");
    td4.textContent = item.credits;

    // Delete
    const td5 = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.className   = "del-btn";
    btn.onclick     = () => removeSubject(item.id);
    td5.appendChild(btn);

    tr.append(td1, td2, td3, td4, td5);
    list.appendChild(tr);
  });
}
function addStudent() {
    const name = document.getElementById("studentName").value;
    const semester = document.getElementById("studentSemester").value;

    fetch("/api/students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            semester
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("Student added!");
        loadStudents();
    });
}
function loadStudents() {
    fetch("/api/students")
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById("studentList");
        list.innerHTML = "";

        data.forEach(s => {
            const li = document.createElement("li");
            li.textContent = `${s.name} - Semester ${s.semester}`;
            list.appendChild(li);
        });
    });
}

loadStudents();
// ─── HELPER ───────────────────────────────────────────────────────────────────
function showError(msg) {
  document.getElementById("error").textContent = msg;
}
