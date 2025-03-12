let nfcScanned = false;

// NFC Scan
document.getElementById("startNfc").addEventListener("click", async () => {
    try {
        const reader = new NDEFReader();
        await reader.scan();

        reader.onreading = event => {
            let nfcContent = "";

            for (const record of event.message.records) {
                const textDecoder = new TextDecoder();
                const decodedData = textDecoder.decode(record.data);
                nfcContent += `<p><strong>${record.recordType}:</strong> ${decodedData}</p>`;
            }

            document.getElementById("nfcData").innerHTML = nfcContent || "Data NFC tidak terbaca.";
            nfcScanned = true;

            // Aktifkan form setelah NFC berhasil
            document.getElementById("formSection").style.display = "block";
            document.getElementById("capture").disabled = false;

            // Aktifkan kamera
            activateCamera();
        };
    } catch (error) {
        console.error("Error membaca NFC:", error);
        document.getElementById("nfcData").textContent = "NFC tidak didukung atau gagal membaca!";
    }
});

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
