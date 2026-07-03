let form = document.getElementById("csvForm");
let input = document.getElementById("csvFile");
let results = document.getElementById("results");
let summaryMessage = document.getElementById("summaryMessage");
let beforeTable = document.getElementById("beforeTable");
let afterTable = document.getElementById("afterTable");
let downloadBtn = document.getElementById("downloadBtn");

function renderTable(container, rows) {
    container.innerHTML = "";

    if (!rows || rows.length === 0) {
        container.textContent = "Aucune donnée";
        return;
    }

    const headers = Object.keys(rows[0]);
    const table = document.createElement("table");
    table.className = "min-w-full text-sm text-left";

    const headRow = document.createElement("tr");
    headRow.className = "bg-gray-100";
    headers.forEach((header) => {
        const th = document.createElement("th");
        th.className = "px-3 py-2 font-medium";
        th.textContent = header;
        headRow.appendChild(th);
    });
    const thead = document.createElement("thead");
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    rows.forEach((row) => {
        const tr = document.createElement("tr");
        tr.className = "border-t";
        headers.forEach((header) => {
            const td = document.createElement("td");
            td.className = "px-3 py-2";
            td.textContent = row[header];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.appendChild(table);
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    let file = input.files[0];
    if (!file) {
        console.log("No file selected");
        return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);
    const response = await fetch("/clean", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
        alert(data.error || "Erreur lors du traitement du fichier.");
        return;
    }

    renderTable(beforeTable, data.before);
    renderTable(afterTable, data.after);
    summaryMessage.textContent =
        `${data.stats.duplicates_removed} doublons supprimés, ${data.stats.phones_reformatted} numéros reformatés`;
    results.classList.remove("hidden");
});

downloadBtn.addEventListener("click", async function () {
    let file = input.files[0];
    if (!file) {
        console.log("No file selected");
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
        alert(data.error || "Erreur lors du téléchargement.");
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
