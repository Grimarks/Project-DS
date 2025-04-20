const mataKuliahPerSemester = {
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

const semesterSelect = document.getElementById('Semester');
const mataKuliahSelect = document.getElementById('Mata_Kuliah');
const semesterManualInput = document.getElementById('SemesterManual');
const mataKuliahManualInput = document.getElementById('Mata_Kuliah_Manual');
const mataKuliahDatalist = document.getElementById('MataKuliahList');

semesterSelect.addEventListener('change', function () {
    const selectedSemester = semesterSelect.value;
    const isLainnya = selectedSemester === 'lainnya';

    if (semesterManualInput) semesterManualInput.style.display = isLainnya ? 'block' : 'none';
    if (mataKuliahManualInput) mataKuliahManualInput.style.display = isLainnya ? 'block' : 'none';

    mataKuliahSelect.style.display = isLainnya ? 'none' : 'block';
    mataKuliahSelect.disabled = isLainnya;
    if (mataKuliahManualInput) mataKuliahManualInput.disabled = !isLainnya;

    mataKuliahSelect.innerHTML = '<option value="" disabled selected>Pilih mata kuliah</option>';
    if (mataKuliahDatalist) mataKuliahDatalist.innerHTML = '';

    if (!isLainnya) {
        const mataKuliahList = mataKuliahPerSemester[selectedSemester] || [];
        mataKuliahList.forEach((mk) => {
            const option = document.createElement('option');
            option.value = mk;
            option.textContent = mk;
            mataKuliahSelect.appendChild(option);
        });
    } else if (mataKuliahDatalist) {
        const allCourses = Object.values(mataKuliahPerSemester).flat();
        const uniqueCourses = [...new Set(allCourses)];
        uniqueCourses.forEach((mk) => {
            const option = document.createElement('option');
            option.value = mk;
            mataKuliahDatalist.appendChild(option);
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const mataKuliahSelect = document.getElementById("Mata_Kuliah");
    const mataKuliahManual = document.getElementById("Mata_Kuliah_Manual");

    // Pastikan elemen ditemukan
    if (mataKuliahSelect && mataKuliahManual) {
        mataKuliahSelect.addEventListener("change", function () {
            if (this.value === "lainnya") {
                mataKuliahManual.style.display = "block";
            } else {
                mataKuliahManual.style.display = "none";
            }
        });
    }
});
