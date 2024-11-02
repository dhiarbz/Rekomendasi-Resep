document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Mengambil nilai dari input bahan
    const bahan1 = document.getElementById('bahan1').value;
    const bahan2 = document.getElementById('bahan2').value;
    const bahan3 = document.getElementById('bahan3').value;

    // Mengirimkan data ke backend dengan body JSON
    const response = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bahan1: bahan1, bahan2: bahan2, bahan3: bahan3 })
    });

    // Mengambil hasil response dari backend
    const results = await response.json();
    const resultsDiv = document.getElementById('result');
    resultsDiv.innerHTML = '';

    // Membuat judul hasil rekomendasi
    const heading = document.createElement("h2");
    heading.className = "mb-2";
    heading.textContent = "Mungkin ini yang Anda cari:";
    resultsDiv.appendChild(heading);

    // Membuat tabel untuk menampilkan hasil
    const tableContainer = document.createElement('div');
    tableContainer.className = "table-responsive";

    const table = document.createElement('table');
    table.className = "table table-bordered mt-3";
    table.innerHTML = `
        <thead>
            <tr>
                <th scope="col">Masakan</th>
                <th scope="col">Bahan</th>
                <th scope="col">Langkah</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    tableContainer.appendChild(table);
    resultsDiv.appendChild(tableContainer);

    // Memasukkan hasil ke dalam tabel
    const tbody = table.querySelector('tbody');

    results.forEach(result => {
        const row = document.createElement('tr');

        const titleCell = document.createElement('th');
        titleCell.scope = "row";
        titleCell.className = "px-6 py-4 font-medium";
        titleCell.textContent = result.Masakan;

        const bahanCell = document.createElement('td');
        bahanCell.className = "px-6 py-4";
        bahanCell.textContent = result.Bahan;

        const langkahCell = document.createElement('td');
        langkahCell.className = "px-6 py-4";
        langkahCell.textContent = result.Langkah;

        row.appendChild(titleCell);
        row.appendChild(bahanCell);
        row.appendChild(langkahCell);

        tbody.appendChild(row);
    });
});