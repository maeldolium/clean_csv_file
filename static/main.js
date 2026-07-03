let form = document.getElementById("csvForm");
let input = document.getElementById("csvFile");
let results = document.getElementById("results");
let beforeTable = document.getElementById("beforeTable");
let afterTable = document.getElementById("afterTable");

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
    results.classList.remove("hidden");
});
