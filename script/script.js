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
            const regex = /Name : \s*(.+)\nNIM : \s*(.+)\nJurusan : \s*(.+)/;
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
            const tanggal = now.toLocaleDateString('id-ID');
            const waktu = now.toLocaleTimeString('id-ID');

            document.getElementById("tanggalHidden").value = tanggal;
            document.getElementById("waktuHidden").value = waktu;

            // Tampilkan form tanpa scan NFC
            document.getElementById("formSection").style.display = "block";
            document.getElementById("capture").disabled = false;
            activateCamera();
        };
    } catch (error) {
        console.error("Error membaca NFC:", error);
        document.getElementById("nfcData").textContent = "NFC tidak didukung atau gagal membaca!";
    }
});

// // Bypass NFC dan langsung tampilkan form
// document.getElementById("formSection").style.display = "block";
// document.getElementById("capture").disabled = false;


// Aktifkan Kamera
function activateCamera() {
    if (nfcScanned) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                document.getElementById("video").srcObject = stream;
            })
            .catch(() => {
                alert("Kamera tidak tersedia!");
            });
    }
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

    document.getElementById("inputFoto").value = canvas.toDataURL("image/png");

    alert("Foto berhasil diambil!");
});

// Mendapatkan lokasi otomatis
const options = {
    maximumAge: 0,
    enableHighAccuracy: true,
    timeout: 15000,
};

const success = (pos) => {
    const coords = pos.coords;
    const latitude = coords.latitude;
    const longitude = coords.longitude;
    const lokasiString = `Latitude: ${latitude}, Longitude: ${longitude}`;

    // Tampilkan lokasi dalam form
    document.getElementById("lokasiInput").innerHTML = lokasiString;

    // Simpan lokasi ke input hidden agar terkirim saat submit
    document.getElementById("lokasiHidden").value = lokasiString;

    console.log(`Lokasi Anda: ${lokasiString}`);
};

const error = (err) => {
    console.log(`Gagal mendapatkan lokasi: ${err.message}`);
    document.getElementById("lokasiInput").textContent = "Gagal mendapatkan lokasi.";
};

// Panggil geolocation saat halaman dimuat
navigator.geolocation.getCurrentPosition(success, error, options);
