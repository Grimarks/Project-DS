let nfcScanned = false;

// NFC Scan
document.getElementById("startNfc").addEventListener("click", async () => {
    try {
        const reader = new NDEFReader();
        await reader.scan();

        reader.onreading = event => {
            let rawData = "";
            for (const record of event.message.records) {
                const textDecoder = new TextDecoder();
                rawData += textDecoder.decode(record.data) + "\n";
            }

            document.getElementById("nfcData").innerText = rawData || "Data NFC tidak terbaca.";
            nfcScanned = true;

            // Parsing Data NFC
            const regex = /Name:\s*(.+)\nNIM:\s*(.+)\nJurusan:\s*(.+)/;
            const match = rawData.match(regex);

            if (match) {
                document.getElementById("inputNama").value = match[1].trim();
                document.getElementById("inputNIM").value = match[2].trim();
                document.getElementById("inputJurusan").value = match[3].trim();
            } else {
                alert("Format data NFC tidak valid!");
            }

            // Set tanggal dan waktu otomatis
            const now = new Date();
            document.getElementById("tanggalHidden").value = now.toLocaleDateString('id-ID');
            document.getElementById("waktuHidden").value = now.toLocaleTimeString('id-ID');

            // Tampilkan form
            document.getElementById("formSection").style.display = "block";
            document.getElementById("capture").disabled = false;
            activateCamera();
        };
    } catch (error) {
        console.error("Error membaca NFC:", error);
        document.getElementById("nfcData").textContent = "NFC tidak didukung atau gagal membaca!";
    }
});

// Aktifkan Kamera
function activateCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            document.getElementById("video").srcObject = stream;
        })
        .catch(() => {
            alert("Kamera tidak tersedia!");
        });
}

// Capture Foto
document.getElementById("capture").addEventListener("click", () => {
    if (!nfcScanned) {
        alert("Silakan scan NFC terlebih dahulu!");
        return;
    }

    const canvas = document.getElementById("canvas");
    const video = document.getElementById("video");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Simpan hasil foto dalam bentuk Base64
    const fotoBase64 = canvas.toDataURL("image/png");
    document.getElementById("Foto").value = fotoBase64;

    alert("Foto berhasil diambil!");
});


// Mendapatkan lokasi otomatis
navigator.geolocation.getCurrentPosition(pos => {
    const coords = pos.coords;
    const lokasiString = `Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`;

    document.getElementById("Lokasi").textContent = lokasiString;
    document.getElementById("lokasiHidden").value = lokasiString;
}, err => {
    console.log(`Gagal mendapatkan lokasi: ${err.message}`);
    document.getElementById("Lokasi").textContent = "Gagal mendapatkan lokasi.";
});
