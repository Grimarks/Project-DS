document.addEventListener("DOMContentLoaded", () => {
    // Dummy NFC Scan
    document.getElementById("scanDummy").addEventListener("click", () => {
        const dummyData = `Nama: Darrell Satriano\nNIM: 09021282328049\nJurusan: Teknik Informatika`;

        document.getElementById("nfcData").innerText = dummyData;

        const regex = /Nama:\s*(.*?)\s*NIM:\s*(\d+)\s*Jurusan:\s*(.+)/s;
        const match = dummyData.match(regex);

        if (match) {
            const [_, nama, nim, jurusan] = match;

            document.getElementById("Name").value = nama.trim();
            document.getElementById("NIM").value = nim.trim();
            document.getElementById("inputJurusan").value = jurusan.trim();
            document.getElementById("Jurusan").innerText = jurusan.trim();

            // Tampilkan form
            document.getElementById("formSection").style.display = "block";
            document.getElementById("capture").disabled = false;
        }
    });


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

    //Ngambil Foto
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

    //ngubah biar bisa ngirim ke Mata_Kuliah
    document.getElementById("absensiForm").addEventListener("submit", function (e) {
        const selectedSemester = document.getElementById("Semester").value;
        const mkSelect = document.getElementById("Mata_Kuliah");
        const mkManual = document.getElementById("Mata_Kuliah_Manual");

        // Jika input manual aktif (semester 9 atau 10 atau pilih "Lainnya")
        if (mkManual.style.display !== "none" && mkManual.value.trim() !== "") {
            let hiddenInput = document.getElementById("Final_Mata_Kuliah");
            if (!hiddenInput) {
                hiddenInput = document.createElement("input");
                hiddenInput.type = "hidden";
                hiddenInput.name = "Mata_Kuliah";
                hiddenInput.id = "Final_Mata_Kuliah";
                this.appendChild(hiddenInput);
            }

            hiddenInput.value = mkManual.value.trim();

            // Disable select agar tidak terkirim nilainya
            mkSelect.disabled = true;
        } else {
            // Jika bukan input manual, pastikan select aktif
            mkSelect.disabled = false;
        }
    });

    // Submit form to Google Apps Script
    document.getElementById("absensiForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const semesterValue = document.getElementById("Semester").value;

        if (semesterValue === "lainnya") {
            const semesterManualValue = document.getElementById("Semester_Manual").value;

            if (!semesterManualValue) {
                alert("Silakan isi semester manual.");
                return;
            }

            formData.set("Semester", semesterManualValue);

            const mataKuliahManual = document.getElementById("Mata_Kuliah_Manual").value;
            if (!mataKuliahManual) {
                alert("Silakan isi mata kuliah secara manual.");
                return;
            }

            formData.set("Mata_Kuliah", mataKuliahManual);
        }

        fetch('https://script.google.com/macros/s/AKfycbwwNxYRNEpbseQ5SbP3IA5ZZWCmL5uaEnIZaExcRtcKhqKuuRe5VaypQXMznHhSBt0m/exec', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    alert('Data berhasil dikirim');
                } else {
                    alert('Terjadi kesalahan: ' + data.error);
                }
            })
            .catch(error => {
                alert('Kesalahan jaringan: ' + error.message);
            });
    });

});
