document.addEventListener("DOMContentLoaded", () => {
    // Format tanggal & waktu
    const now = new Date();
    document.getElementById("tanggalHidden").value = now.toLocaleDateString('id-ID');
    document.getElementById("waktuHidden").value = now.toLocaleTimeString('id-ID');

    // Lokasi
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lokasiString = `Lat: ${pos.coords.latitude}, Long: ${pos.coords.longitude}`;
            document.getElementById("lokasi").innerText = lokasiString;
            document.getElementById("lokasiHidden").value = lokasiString;
        }, err => {
            document.getElementById("lokasi").innerText = "Gagal mendapatkan lokasi.";
            document.getElementById("lokasiHidden").value = "Tidak diketahui";
        });
    }

    // Kamera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            document.getElementById("video").srcObject = stream;
        })
        .catch(err => {
            alert("Kamera tidak tersedia atau ditolak.");
            console.error(err);
        });

    // Capture Foto
    document.getElementById("capture").addEventListener("click", () => {
        const canvas = document.getElementById("canvas");
        const video = document.getElementById("video");
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        document.getElementById("inputFoto").value = imageData;

        alert("Foto berhasil diambil!");
    });

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

                const regex = /Nama:\s*(.*?)\s*NIM:\s*(\d+)\s*Jurusan:\s*(.+)/s;
                const match = rawData.match(regex);

                if (match) {
                    const [_, nama, nim, jurusan] = match;

                    document.getElementById("Name").value = nama.trim();
                    document.getElementById("NIM").value = nim.trim();
                    document.getElementById("inputJurusan").value = jurusan.trim();
                    document.getElementById("Jurusan").innerText = jurusan.trim();

                    // Tampilkan form
                    document.getElementById("formSection").style.display = "block";
                    document.getElementById("capture").disabled = false;

                } else {
                    alert("Format NFC tidak valid. Gunakan format: Nama: ..., NIM: ..., Jurusan: ...");
                    document.getElementById("formSection").style.display = "none";
                }
            };
        } catch (error) {
            console.error("Gagal scan NFC:", error);
            document.getElementById("nfcData").innerText = "NFC tidak didukung di perangkat ini.";
        }
    });
});
