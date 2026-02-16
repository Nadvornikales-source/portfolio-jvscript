const elName = document.querySelector("#name");
const elSkills = document.querySelector("#skills");

const sectionInterests = document.querySelector("#interests");
const elInterestsList = document.querySelector("#interests-list");

const sectionProjects = document.querySelector("#projects");
const elProjectsList = document.querySelector("#projects-list");

const elError = document.querySelector("#error");

function createLi(text) {
  const li = document.createElement("li");
  li.textContent = text;
  return li;
}

function createChip(text) {
  const li = document.createElement("li");
  li.className = "chip";
  li.textContent = text;
  return li;
}

function createProjectCard(p) {
  const div = document.createElement("div");
  div.className = "project";

  const title = document.createElement("h3");
  title.textContent = p.title ?? "Projekt";

  const desc = document.createElement("p");
  desc.textContent = p.description ?? "";

  div.appendChild(title);
  div.appendChild(desc);

  if (p.link) {
    const a = document.createElement("a");
    a.href = p.link;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "Otevřít odkaz";
    div.appendChild(a);
  }

  return div;
}

fetch("./profile.json")
  .then((res) => {
    if (!res.ok) throw new Error(`Fetch fail: ${res.status} ${res.statusText}`);
    return res.json();
  })
  .then((data) => {
    // jméno
    elName.textContent = data.name ?? "Neznámé jméno";

    // skills
    elSkills.innerHTML = "";
    (data.skills ?? []).forEach((s) => elSkills.appendChild(createLi(s)));

    // interests (volitelné)
    const hasInterests = Array.isArray(data.interests) && data.interests.length > 0;
    sectionInterests.style.display = hasInterests ? "block" : "none";
    if (hasInterests) {
      elInterestsList.innerHTML = "";
      data.interests.forEach((i) => elInterestsList.appendChild(createChip(i)));
    }

    // projects (volitelné)
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
    sectionProjects.style.display = hasProjects ? "block" : "none";
    if (hasProjects) {
      elProjectsList.innerHTML = "";
      data.projects.forEach((p) => elProjectsList.appendChild(createProjectCard(p)));
    }

    // když nemáš ani interests ani projects, napiš chybu (zadání chce aspoň jedno)
    if (!hasInterests && !hasProjects) {
      elError.textContent = "V profile.json chybí interests nebo projects (musí tam být aspoň jedno).";
    }
  })
  .catch((err) => {
    elError.textContent = `Nepodařilo se načíst profile.json: ${err.message}`;
    elName.textContent = "Chyba načítání";
    sectionInterests.style.display = "none";
    sectionProjects.style.display = "none";
  });
