document.querySelectorAll('.nav-link').forEach(navLink => {
    navLink.addEventListener('click', function (e) {
        e.preventDefault(); // Mencegah aksi default (langsung menuju bagian).

        // Menghapus class 'active' dari semua link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Menambahkan class 'active' ke link yang diklik
        this.classList.add('active');

        // Scroll ke elemen target menggunakan ID dari href
        const targetId = this.getAttribute('href').substring(1); // Ambil ID (hilangkan #)
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

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
    console.log(results);
    const resultsDiv = document.getElementById('result');
    resultsDiv.innerHTML = '';

    if (!results || results.length === 0) {
        resultsDiv.textContent = "Tidak ada hasil ditemukan.";
        return;
    }

    // Membuat judul hasil rekomendasi
    const heading = document.createElement("h2");
    heading.className = "mb-2";
    heading.textContent = "Mungkin ini yang Anda cari:";
    resultsDiv.appendChild(heading);

    // Membuat tabel untuk menampilkan hasil
    const cardContainer = document.createElement('div');
    cardContainer.className = "row g-3 mt-3";

    results.forEach(result => {
        const cardCol = document.createElement('div');
        cardCol.className = "col-md-4";
    
        const card = document.createElement('div');
        card.className = "card h-100";
    
        // Convert bahan dan langkah ke format daftar jika berupa string
        const bahanList = result.Bahan.split("--").filter(item => item.trim() !== "");
        const langkahList = result.Langkah.split("--").filter(item => item.trim() !== "");
    
        // Buat daftar bahan
        const bahanHTML = bahanList.map(item => `<li>${item.trim()}</li>`).join("");
    
        // Buat daftar langkah
        const langkahHTML = langkahList.map((item, index) => `<li>${index + 1}. ${item.trim()}</li>`).join("");
    
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${result.Masakan || "Tidak diketahui"}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Bahan</h6>
                <ol class="card-text">${bahanHTML}</ol>
                <h6 class="card-subtitle mb-2 text-muted">Langkah</h6>
                <ol class="card-text">${langkahHTML}</ol>
            </div>
        `;
    
        cardCol.appendChild(card);
        cardContainer.appendChild(cardCol);
    });    
    resultsDiv.appendChild(cardContainer);
});