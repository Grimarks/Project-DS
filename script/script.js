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

    document.getElementById("Semester").addEventListener("change", () => {
        const semesterValue = document.getElementById("Semester").value;
        const semesterManualContainer = document.getElementById("semesterManualContainer");

        if (semesterValue === "lainnya") {
            semesterManualContainer.style.display = "block";
        } else {
            semesterManualContainer.style.display = "none";
        }
    });

    const mataKuliahData = {
        1: [
            "Pengantar Algoritma dan Struktur Data - (FIK1101)",
            "Pemrograman Komputer - (FIK1102)",
            "Praktikum Pemrograman Komputer - (FIK1103)",
            "Pengantar Teknologi Informasi - (FTI1101)",
            "Matriks dan Vektor - (FTI1102)",
            "Kalkulus - (FTI1103)",
            "Agama - (UNI1001)",
            "Pancasila - (UNI1002)"
        ],
        2: [
            "Organisasi dan Arsitektur Komputer - (FTI1204)",
            "Algoritma dan Struktur Data Lanjut - (FTI1205)",
            "Pemrograman Komputer Lanjut - (FTI1206)",
            "Praktikum Pemrograman Komputer Lanjut - (FTI1207)",
            "Struktur Diskrit 1 - (FTI1208)",
            "Probabilitas dan Statistika - (FTI1209)",
            "Kewarganegaraan - (UNI1003)",
            "Bahasa Indonesia - (UNI1004)"
        ],
        3: [
            "Jaringan Komputer - (FIK2101)",
            "Praktikum Jaringan Komputer - (FTI2101)",
            "Sistem Operasi - (FTI2102)",
            "Interaksi Manusia Komputer - (FTI2103)",
            "Pemrograman Web I - (FTI2104)",
            "Struktur Diskrit II - (FTI2105)",
            "Basis Data - (FTI2106)",
            "Praktikum Basis Data - (FTI2107)"
        ],
        4: [
            "Etika Profesi - (FTI2208)",
            "Rekayasa Perangkat Lunak - (FTI2209)",
            "Teori Bahasa dan Otomata - (FTI2210)",
            "Pemrograman Web II - (FTI2211)",
            "Pengolahan Citra - (FTI2212)",
            "Kecerdasan Buatan - (FTI2213)",
            "Pengembangan Perangkat Lunak Berorientasi Obyek - (FTI2214)",
            "Praktikum Pengembangan Perangkat Lunak Berorientasi Obyek - (FTI2215)"
        ],
        5: [
            "Kewirausahaan - (FTI3101)",
            "Metodologi Penelitian - (FTI3102)",
            "Sistem Pendukung Keputusan - (FTI3103)",
            "Metode Numerik - (FTI3104)",
            "Pengenalan Pola - (FTI3105)",
            "Animasi dan Multimedia - (FTI3106)",
            "Pemrograman Visual - (FTI3107)",
            "Manajemen Basis Data - (FTI3108)",
            "Pemrograman Komputasi Bergerak - (FTI3109)",
            "Grafika Komputer - (FTI3110)",
            "Sistem Informasi - (FTI3111)",
            "Keamanan Jaringan Komputer - (FTI3112)",
            "Pembelajaran Mesin - (FTI3113)",
            "Data Science - (FTI3114)",
            "Komputasi Berkinerja Tinggi - (FTI3115)",
            "Logika Samar - (FTI3116)"
        ],
        6: [
            "Jaringan Syaraf Tiruan - (FTI3217)",
            "Sistem Pakar - (FTI3218)",
            "Data Mining - (FTI3219)",
            "Analisis algoritma - (FTI3220)",
            "Pemrosesan Bahasa Alami - (FTI3221)",
            "Pemrograman Game - (FTI3222)",
            "Computer Vision - (FTI3223)",
            "Sistem Basis Data Terdistribusi - (FTI3224)",
            "Manajemen Jaringan - (FTI3225)",
            "Internet Of Things - (FTI3226)",
            "Data Warehouse - (FTI3227)",
            "Pemodelan dan Simulasi - (FTI3228)",
            "Pemrograman Berorientasi Objek Lanjut - (FTI3229)",
            "Sistem Informasi Rumah Sakit - (FTI3230)",
            "Sistem Informasi Perbankan - (FTI3231)"
        ],
        7: [
            "Kerja Praktik - (FTI4001)",
            "Temu Kembali Informasi - (FTI4102)",
            "Augmented and Virtual Reality - (FTI4103)",
            "Pemrograman Socket - (FTI4104)",
            "Kriptografi - (FTI4105)",
            "Pemrograman Berbasis Lokasi - (FTI4106)",
            "Big Data - (FTI4107)",
            "Komputer Forensik - (FTI4108)",
            "Technopreneurship - (FTI4109)",
            "Kualitas Perangkat Lunak - (FTI4110)",
            "Sistem Paralel dan Terdistribusi - (FTI4112)",
            "Sistem Informasi Industri - (FTI4113)",
            "Sistem Informasi Pemerintahan - (FTI4114)",
            "Kuliah Kerja Nyata - (FTI4015)",
            "Deep Learning - (FTI4116)"
        ],
        8: [
            "Skripsi - (FTI4217)"
        ]
    };


    document.getElementById("Semester_Manual").addEventListener("input", () => {
        const semesterManualValue = parseInt(document.getElementById("Semester_Manual").value);
        const mataKuliahSelect = document.getElementById("Mata_Kuliah");
        const mataKuliahManualInput = document.getElementById("Mata_Kuliah_Manual");
        const mataKuliahDatalist = document.getElementById("MataKuliahList");

        if (!isNaN(semesterManualValue)) {
            const isGanjil = semesterManualValue % 2 !== 0;

            // Kosongkan dulu semua mata kuliah
            mataKuliahSelect.innerHTML = `<option value="" disabled selected>Pilih mata kuliah</option>`;
            mataKuliahDatalist.innerHTML = "";

            // Loop dan tampilkan hanya semester yang sesuai ganjil/genap
            Object.keys(mataKuliahData).forEach(semesterKey => {
                const semesterNum = parseInt(semesterKey);
                if ((isGanjil && semesterNum % 2 !== 0) || (!isGanjil && semesterNum % 2 === 0)) {
                    mataKuliahData[semesterNum].forEach(mk => {
                        const option = document.createElement("option");
                        option.value = mk;
                        mataKuliahSelect.appendChild(option);

                        const dataOption = document.createElement("option");
                        dataOption.value = mk;
                        mataKuliahDatalist.appendChild(dataOption);
                    });
                }
            });

            // Tampilkan select dan input
            mataKuliahSelect.style.display = "block";
            mataKuliahManualInput.style.display = "block";
        }
    });



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

            // Ganti field "Semester" dengan input manual
            formData.set("Semester", semesterManualValue);

            // Ambil nilai dari input mata kuliah manual
            const mataKuliahManual = document.getElementById("Mata_Kuliah_Manual").value;
            if (!mataKuliahManual) {
                alert("Silakan isi mata kuliah secara manual.");
                return;
            }

            // Ganti field "Mata_Kuliah" dengan input manual
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

