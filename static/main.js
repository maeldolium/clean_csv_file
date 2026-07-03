let form = document.getElementById("csvForm");

let input = document.getElementById("csvFile");

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    let file = input.files[0];
    if (file) {
        formData = new FormData();
        formData.append("csvFile", file);
        const response = await fetch("/preview", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        console.log(data);
    } else {
        console.log("No file selected");
    }
});
