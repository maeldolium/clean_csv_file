let form = document.getElementById("csvForm");
let input = document.getElementById("csvFile");
let dropZone = document.getElementById("dropZone");
let fileName = document.getElementById("fileName");
let submitBtn = document.getElementById("submitBtn");
let submitLabel = document.getElementById("submitLabel");
let submitSpinner = document.getElementById("submitSpinner");
let errorMessage = document.getElementById("errorMessage");
let errorText = document.getElementById("errorText");
let results = document.getElementById("results");
let statDuplicates = document.getElementById("statDuplicates");
let statPhones = document.getElementById("statPhones");
let beforeTable = document.getElementById("beforeTable");
let afterTable = document.getElementById("afterTable");
let downloadBtn = document.getElementById("downloadBtn");

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove("hidden");
}

function hideError() {
    errorMessage.classList.add("hidden");
}

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitSpinner.classList.toggle("hidden", !isLoading);
    submitLabel.textContent = isLoading ? "Traitement en cours…" : "Nettoyer le fichier";
}

function updateFileName() {
    fileName.textContent = input.files[0] ? input.files[0].name : "Aucun fichier sélectionné";
}

function renderTable(container, rows) {
    container.innerHTML = "";

    if (!rows || rows.length === 0) {
        container.innerHTML = '<p class="px-3 py-4 text-sm text-[var(--ink-muted)]">Aucune donnée</p>';
        return;
    }

    const headers = Object.keys(rows[0]);
    const table = document.createElement("table");
    table.className = "w-full text-sm text-left";

    const headRow = document.createElement("tr");
    headRow.className = "bg-[var(--canvas)]";
    headers.forEach((header) => {
        const th = document.createElement("th");
        th.className = "px-3 py-2.5 font-medium text-[var(--ink-secondary)] border-b border-[var(--hairline)] whitespace-nowrap";
        th.textContent = header;
        headRow.appendChild(th);
    });
    const thead = document.createElement("thead");
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    rows.forEach((row) => {
        const tr = document.createElement("tr");
        tr.className = "border-b border-[var(--hairline)] last:border-0 hover:bg-[var(--accent)]/5 transition-colors";
        headers.forEach((header) => {
            const td = document.createElement("td");
            td.className = "px-3 py-2.5 whitespace-nowrap [font-variant-numeric:tabular-nums]";
            td.textContent = row[header];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.appendChild(table);
}

input.addEventListener("change", updateFileName);

["dragover", "dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => event.preventDefault());
});
dropZone.addEventListener("dragover", () => {
    dropZone.classList.add("border-[var(--accent)]", "bg-[var(--accent)]/5");
});
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("border-[var(--accent)]", "bg-[var(--accent)]/5");
});
dropZone.addEventListener("drop", (event) => {
    dropZone.classList.remove("border-[var(--accent)]", "bg-[var(--accent)]/5");
    const file = event.dataTransfer.files[0];
    if (file) {
        input.files = event.dataTransfer.files;
        updateFileName();
    }
});

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideError();

    let file = input.files[0];
    if (!file) {
        showError("Choisissez un fichier CSV avant de continuer.");
        return;
    }

    setLoading(true);
    try {
        const formData = new FormData();
        formData.append("csvFile", file);
        const response = await fetch("/clean", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();

        if (!response.ok) {
            showError(data.error || "Erreur lors du traitement du fichier.");
            return;
        }

        statDuplicates.textContent = data.stats.duplicates_removed;
        statPhones.textContent = data.stats.phones_reformatted;
        renderTable(beforeTable, data.before);
        renderTable(afterTable, data.after);
        results.classList.remove("hidden");
    } finally {
        setLoading(false);
    }
});

downloadBtn.addEventListener("click", async function () {
    let file = input.files[0];
    if (!file) {
        showError("Choisissez un fichier CSV avant de continuer.");
        return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);
    const response = await fetch("/download", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const data = await response.json();
        showError(data.error || "Erreur lors du téléchargement.");
        return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contacts_nettoyes.csv";
    link.click();
    URL.revokeObjectURL(url);
});
