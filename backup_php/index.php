<?php
/**
 * Website Pembelajaran Etnomatematika: Mengenal Sudut di Sekitar Kita
 * Mata Pelajaran : Matematika
 * Kelas / Fase    : V (Lima) / Fase C
 * Materi          : Sudut (Bagian, Jenis, dan Pengukuran Sudut) dalam Etnomatematika Kraton Yogyakarta
 */

require_once __DIR__ . '/db.php';

// Data Soal Evaluasi
$questions = [
    [
        'id' => 0,
        'question' => 'Titik pertemuan antara dua garis lurus yang membentuk sebuah sudut dinamakan...',
        'options' => ['Kaki sudut', 'Titik sudut', 'Derajat sudut'],
        'correct' => 1,
        'explanation' => 'Titik sudut adalah titik pangkal persekutuan tempat bertemunya dua garis lurus (kaki sudut).'
    ],
    [
        'id' => 1,
        'question' => 'Sudut yang besarnya lebih kecil dari 90° (antara 0° sampai 90°) disebut sudut...',
        'options' => ['Sudut lancip', 'Sudut siku-siku', 'Sudut tumpul'],
        'correct' => 0,
        'explanation' => 'Sudut lancip berukuran lebih dari 0° dan kurang dari 90°.'
    ],
    [
        'id' => 2,
        'question' => 'Pada bangunan Kraton Yogyakarta, pertemuan antara tiang kayu tegak lurus dengan balok mendatar membentuk...',
        'options' => ['Sudut tumpul', 'Sudut lancip', 'Sudut siku-siku (90°)'],
        'correct' => 2,
        'explanation' => 'Pertemuan tiang vertikal dan balok horizontal saling tegak lurus membentuk sudut 90° (sudut siku-siku).'
    ],
    [
        'id' => 3,
        'question' => 'Alat standar yang digunakan untuk mengukur besar suatu sudut secara tepat adalah...',
        'options' => ['Jangka sorong', 'Busur derajat', 'Meteran pita'],
        'correct' => 1,
        'explanation' => 'Busur derajat (protractor) adalah alat pengukur besar sudut dalam satuan derajat (°).'
    ],
    [
        'id' => 4,
        'question' => 'Bentuk bubungan atap joglo atau segitiga gerbang Kraton merupakan contoh benda budaya yang memiliki...',
        'options' => ['Sudut lancip', 'Sudut tumpul', 'Sudut lurus'],
        'correct' => 0,
        'explanation' => 'Kemiringan atap yang meruncing ke atas membentuk sudut lancip kurang dari 90°.'
    ],
    [
        'id' => 5,
        'question' => 'Sudut yang ukurannya lebih dari 90° tetapi kurang dari 180° seperti pada bagian bawah ornamen belah ketupat adalah...',
        'options' => ['Sudut refleks', 'Sudut tumpul', 'Sudut siku-siku'],
        'correct' => 1,
        'explanation' => 'Sudut tumpul memiliki rentang ukuran antara 90° sampai 180°.'
    ]
];

// Proses submit form evaluasi
$quizSubmitted = false;
$score = 0;
$userAnswers = [];
$uraianAnswer = '';
$refleksiAnswer = '';
$studentName = '';
$studentClass = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_quiz'])) {
    $quizSubmitted = true;
    $studentName = trim($_POST['student_name'] ?? 'Siswa Kelas V');
    $studentClass = trim($_POST['student_class'] ?? 'V');
    $userAnswers = $_POST['answer'] ?? [];
    $uraianAnswer = trim($_POST['jawaban_uraian'] ?? '');
    $refleksiAnswer = trim($_POST['jawaban_refleksi'] ?? '');

    $correctCount = 0;
    foreach ($questions as $idx => $q) {
        if (isset($userAnswers[$idx]) && (int)$userAnswers[$idx] === $q['correct']) {
            $correctCount++;
        }
    }
    
    // Hitung skor skala 100 untuk pilihan ganda
    $score = round(($correctCount / count($questions)) * 100);

    // Simpan ke database
    simpanEvaluasi($studentName, $studentClass, $score, count($questions), $userAnswers, $uraianAnswer, $refleksiAnswer);
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Media pembelajaran etnomatematika untuk mengenal bagian, jenis, dan pengukuran sudut melalui budaya Kraton Yogyakarta bagi siswa Kelas V SD.">
    <title>Mengenal Sudut di Sekitar Kita | Etnomatematika Kraton Yogyakarta</title>
    <link rel="stylesheet" href="style.css?v=<?= time() ?>">
</head>
<body>

<!-- ==================== HEADER ==================== -->
<header>
    <a class="brand" href="#beranda">
        <span class="brand-crest">⚜</span>
        Mengenal Sudut <span>Etnomatematika</span>
    </a>
    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Buka menu navigasi">☰</button>
    <nav id="mainNav" aria-label="Navigasi utama">
        <a href="#beranda" class="active">Beranda</a>
        <a href="#tujuan">Tujuan</a>
        <a href="#materi">Materi</a>
        <a href="#budaya">Jelajah Budaya</a>
        <a href="#aktivitas">Aktivitas & Game</a>
        <a href="#evaluasi">Evaluasi</a>
        <a href="#tentang">Tentang</a>
    </nav>
</header>

<main>
    <!-- ==================== HERO SECTION ==================== -->
    <section class="hero" id="beranda">
        <div class="hero-copy">
            <span class="eyebrow">⚜ ETNOMATEMATIKA KRATON YOGYAKARTA ⚜</span>
            <h1>Mengenal Sudut <em>di Sekitar Kita.</em></h1>
            <p>Eksplorasi konsep sudut (bagian, jenis, dan pengukuran sudut) melalui keindahan seni ukir, arsitektur megah, dan ornamen budaya Kraton Yogyakarta.</p>
            <div class="hero-actions">
                <a class="btn" href="#materi">Mulai Belajar <span aria-hidden="true">→</span></a>
                <a class="btn btn-secondary" href="#budaya">Jelajah Budaya</a>
                <a class="text-link" href="#evaluasi">Coba latihan</a>
            </div>
        </div>
        <div class="hero-card">
            <!-- Ornamen Sudut Mengambang (Floating Angles) -->
            <div class="floating-angles-container">
                <span class="floating-angle-badge float-pos-1"><span class="angle-tag-icon">📐</span> Sudut Siku-Siku (90°)</span>
                <span class="floating-angle-badge float-pos-2"><span class="angle-tag-icon">∠</span> Sudut Lancip (&lt; 90°)</span>
                <span class="floating-angle-badge float-pos-3"><span class="angle-tag-icon">∡</span> Sudut Tumpul (&gt; 90°)</span>
            </div>

            <div class="hero-img-wrap">
                <img src="assets/images/kraton-hero.jpg" alt="Bangunan megah Kraton Yogyakarta sebagai media belajar etnomatematika">
            </div>
            <div class="image-caption">
                <span class="caption-icon">⚜</span>
                <div>
                    <strong>Pusat Kebudayaan Jawa</strong>
                    <p>Kraton Ngayogyakarta Hadiningrat · Warisan Arsitektur & Geometri</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pembatas Ornamen Keraton -->
    <div class="kraton-divider">
        <span class="divider-line"></span>
        <span class="divider-emblem">❖ ── ⚜ ── ❖</span>
        <span class="divider-line"></span>
    </div>

    <!-- ==================== TUJUAN PEMBELAJARAN ==================== -->
    <section class="section" id="tujuan" style="padding-top: 2rem;">
        <div class="section-heading">
            <span class="eyebrow">CAPAIAN PEMBELAJARAN FASE C</span>
            <h2>Tujuan Pembelajaran</h2>
            <p>Setelah mempelajari media pembelajaran ini, peserta didik Kelas V diharapkan mampu mencapai capaian berikut:</p>
        </div>
        <div class="objectives-grid">
            <div class="objective-card">
                <div class="objective-num">01</div>
                <p>Menunjukkan <strong>titik sudut</strong> dan <strong>kaki sudut</strong> pada benda konkret di lingkungan sekitar.</p>
            </div>
            <div class="objective-card">
                <div class="objective-num">02</div>
                <p>Membedakan jenis-jenis sudut: <strong>sudut lancip</strong>, <strong>sudut siku-siku</strong>, dan <strong>sudut tumpul</strong>.</p>
            </div>
            <div class="objective-card">
                <div class="objective-num">03</div>
                <p>Mengukur besar sudut menggunakan <strong>busur derajat</strong> secara teliti dan benar.</p>
            </div>
            <div class="objective-card">
                <div class="objective-num">04</div>
                <p>Menemukan penerapan konsep sudut pada <strong>bangunan & karya seni budaya Kraton Yogyakarta</strong>.</p>
            </div>
        </div>
    </section>

    <!-- ==================== 01 / MATERI SUDUT ==================== -->
    <section class="section" id="materi">
        <div class="section-heading">
            <div class="heading-angle-watermark">∠ SUDUT 90°</div>
            <span class="eyebrow">01 / MATERI PEMBELAJARAN</span>
            <h2>Kenali konsep dan jenis sudut</h2>
            <p>Pelajari pengertian dasar sudut, bagian-bagian sudut, macam-macam ukuran sudut, serta teknik pengukuran menggunakan busur derajat.</p>
        </div>

        <div class="material-grid">
            <div class="material-card" onclick="openMateriTab('tab-pengertian')">
                <div class="shape-badge">∠</div>
                <span class="card-tag">DASAR SUDUT</span>
                <h3>Bagian-Bagian Sudut</h3>
                <p>Ketahui bagaimana dua sinar garis bertemu pada satu titik membentuk titik sudut dan kaki sudut.</p>
                <span class="card-action">Pelajari bagian sudut ↗</span>
            </div>

            <div class="material-card" onclick="openMateriTab('tab-jenis')">
                <div class="shape-badge">📐</div>
                <span class="card-tag">KLASIFIKASI</span>
                <h3>Jenis-Jenis Sudut</h3>
                <p>Kenali 7 ragam sudut: sudut nol, lancip, siku-siku, tumpul, lurus, refleks, hingga sudut penuh.</p>
                <span class="card-action">Pelajari jenis sudut ↗</span>
            </div>

            <div class="material-card" onclick="openMateriTab('tab-busur')">
                <div class="shape-badge">📏</div>
                <span class="card-tag">PENGUKURAN</span>
                <h3>Busur Derajat</h3>
                <p>Pelajari 4 langkah mudah meletakkan titik pusat busur derajat untuk mengukur sudut dengan akurat.</p>
                <span class="card-action">Pelajari cara mengukur ↗</span>
            </div>
        </div>

        <!-- Box Detail Materi (Dapat dibuka dengan mengklik kartu di atas) -->
        <div class="material-detail-container" id="materialDetailContainer">
            <div class="material-tabs">
                <button class="tab-btn active" data-tab="tab-pengertian">1. Bagian Sudut</button>
                <button class="tab-btn" data-tab="tab-jenis">2. Jenis-Jenis Sudut</button>
                <button class="tab-btn" data-tab="tab-busur">3. Cara Mengukur Sudut</button>
                <button class="tab-btn" data-tab="tab-soal">4. Contoh Soal</button>
            </div>

            <!-- Tab 1: Pengertian & Bagian -->
            <div class="materi-pane active" id="tab-pengertian">
                <span class="eyebrow">PENGERTIAN & BAGIAN SUDUT</span>
                <h3 style="font-size: 1.7rem; margin-bottom: 1rem;">Apa itu Sudut?</h3>
                <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 1.5rem;">
                    <strong>Sudut</strong> adalah daerah yang terbentuk dari dua garis lurus yang berpotongan atau bertemu pada satu titik pangkal yang sama.
                </p>
                <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); margin-bottom: 1.5rem;">
                    <h4 style="margin-bottom: 0.75rem; color: var(--primary-green);">Bagian-Bagian Penting pada Sudut:</h4>
                    <ul style="padding-left: 1.4rem; color: var(--text-main); line-height: 1.8;">
                        <li><strong>Titik Sudut (Vertex):</strong> Titik temu pangkal di mana kedua kaki sudut bertemu.</li>
                        <li><strong>Kaki Sudut:</strong> Dua garis lurus yang membentuk daerah sudut tersebut.</li>
                        <li><strong>Daerah Sudut:</strong> Daerah yang dibatasi oleh kedua kaki sudut, diukur dalam satuan <em>derajat (°)</em>.</li>
                    </ul>
                </div>
            </div>

            <!-- Tab 2: Jenis-jenis Sudut -->
            <div class="materi-pane" id="tab-jenis">
                <span class="eyebrow">RAGAM UKURAN SUDUT</span>
                <h3 style="font-size: 1.7rem; margin-bottom: 0.5rem;">7 Jenis Sudut dalam Matematika</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Berdasarkan besar ukurannya dalam derajat (°), sudut dibagi menjadi:</p>
                
                <div class="angle-types-grid">
                    <div class="angle-type-item">
                        <h4>Sudut Nol</h4>
                        <span class="angle-degrees-badge">Besar = 0°</span>
                        <p style="font-size: 0.9rem; color: var(--text-muted);">Kedua kaki sudut berimpit dan tidak membentuk daerah bukaan sudut sama sekali.</p>
                    </div>
                    <div class="angle-type-item" style="border-top: 3px solid #e91e63;">
                        <h4>Sudut Lancip</h4>
                        <span class="angle-degrees-badge" style="background: #fce4ec; color: #c2185b;">0° &lt; x &lt; 90°</span>
                        <p style="font-size: 0.9rem; color: var(--text-muted);">Bukaan sudut lebih kecil dan lebih runcing daripada sudut siku-siku. Contoh: atap joglo.</p>
                    </div>
                    <div class="angle-type-item" style="border-top: 3px solid #2e7d32;">
                        <h4>Sudut Siku-Siku</h4>
                        <span class="angle-degrees-badge" style="background: #e8f5e9; color: #2e7d32;">Tepat 90°</span>
                        <p style="font-size: 0.9rem; color: var(--text-muted);">Terbentuk dari dua garis yang saling tegak lurus. Contoh: pertemuan tiang dan balok.</p>
                    </div>
                    <div class="angle-type-item" style="border-top: 3px solid #1565c0;">
                        <h4>Sudut Tumpul</h4>
                        <span class="angle-degrees-badge" style="background: #e3f2fd; color: #1565c0;">90° &lt; x &lt; 180°</span>
                        <p style="font-size: 0.9rem; color: var(--text-muted);">Bukaan sudut lebih lebar dari 90° tapi belum membentuk garis lurus. Contoh: ornamen wajik.</p>
                    </div>
                    <div class="angle-type-item">
                        <h4>Sudut Lurus</h4>
                        <span class="angle-degrees-badge">Tepat 180°</span>
                        <p style="font-size: 0.9rem; color: var(--text-muted);">Kedua kaki sudut berlawanan arah dan membentuk garis lurus sempurna.</p>
                    </div>
                    <div class="angle-type-item">
                        <h4>Sudut Refleks</h4>
                        <span class="angle-degrees-badge">180° &lt; x &lt; 360°</span>
                        <p style="font-size: 0.9rem; color: var(--text-muted);">Sudut dengan putaran lebih besar dari sudut lurus tetapi belum satu putaran penuh.</p>
                    </div>
                    <div class="angle-type-item">
                        <h4>Sudut Penuh</h4>
                        <span class="angle-degrees-badge">Tepat 360°</span>
                        <p style="font-size: 0.9rem; color: var(--text-muted);">Satu putaran penuh kembali ke posisi semula (lingkaran penuh).</p>
                    </div>
                </div>
            </div>

            <!-- Tab 3: Cara Mengukur Sudut -->
            <div class="materi-pane" id="tab-busur">
                <span class="eyebrow">PANDUAN PRAKTIKUM</span>
                <h3 style="font-size: 1.7rem; margin-bottom: 1rem;">Langkah Mengukur Sudut dengan Busur Derajat</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                    <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md);">
                        <strong style="color: var(--accent-ochre); font-size: 1.2rem;">Langkah 1</strong>
                        <p style="font-size: 0.9rem; margin-top: 0.4rem;">Letakkan titik pusat busur derajat tepat di atas titik sudut yang akan diukur.</p>
                    </div>
                    <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md);">
                        <strong style="color: var(--accent-ochre); font-size: 1.2rem;">Langkah 2</strong>
                        <p style="font-size: 0.9rem; margin-top: 0.4rem;">Himpitkan garis dasar busur derajat (angka 0°) tepat berimpit dengan salah satu kaki sudut.</p>
                    </div>
                    <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md);">
                        <strong style="color: var(--accent-ochre); font-size: 1.2rem;">Langkah 3</strong>
                        <p style="font-size: 0.9rem; margin-top: 0.4rem;">Lihat kaki sudut yang lain dan baca angka pada skala busur yang dilewati kaki sudut tersebut.</p>
                    </div>
                    <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md);">
                        <strong style="color: var(--accent-ochre); font-size: 1.2rem;">Langkah 4</strong>
                        <p style="font-size: 0.9rem; margin-top: 0.4rem;">Tuliskan besar derajatnya (misal: 45°, 90°, 120°) beserta jenis sudutnya.</p>
                    </div>
                </div>
            </div>

            <!-- Tab 4: Contoh Soal -->
            <div class="materi-pane" id="tab-soal">
                <span class="eyebrow">CONTOH SOAL DAN PEMBAHASAN</span>
                <h3 style="font-size: 1.7rem; margin-bottom: 1rem;">Latihan Terbimbing</h3>
                <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                    <p><strong>Soal:</strong> Sebuah sudut diukur menggunakan busur derajat dan menunjukkan angka 65°. Termasuk ke dalam jenis sudut apakah itu?</p>
                    <p style="margin-top: 0.6rem; color: var(--primary-green); font-weight: 600;">
                        💡 <strong>Pembahasan:</strong> Karena 65° berada di antara 0° dan 90°, maka sudut tersebut adalah <strong>Sudut Lancip</strong>.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pembatas Ornamen Keraton -->
    <div class="kraton-divider">
        <span class="divider-line"></span>
        <span class="divider-emblem">❖ ── 📐 ── ❖</span>
        <span class="divider-line"></span>
    </div>

    <!-- ==================== 02 / JELAJAH BUDAYA KRATON YOGYAKARTA ==================== -->
    <section class="section" id="budaya">
        <div class="section-heading">
            <div class="heading-angle-watermark">⚜ KRATON YOGYA</div>
            <span class="eyebrow">02 / JELAJAH BUDAYA & GEOMETRI</span>
            <h2>Sudut dalam Budaya Kraton Yogyakarta</h2>
            <p>Etnomatematika mengamati kearifan lokal arsitektur dan ornamen budaya Kraton Yogyakarta. Mari amati letak sudut dan perkiraan besar sudutnya.</p>
        </div>

        <div class="culture-grid">
            <!-- Kartu 1: Sudut Siku-Siku (Tiang & Balok Gamelan) -->
            <div class="culture-card">
                <!-- 4 Ornamen Pojok Ukiran Keraton -->
                <div class="kraton-corner kraton-corner-tl"></div>
                <div class="kraton-corner kraton-corner-tr"></div>
                <div class="kraton-corner kraton-corner-bl"></div>
                <div class="kraton-corner kraton-corner-br"></div>

                <div class="culture-img-box">
                    <img src="assets/images/sudut-siku-siku.png" alt="Pertemuan tiang dan balok ukiran Kraton membentuk sudut siku-siku">
                    <span class="culture-badge">⚜ 90° · TEGAK LURUS</span>
                </div>
                <div class="culture-body">
                    <h3>Pertemuan Tiang & Balok</h3>
                    <div class="angle-meta">
                        <span class="meta-pill highlight">Sudut Siku-Siku</span>
                        <span class="meta-pill">Perkiraan: 90°</span>
                        <span class="meta-pill">Gamelan Kraton</span>
                    </div>
                    <p class="culture-desc">
                        Garis penanda biru memperlihatkan balok horizontal bersilangan tegak lurus dengan tiang vertikal pada rangka gamelan berukir emas Kraton Yogyakarta.
                    </p>
                    <div class="cultural-note">
                        "Keseimbangan struktur tiang dan balok 90° melambangkan keteguhan prinsip hidup yang lurus dan kokoh."
                    </div>
                    <a href="#aktivitas" onclick="setPresetAngle(90)" class="card-action" style="margin-top: 1rem; font-weight: 700;">
                        📐 Ukur di Simulator Busur (90°) ↗
                    </a>
                </div>
            </div>

            <!-- Kartu 2: Sudut Lancip (Atap / Bubungan Gerbang) -->
            <div class="culture-card">
                <!-- 4 Ornamen Pojok Ukiran Keraton -->
                <div class="kraton-corner kraton-corner-tl"></div>
                <div class="kraton-corner kraton-corner-tr"></div>
                <div class="kraton-corner kraton-corner-bl"></div>
                <div class="kraton-corner kraton-corner-br"></div>

                <div class="culture-img-box">
                    <img src="assets/images/sudut-lancip.png" alt="Bubungan segitiga atap bangunan Kraton membentuk sudut lancip">
                    <span class="culture-badge">⚜ &lt; 90° · RUNCING</span>
                </div>
                <div class="culture-body">
                    <h3>Bubungan Atap Segitiga</h3>
                    <div class="angle-meta">
                        <span class="meta-pill highlight">Sudut Lancip</span>
                        <span class="meta-pill">Perkiraan: ~40°</span>
                        <span class="meta-pill">Arsitektur Kraton</span>
                    </div>
                    <p class="culture-desc">
                        Garis merah muda menunjukkan sudut di puncak atap segitiga gerbang Kraton bernuansa hijau-emas. Bukaan sudutnya lebih sempit dari 90°.
                    </p>
                    <div class="cultural-note">
                        "Bentuk runcing ke atas mengalirkan air hujan dengan cepat serta bermakna harapan yang membumbung tinggi kepada Sang Pencipta."
                    </div>
                    <a href="#aktivitas" onclick="setPresetAngle(40)" class="card-action" style="margin-top: 1rem; font-weight: 700;">
                        📐 Ukur di Simulator Busur (~40°) ↗
                    </a>
                </div>
            </div>

            <!-- Kartu 3: Sudut Tumpul (Ornamen Wajik / Belah Ketupat) -->
            <div class="culture-card">
                <!-- 4 Ornamen Pojok Ukiran Keraton -->
                <div class="kraton-corner kraton-corner-tl"></div>
                <div class="kraton-corner kraton-corner-tr"></div>
                <div class="kraton-corner kraton-corner-bl"></div>
                <div class="kraton-corner kraton-corner-br"></div>

                <div class="culture-img-box">
                    <img src="assets/images/sudut-tumpul.png" alt="Ukiran ornamen bunga wajik pada kayu merah-emas membentuk sudut tumpul">
                    <span class="culture-badge">⚜ &gt; 90° · LEBAR</span>
                </div>
                <div class="culture-body">
                    <h3>Ornamen Bunga Wajik</h3>
                    <div class="angle-meta">
                        <span class="meta-pill highlight">Sudut Tumpul</span>
                        <span class="meta-pill">Perkiraan: ~135°</span>
                        <span class="meta-pill">Ukiran Kayu Jati</span>
                    </div>
                    <p class="culture-desc">
                        Garis lengkung biru tua menandai sudut bagian bawah pada ornamen bunga belah ketupat kayu merah-emas. Bukaan sudutnya melebar lebih dari 90°.
                    </p>
                    <div class="cultural-note">
                        "Sudut tumpul yang mengembang melambangkan keterbukaan hati dan kelapangan dada dalam menerima sesama."
                    </div>
                    <a href="#aktivitas" onclick="setPresetAngle(135)" class="card-action" style="margin-top: 1rem; font-weight: 700;">
                        📐 Ukur di Simulator Busur (~135°) ↗
                    </a>
                </div>
            </div>
        </div>

        <!-- Kartu Tambahan: Motif Batik Parang -->
        <div class="batik-parang-card" style="margin-top: 2.5rem; background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 2rem; display: grid; grid-template-columns: 280px 1fr; gap: 2rem; align-items: center; box-shadow: var(--shadow-subtle);">
            <div style="height: 200px; border-radius: var(--radius-md); overflow: hidden; background: #e0d8ca;">
                <img src="assets/images/batik-parang.jpg" alt="Motif Batik Parang Kraton Yogyakarta" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div>
                <span class="eyebrow">ETNOMATEMATIKA BATIK KRATON</span>
                <h3 style="font-size: 1.45rem; margin-bottom: 0.5rem;">Motif Batik Parang: Garis Miring dan Sudut</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.85rem;">
                    Batik Parang merupakan salah satu motif larangan tertua khas Kraton Yogyakarta. Pola lerengnya tersusun dari garis-garis diagonal miring yang berulang membentuk sudut kemiringan sekitar <strong>45° (Sudut Lancip)</strong> terhadap sumbu horizontal kain.
                </p>
                <div style="font-size: 0.88rem; color: var(--accent-ochre); font-weight: 700;">
                    ✦ Menunjukkan perpaduan keselarasan geometri, simetri, dan nilai luhur pantang menyerah.
                </div>
            </div>
        </div>
    </section>

    <!-- Pembatas Ornamen Keraton -->
    <div class="kraton-divider">
        <span class="divider-line"></span>
        <span class="divider-emblem">❖ ── 📐 ── ❖</span>
        <span class="divider-line"></span>
    </div>

    <!-- ==================== 03 / AKTIVITAS INTERAKTIF & DETEKTIF SUDUT ==================== -->
    <section class="section" id="aktivitas">
        <div class="section-heading">
            <div class="heading-angle-watermark">📐 BUSUR & MISI</div>
            <span class="eyebrow">03 / AKTIVITAS INTERAKTIF</span>
            <h2>Simulator Busur & Detektif Sudut</h2>
            <p>Praktikkan langsung pengukuran sudut virtual dan pecahkan misi rahasia mencari sudut tersembunyi pada artefak Kraton!</p>
        </div>

        <div class="interactive-container">
            <!-- 1. Simulator Busur Derajat Virtual -->
            <div class="protractor-card">
                <div class="game-header">
                    <div>
                        <span class="eyebrow" style="margin: 0;">LABORATORIUM SUDUT</span>
                        <h3 style="font-size: 1.35rem; margin-top: 0.2rem;">Simulator Busur Derajat</h3>
                    </div>
                    <span class="slider-angle-readout" id="angleDisplay">45°</span>
                </div>
                
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
                    Geser tuas di bawah untuk memutar kaki sudut dan perhatikan perubahan besaran derajatnya secara langsung:
                </p>

                <!-- Area Busur Derajat SVG Interaktif -->
                <div class="protractor-canvas-wrap">
                    <svg id="protractorSvg" viewBox="0 0 360 210" xmlns="http://www.w3.org/2000/svg">
                        <!-- Pola Busur Derajat Semi-Lingkaran -->
                        <path d="M 30 180 A 150 150 0 0 1 330 180 Z" fill="#ffffff" stroke="#b66d28" stroke-width="2.5" opacity="0.9" />
                        <!-- Skala busur derajat -->
                        <circle cx="180" cy="180" r="145" fill="none" stroke="#e8e2d5" stroke-dasharray="2 6" />
                        <text x="180" y="25" text-anchor="middle" font-size="11" font-weight="700" fill="#1e3a8a">90°</text>
                        <text x="325" y="175" text-anchor="end" font-size="11" font-weight="700" fill="#1e3a8a">0°</text>
                        <text x="35" y="175" text-anchor="start" font-size="11" font-weight="700" fill="#1e3a8a">180°</text>
                        <text x="285" y="75" text-anchor="middle" font-size="10" fill="#888">45°</text>
                        <text x="75" y="75" text-anchor="middle" font-size="10" fill="#888">135°</text>

                        <!-- Kaki Sudut Dasar (Horizontal 0°) -->
                        <line x1="180" y1="180" x2="330" y2="180" stroke="#1e3a8a" stroke-width="3.5" stroke-linecap="round" />
                        
                        <!-- Daerah Bukaan Sudut (Arc) -->
                        <path id="dynamicArc" d="" fill="rgba(217, 119, 6, 0.2)" stroke="#d97706" stroke-width="2" />

                        <!-- Kaki Sudut Dinamis -->
                        <line id="dynamicArm" x1="180" y1="180" x2="279" y2="81" stroke="#d97706" stroke-width="3.5" stroke-linecap="round" />

                        <!-- Titik Sudut (Pusat) -->
                        <circle cx="180" cy="180" r="6" fill="#1e3a8a" />
                        <circle cx="180" cy="180" r="3" fill="#ffffff" />
                    </svg>

                    <!-- Indikator Jenis Sudut -->
                    <div id="angleClassification" style="font-weight: 800; font-size: 1.05rem; margin-top: 0.5rem; color: #e91e63;">
                        Sudut Lancip (45° &lt; 90°)
                    </div>
                </div>

                <div class="slider-control">
                    <span style="font-size: 0.85rem; font-weight: 700;">0°</span>
                    <input type="range" id="angleSlider" min="0" max="180" value="45">
                    <span style="font-size: 0.85rem; font-weight: 700;">180°</span>
                </div>

                <div style="display: flex; gap: 0.65rem; margin-top: 1rem; flex-wrap: wrap;">
                    <button type="button" class="preset-angle-btn" onclick="setPresetAngle(40)">📐 Preset Atap (40°)</button>
                    <button type="button" class="preset-angle-btn" onclick="setPresetAngle(90)">📐 Preset Tiang (90°)</button>
                    <button type="button" class="preset-angle-btn" onclick="setPresetAngle(135)">📐 Preset Ornamen (135°)</button>
                </div>
            </div>

            <!-- 2. Game Interaktif "Detektif Sudut Kraton" -->
            <div class="game-card">
                <div class="game-header">
                    <div>
                        <span class="eyebrow" style="margin: 0;">GAME EDUKASI</span>
                        <h3 style="font-size: 1.35rem; margin-top: 0.2rem;">Detektif Sudut Kraton</h3>
                    </div>
                    <div class="score-badge">Skor: <span id="detectiveScoreVal">0</span></div>
                </div>

                <div class="game-quiz-screen">
                    <h4 id="detectiveTitle" style="font-size: 1.05rem; color: var(--accent-ochre); margin-bottom: 0.75rem;">Misi 1: Amati Bubungan Atap Bangunan Kraton</h4>
                    <div class="game-img-preview">
                        <img id="detectiveImg" src="assets/images/sudut-lancip.png" alt="Gambar Objek Game Sudut Kraton">
                    </div>
                    <p id="detectiveQuestionText" style="font-size: 0.95rem; font-weight: 600; margin-bottom: 1rem;">
                        Perhatikan sudut lancip di pucuk bubungan atap Kraton. Apa jenis sudut yang terbentuk?
                    </p>
                    
                    <div class="game-options-grid" id="detectiveOptionsBox">
                        <!-- Opsi digenerate oleh script.js -->
                    </div>

                    <div id="detectiveFeedback" class="game-feedback"></div>

                    <div style="margin-top: 1rem;">
                        <button id="detectiveNextBtn" type="button" class="btn" style="display: none; width: 100%;">
                            Misi Berikutnya →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pembatas Ornamen Keraton -->
    <div class="kraton-divider">
        <span class="divider-line"></span>
        <span class="divider-emblem">❖ ── ✍️ ── ❖</span>
        <span class="divider-line"></span>
    </div>

    <!-- ==================== 04 / LATIHAN & EVALUASI ==================== -->
    <section class="section quiz-section" id="evaluasi">
        <div class="section-heading">
            <div class="heading-angle-watermark">⭐ EVALUASI</div>
            <span class="eyebrow">04 / EVALUASI PEMBELAJARAN</span>
            <h2>Uji Pemahamanmu</h2>
            <p>Jawab pertanyaan tentang bagian sudut, jenis sudut, dan etnomatematika Kraton. Setelah diperiksa, nilai dan pembahasan lengkap akan langsung ditampilkan.</p>
        </div>

        <?php if ($quizSubmitted): ?>
            <!-- Card Hasil Evaluasi Siswa -->
            <div class="result-card">
                <div class="score-circle">
                    <?= $score ?>
                    <span>DARI 100</span>
                </div>
                <h3>
                    <?php if ($score >= 80): ?>
                        🎉 Luar Biasa, <?= htmlspecialchars($studentName) ?>!
                    <?php elseif ($score >= 60): ?>
                        👍 Bagus, <?= htmlspecialchars($studentName) ?>!
                    <?php elseif ($score > 0): ?>
                        ⚠️ Perlu Belajar Lagi, <?= htmlspecialchars($studentName) ?>!
                    <?php else: ?>
                        ❌ Belum Tuntas, <?= htmlspecialchars($studentName) ?>!
                    <?php endif; ?>
                </h3>
                <p>
                    <?php if ($score >= 80): ?>
                        Selamat! Kamu telah menguasai materi sudut dan etnomatematika Kraton Yogyakarta dengan sangat baik. Pertahankan prestasimu!
                    <?php elseif ($score >= 60): ?>
                        Kamu sudah memahami dasar-dasar materi sudut, namun masih ada beberapa soal yang perlu kamu cermati lagi.
                    <?php elseif ($score > 0): ?>
                        Kamu masih keliru pada sebagian besar soal. Yuk amati kembali materi dan penjelasan sudut budaya Kraton di atas, lalu coba lagi!
                    <?php else: ?>
                        Kamu belum berhasil menjawab soal dengan benar (Skor 0). Jangan patah semangat, pelajari kembali materi bagian & jenis sudut di atas lalu coba ulangi evaluasi ini ya!
                    <?php endif; ?>
                </p>

                <?php if (!empty($refleksiAnswer)): ?>
                    <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); text-align: left; margin: 1.5rem auto 0 auto; max-width: 600px;">
                        <strong>Catatan Refleksimu Hari Ini:</strong>
                        <p style="font-style: italic; color: var(--text-main); margin-top: 0.25rem;">"<?= nl2br(htmlspecialchars($refleksiAnswer)) ?>"</p>
                    </div>
                <?php endif; ?>

                <div class="review-answers-box">
                    <h4 style="margin-bottom: 1rem; font-size: 1.2rem;">Pembahasan Soal:</h4>
                    <?php foreach ($questions as $idx => $q): 
                        $userAns = isset($userAnswers[$idx]) ? (int)$userAnswers[$idx] : -1;
                        $isCorrect = ($userAns === $q['correct']);
                    ?>
                        <div class="review-item <?= $isCorrect ? '' : 'wrong' ?>">
                            <strong>Soal <?= $idx + 1 ?>:</strong> <?= htmlspecialchars($q['question']) ?><br>
                            <span style="font-size: 0.9rem; color: <?= $isCorrect ? '#2e7d32' : '#c62828' ?>;">
                                <?= $isCorrect ? '✔ Jawabanmu Benar' : '✖ Jawabanmu: ' . ($userAns >= 0 ? htmlspecialchars($q['options'][$userAns]) : 'Tidak dijawab') ?>
                            </span><br>
                            <span style="font-size: 0.9rem; color: var(--text-muted);">
                                💡 <strong>Kunci Jawaban:</strong> <?= htmlspecialchars($q['options'][$q['correct']]) ?> — <?= htmlspecialchars($q['explanation']) ?>
                            </span>
                        </div>
                    <?php endforeach; ?>
                </div>

                <a href="#evaluasi" class="btn" style="margin-top: 1.5rem;" onclick="location.reload();">Ulangi Evaluasi ↻</a>
            </div>
        <?php endif; ?>

        <!-- Form Evaluasi (Persis Layout Referensi Screenshot 2) -->
        <form class="quiz-form" method="post" action="#evaluasi">
            <input type="hidden" name="submit_quiz" value="1">

            <!-- Data Diri Siswa -->
            <div class="student-info-box">
                <div class="form-group">
                    <label for="student_name">Nama Lengkap Siswa:</label>
                    <input type="text" id="student_name" name="student_name" required placeholder="Contoh: Raden Bagus" value="<?= htmlspecialchars($studentName) ?>">
                </div>
                <div class="form-group">
                    <label for="student_class">Kelas / Rombel:</label>
                    <input type="text" id="student_class" name="student_class" required placeholder="Contoh: V-A, V-B, atau 5 SD" value="<?= htmlspecialchars($studentClass) ?>">
                </div>
            </div>

            <!-- Butir Soal Pilihan Ganda -->
            <?php foreach ($questions as $idx => $q): ?>
                <div class="question-card">
                    <div class="question-header">
                        <span class="question-number">SOAL <?= $idx + 1 ?></span>
                        <h4 class="question-title"><?= htmlspecialchars($q['question']) ?></h4>
                    </div>
                    <div class="options">
                        <?php foreach ($q['options'] as $optIdx => $option): ?>
                            <label class="option">
                                <input type="radio" name="answer[<?= $idx ?>]" value="<?= $optIdx ?>" required <?= (isset($userAnswers[$idx]) && (int)$userAnswers[$idx] === $optIdx) ? 'checked' : '' ?>>
                                <span><?= htmlspecialchars($option) ?></span>
                            </label>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>

            <!-- Soal Uraian Singkat -->
            <div class="question-card">
                <div class="question-header">
                    <span class="question-number">SOAL URAIAN</span>
                    <h4 class="question-title">Jelaskan secara singkat bagaimana cara meletakkan busur derajat saat kita ingin mengukur besar suatu sudut!</h4>
                </div>
                <div class="form-group" style="margin-top: 1rem;">
                    <textarea name="jawaban_uraian" rows="3" placeholder="Tuliskan langkah-langkah meletakkan titik pusat busur dan garis dasarnya..."><?= htmlspecialchars($uraianAnswer) ?></textarea>
                </div>
            </div>

            <!-- Kotak Refleksi Siswa -->
            <div class="reflection-box">
                <span class="eyebrow">REFLEKSI BELAJAR</span>
                <h3>Apa hal baru yang kamu pelajari hari ini?</h3>
                <p>Bagikan perasaan dan pengetahuan baru yang kamu peroleh dari materi sudut dan budaya Kraton Yogyakarta:</p>
                <div class="form-group">
                    <textarea name="jawaban_refleksi" rows="3" placeholder="Contoh: Hari ini saya baru tahu kalau tiang balok di Kraton membentuk sudut siku-siku 90°..."><?= htmlspecialchars($refleksiAnswer) ?></textarea>
                </div>
            </div>

            <button class="btn submit-btn" type="submit">Periksa Semua Jawaban →</button>
        </form>
    </section>

    <!-- ==================== 05 / TENTANG (PERSIS SCREENSHOT 3) ==================== -->
    <section class="about" id="tentang">
        <div class="about-card">
            <div>
                <span class="eyebrow">05 / TENTANG ETNOMATEMATIKA</span>
                <h2>Budaya bisa menjadi pintu masuk untuk belajar matematika.</h2>
            </div>
            <p>
                Etnomatematika menghubungkan konsep matematika formal dengan aktivitas, peninggalan arsitektur, dan ragam hias kebudayaan di sekitar kita. Melalui peninggalan adiluhung Kraton Yogyakarta, siswa diajak melihat bahwa matematika bukanlah rumus yang abstrak, melainkan bagian nyata dari sejarah, keindahan seni ukir, dan konstruksi bangunan tradisional para leluhur bangsa.
            </p>
        </div>
    </section>
</main>

<!-- ==================== FOOTER (PERSIS SCREENSHOT 3) ==================== -->
<footer>
    <a class="footer-brand" href="#beranda">
        Mengenal Sudut <span>Etnomatematika</span>
    </a>
    <p>Media pembelajaran matematika berbasis budaya · 2026</p>
    <a class="back-to-top" href="#beranda">Kembali ke atas ↑</a>
</footer>

<script src="script.js"></script>
</body>
</html>
