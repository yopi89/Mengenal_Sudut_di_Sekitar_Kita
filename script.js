/* ==========================================================================
   SCRIPT.JS - INTERAKSI SIMULATOR BUSUR & DETEKTIF SUDUT KRATON
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle & Navigasi ScrollSpy
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }

    // ScrollSpy: Garis bawah otomatis berpindah mengikuti posisi scroll
    const sections = Array.from(navLinks).map(link => {
        const id = link.getAttribute('href').slice(1);
        return document.getElementById(id);
    }).filter(Boolean);

    function updateActiveNav() {
        const scrollPos = window.scrollY + 180; // offset header sticky
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Jika berada di paling bawah halaman, aktifkan menu terakhir (Tentang)
        if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
            if (sections.length > 0) {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        }

        if (currentSectionId) {
            navLinks.forEach(link => {
                const target = link.getAttribute('href').slice(1);
                link.classList.toggle('active', target === currentSectionId);
            });
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // Klik menu navigasi langsung memindahkan garis bawah aktif
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            if (mainNav && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
            }
        });
    });

    // 2. Tab Navigasi Materi Detail
    const tabBtns = document.querySelectorAll('.tab-btn');
    const materiPanes = document.querySelectorAll('.materi-pane');
    const detailContainer = document.getElementById('materialDetailContainer');

    window.openMateriTab = function (tabId) {
        if (detailContainer) {
            detailContainer.classList.add('active');
            const headerOffset = 90;
            const elementPosition = detailContainer.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        materiPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === tabId);
        });
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            openMateriTab(targetId);
        });
    });

    // 3. Simulator Busur Derajat Interaktif
    const angleSlider = document.getElementById('angleSlider');
    const angleDisplay = document.getElementById('angleDisplay');
    const dynamicArm = document.getElementById('dynamicArm');
    const dynamicArc = document.getElementById('dynamicArc');
    const angleClassification = document.getElementById('angleClassification');

    function updateProtractor(deg) {
        if (!dynamicArm || !dynamicArc) return;

        // Radius busur derajat SVG
        const cx = 180;
        const cy = 180;
        const armLength = 140;
        const arcRadius = 45;

        // Hitung koordinat ujung kaki sudut dinamis
        const rad = (deg * Math.PI) / 180;
        const x2 = cx + armLength * Math.cos(rad);
        const y2 = cy - armLength * Math.sin(rad); // sumbu Y terbalik di SVG

        dynamicArm.setAttribute('x2', x2);
        dynamicArm.setAttribute('y2', y2);

        // Hitung path busur sudut (Arc)
        const arcX = cx + arcRadius * Math.cos(rad);
        const arcY = cy - arcRadius * Math.sin(rad);
        const largeArcFlag = deg > 180 ? 1 : 0;

        if (deg === 0) {
            dynamicArc.setAttribute('d', '');
        } else {
            dynamicArc.setAttribute('d', `M ${cx + arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcX} ${arcY}`);
        }

        // Tampilkan besar sudut
        if (angleDisplay) angleDisplay.textContent = `${deg}°`;

        // Tentukan klasifikasi sudut
        if (angleClassification) {
            let label = '';
            let color = '#b66d28';
            if (deg === 0) {
                label = 'Sudut Nol (0°)';
            } else if (deg < 90) {
                label = `Sudut Lancip (${deg}° < 90°)`;
                color = '#e91e63';
            } else if (deg === 90) {
                label = 'Sudut Siku-Siku (Tepat 90°)';
                color = '#2e7d32';
            } else if (deg < 180) {
                label = `Sudut Tumpul (90° < ${deg}° < 180°)`;
                color = '#1565c0';
            } else if (deg === 180) {
                label = 'Sudut Lurus (Tepat 180°)';
                color = '#6a1b9a';
            }
            angleClassification.textContent = label;
            angleClassification.style.color = color;
        }
    }

    if (angleSlider) {
        angleSlider.addEventListener('input', (e) => {
            updateProtractor(parseInt(e.target.value));
        });
    }

    window.setPresetAngle = function (val) {
        if (angleSlider) {
            angleSlider.value = val;
            updateProtractor(val);
        }
    };

    // Inisialisasi awal busur derajat
    if (angleSlider) {
        updateProtractor(parseInt(angleSlider.value || 45));
    }

    // 4. Game "Detektif Sudut Kraton"
    const detectiveQuestions = [
        {
            title: "Misi 1: Amati Bubungan Atap Bangunan Kraton",
            image: "assets/images/sudut-lancip.png",
            question: "Perhatikan sudut lancip di pucuk bubungan atap Kraton. Apa jenis sudut yang terbentuk?",
            options: ["Sudut Lancip (< 90°)", "Sudut Siku-Siku (90°)", "Sudut Tumpul (> 90°)"],
            correct: 0,
            explain: "Tepat sekali! Bentuk atap segitiga ini membentuk sudut lancip yang lebih kecil dari 90° (perkiraan 40°)."
        },
        {
            title: "Misi 2: Pertemuan Tiang & Balok Ukiran Gamelan",
            image: "assets/images/sudut-siku-siku.png",
            question: "Garis penanda biru memperlihatkan balok horizontal dan tiang vertikal. Sudut apakah ini?",
            options: ["Sudut Tumpul", "Sudut Siku-Siku", "Sudut Lancip"],
            correct: 1,
            explain: "Hebat! Pertemuan tiang vertikal tegak lurus dengan balok horizontal membentuk sudut siku-siku 90°."
        },
        {
            title: "Misi 3: Ukiran Bunga Wajik Kayu Merah-Emas",
            image: "assets/images/sudut-tumpul.png",
            question: "Perhatikan busur garis di ornamen belah ketupat/wajik ini. Sudut apakah yang ditandai?",
            options: ["Sudut Siku-Siku", "Sudut Lancip", "Sudut Tumpul (> 90°)"],
            correct: 2,
            explain: "Benar! Sudut pada ornamen melebar lebih dari 90° sehingga disebut sudut tumpul (perkiraan 135°)."
        },
        {
            title: "Misi 4: Motif Batik Parang Lereng Kraton",
            image: "assets/images/batik-parang.jpg",
            question: "Garis miring diagonal pada motif batik Parang membentuk sudut miring terhadap garis dasar. Sudut yang terbentuk lebih kecil dari 90°, yaitu...",
            options: ["Sudut Lancip", "Sudut Lurus", "Sudut Refleks"],
            correct: 0,
            explain: "Tepat! Kemiringan diagonal motif parang umumnya berkisar antara 45° yang merupakan sudut lancip."
        }
    ];

    let currentDetectiveRound = 0;
    let detectiveScore = 0;

    const detectiveTitle = document.getElementById('detectiveTitle');
    const detectiveImg = document.getElementById('detectiveImg');
    const detectiveQuestionText = document.getElementById('detectiveQuestionText');
    const detectiveOptionsBox = document.getElementById('detectiveOptionsBox');
    const detectiveFeedback = document.getElementById('detectiveFeedback');
    const detectiveScoreVal = document.getElementById('detectiveScoreVal');
    const detectiveNextBtn = document.getElementById('detectiveNextBtn');

    function renderDetectiveRound() {
        if (!detectiveTitle || !detectiveImg) return;

        if (currentDetectiveRound >= detectiveQuestions.length) {
            // Evaluasi berdasarkan skor yang diperoleh
            const maxScore = detectiveQuestions.length * 25;
            let resultTitle = "";
            let resultMessage = "";
            let resultBadge = "";
            let badgeColor = "var(--primary-green)";

            if (detectiveScore === maxScore) {
                resultTitle = "🏆 Luar Biasa! Detektif Sudut Istimewa!";
                resultMessage = `Hebat sekali! Kamu berhasil mengamati dan menjawab seluruh sudut artefak Kraton Yogyakarta dengan sempurna (Skor: <strong>${detectiveScore} / ${maxScore}</strong>).`;
                resultBadge = "⭐ Selamat! Kamu resmi bergelar: Detektif Sudut Istimewa Kraton! ⭐";
            } else if (detectiveScore >= 75) {
                resultTitle = "🎖️ Bagus Sekali! Detektif Sudut Mahir!";
                resultMessage = `Kerja yang sangat bagus! Sebagian besar sudut budaya berhasil kamu identifikasi dengan tepat (Skor: <strong>${detectiveScore} / ${maxScore}</strong>).`;
                resultBadge = "🔎 Kamu resmi bergelar: Detektif Sudut Mahir! 🔎";
            } else if (detectiveScore >= 50) {
                resultTitle = "🔎 Cukup Baik! Detektif Sudut Magang!";
                resultMessage = `Kamu sudah mulai memahami konsep sudut, tetapi masih ada beberapa yang keliru (Skor: <strong>${detectiveScore} / ${maxScore}</strong>).`;
                resultBadge = "🌱 Status: Detektif Sudut Magang (Tingkatkan Lagi!) 🌱";
                badgeColor = "#b66d28";
            } else {
                resultTitle = "⚠️ Misi Belum Berhasil!";
                resultMessage = `Sayang sekali, kamu belum berhasil mengidentifikasi sudut dengan tepat (Skor: <strong>${detectiveScore} / ${maxScore}</strong>). Jangan menyerah, ayo pelajari kembali materi jenis-jenis sudut dan coba lagi ya!`;
                resultBadge = "❌ Status: Belum Lulus Misi Detektif ❌";
                badgeColor = "#c62828";
            }

            detectiveTitle.textContent = resultTitle;
            detectiveImg.src = "assets/images/kraton-hero.jpg";
            detectiveQuestionText.innerHTML = resultMessage;
            detectiveOptionsBox.innerHTML = `
                <div style="text-align: center; padding: 1.5rem 0;">
                    <p style="font-size: 1.1rem; color: ${badgeColor}; font-weight: 700;">
                        ${resultBadge}
                    </p>
                    <button class="btn" style="margin-top: 1.25rem;" onclick="resetDetectiveGame()">
                        ${detectiveScore < 75 ? 'Coba Lagi Misi Ini ↻' : 'Main Lagi ↻'}
                    </button>
                </div>
            `;
            if (detectiveFeedback) detectiveFeedback.style.display = 'none';
            if (detectiveNextBtn) detectiveNextBtn.style.display = 'none';
            return;
        }

        const q = detectiveQuestions[currentDetectiveRound];
        detectiveTitle.textContent = q.title;
        detectiveImg.src = q.image;
        detectiveQuestionText.textContent = q.question;
        if (detectiveFeedback) {
            detectiveFeedback.className = 'game-feedback';
            detectiveFeedback.style.display = 'none';
        }
        if (detectiveNextBtn) detectiveNextBtn.style.display = 'none';

        detectiveOptionsBox.innerHTML = '';
        q.options.forEach((optText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'game-opt-btn';
            btn.type = 'button';
            btn.textContent = `${String.fromCharCode(65 + idx)}. ${optText}`;
            btn.addEventListener('click', () => checkDetectiveAnswer(idx));
            detectiveOptionsBox.appendChild(btn);
        });
    }

    function checkDetectiveAnswer(selectedIdx) {
        const q = detectiveQuestions[currentDetectiveRound];
        const allBtns = detectiveOptionsBox.querySelectorAll('.game-opt-btn');
        allBtns.forEach(b => b.disabled = true);

        if (selectedIdx === q.correct) {
            detectiveScore += 25;
            if (detectiveScoreVal) detectiveScoreVal.textContent = detectiveScore;
            detectiveFeedback.className = 'game-feedback success';
            detectiveFeedback.innerHTML = `✔ <strong>Jawaban Benar!</strong> ${q.explain}`;
        } else {
            detectiveFeedback.className = 'game-feedback wrong';
            detectiveFeedback.innerHTML = `✖ <strong>Belum Tepat.</strong> Jawaban yang benar adalah <em>${q.options[q.correct]}</em>. ${q.explain}`;
        }
        detectiveFeedback.style.display = 'block';

        if (detectiveNextBtn) {
            detectiveNextBtn.style.display = 'inline-flex';
        }
    }

    window.nextDetectiveRound = function () {
        currentDetectiveRound++;
        renderDetectiveRound();
    };

    window.resetDetectiveGame = function () {
        currentDetectiveRound = 0;
        detectiveScore = 0;
        if (detectiveScoreVal) detectiveScoreVal.textContent = '0';
        renderDetectiveRound();
    };

    if (detectiveNextBtn) {
        detectiveNextBtn.addEventListener('click', nextDetectiveRound);
    }

    // Inisialisasi game jika elemen ada
    if (detectiveTitle) {
        renderDetectiveRound();
    }

    // 5. Evaluasi Pembelajaran (Client-side / Statis)
    // 15 soal pilihan ganda: 10 soal pengetahuan + 5 soal HOTS (berpikir kritis)
    const evaluasiQuestions = [
        // --- SOAL PENGETAHUAN & PEMAHAMAN ---
        {
            id: 0,
            question: 'Titik pertemuan antara dua garis lurus yang membentuk sebuah sudut dinamakan...',
            options: ['Kaki sudut', 'Titik sudut', 'Derajat sudut'],
            correct: 1,
            explanation: 'Titik sudut adalah titik pangkal persekutuan tempat bertemunya dua garis lurus (kaki sudut).',
            hots: false
        },
        {
            id: 1,
            question: 'Sudut yang besarnya lebih kecil dari 90° (antara 0° sampai 90°) disebut sudut...',
            options: ['Sudut lancip', 'Sudut siku-siku', 'Sudut tumpul'],
            correct: 0,
            explanation: 'Sudut lancip berukuran lebih dari 0° dan kurang dari 90°.',
            hots: false
        },
        {
            id: 2,
            question: 'Pada bangunan Kraton Yogyakarta, pertemuan antara tiang kayu tegak lurus dengan balok mendatar membentuk...',
            options: ['Sudut tumpul', 'Sudut lancip', 'Sudut siku-siku (90°)'],
            correct: 2,
            explanation: 'Pertemuan tiang vertikal dan balok horizontal saling tegak lurus membentuk sudut 90° (sudut siku-siku).',
            hots: false
        },
        {
            id: 3,
            question: 'Alat standar yang digunakan untuk mengukur besar suatu sudut secara tepat adalah...',
            options: ['Jangka sorong', 'Busur derajat', 'Meteran pita'],
            correct: 1,
            explanation: 'Busur derajat (protractor) adalah alat pengukur besar sudut dalam satuan derajat (°).',
            hots: false
        },
        {
            id: 4,
            question: 'Bentuk bubungan atap joglo atau segitiga gerbang Kraton merupakan contoh benda budaya yang memiliki...',
            options: ['Sudut lancip', 'Sudut tumpul', 'Sudut lurus'],
            correct: 0,
            explanation: 'Kemiringan atap yang meruncing ke atas membentuk sudut lancip kurang dari 90°.',
            hots: false
        },
        {
            id: 5,
            question: 'Sudut yang ukurannya lebih dari 90° tetapi kurang dari 180° seperti pada bagian bawah ornamen belah ketupat adalah...',
            options: ['Sudut refleks', 'Sudut tumpul', 'Sudut siku-siku'],
            correct: 1,
            explanation: 'Sudut tumpul memiliki rentang ukuran antara 90° sampai 180°.',
            hots: false
        },
        {
            id: 6,
            question: 'Besar ukuran sudut satu putaran penuh pada sebuah lingkaran adalah...',
            options: ['90°', '180°', '360°'],
            correct: 2,
            explanation: 'Satu putaran penuh lingkaran berukuran 360°, sedangkan setengah putaran berukuran 180°.',
            hots: false
        },
        {
            id: 7,
            question: 'Sudut yang tepat berukuran 180° sehingga membentuk satu garis lurus datar dinamakan...',
            options: ['Sudut lurus', 'Sudut siku-siku', 'Sudut tumpul'],
            correct: 0,
            explanation: 'Sudut lurus memiliki besar sudut tepat 180° dan membentuk garis lurus mendatar.',
            hots: false
        },
        {
            id: 8,
            question: 'Jarum jam dinding yang menunjukkan tepat pukul 09.00 membentuk jenis sudut...',
            options: ['Sudut lancip', 'Sudut siku-siku (90°)', 'Sudut tumpul'],
            correct: 1,
            explanation: 'Pada pukul 09.00 atau 03.00, kedua jarum jam saling tegak lurus membentuk sudut 90° (siku-siku).',
            hots: false
        },
        {
            id: 9,
            question: 'Pada bentuk ornamen Kraton atau kipas tari Jawa yang dibuka lebar hingga 120°, jenis sudut yang terbentuk adalah...',
            options: ['Sudut lancip', 'Sudut tumpul', 'Sudut siku-siku'],
            correct: 1,
            explanation: 'Sudut 120° berada di antara 90° sampai 180°, sehingga dikelompokkan ke dalam jenis sudut tumpul.',
            hots: false
        },

        // --- SOAL HOTS (BERPIKIR KRITIS & MENGANALISIS) ---
        {
            id: 10,
            question: '🔍 [HOTS] Ani membuat bingkai foto berbentuk segitiga dari bambu. Sudut kiri bawah = 50°, sudut kanan bawah = 70°. Ani lupa mengukur sudut paling atas. Tanpa busur derajat, bisakah Ani mengetahui besar sudut atasnya? Berapa besar sudut tersebut dan termasuk jenis apa?',
            options: ['Tidak bisa diketahui tanpa busur derajat', '60°, sudut lancip — karena 180° − 50° − 70° = 60°', '120°, sudut tumpul — karena 50° + 70° = 120°'],
            correct: 1,
            explanation: 'Bisa! Jumlah ketiga sudut segitiga selalu 180°. Jadi sudut atas = 180° − 50° − 70° = 60°. Karena kurang dari 90°, termasuk sudut lancip. Ini kemampuan penting yang dipakai para pengrajin Kraton zaman dulu!',
            hots: true
        },
        {
            id: 11,
            question: '🔍 [HOTS] Di pameran budaya Kraton, ada 4 macam kipas tari. Kipas A terbuka 45°, kipas B terbuka dua kali lipat kipas A, kipas C terbuka setengah dari kipas B, dan kipas D terbuka 30° lebih besar dari kipas C. Kipas manakah yang termasuk sudut siku-siku?',
            options: ['Kipas A (45°) — sudut siku-siku', 'Kipas C (45°) — sudut siku-siku', 'Kipas B (90°) — sudut siku-siku'],
            correct: 2,
            explanation: 'Kipas A = 45°. Kipas B = 45° × 2 = 90° (siku-siku!). Kipas C = 90° ÷ 2 = 45°. Kipas D = 45° + 30° = 75°. Jadi hanya Kipas B yang membentuk sudut siku-siku tepat 90°.',
            hots: true
        },
        {
            id: 12,
            question: '🔍 [HOTS] Pak Dalang mengatur 3 wayang kulit di layar. Wayang pertama berdiri tegak (90° dari lantai). Wayang kedua dimiringkan 25° dari wayang pertama ke kiri. Wayang ketiga dimiringkan 40° dari wayang kedua ke kiri lagi. Berapa sudut wayang ketiga terhadap lantai, dan termasuk jenis sudut apa?',
            options: ['25°, sudut lancip', '65°, sudut lancip — karena 90° − 25° = 65°, lalu wayang ketiga menjadi 65° − 40° = 25°', '25°, sudut lancip — karena 90° − 25° − 40° = 25°'],
            correct: 2,
            explanation: 'Wayang 1 = 90° dari lantai. Dimiringkan 25° ke kiri = 90° − 25° = 65°. Lalu dimiringkan 40° lagi = 65° − 40° = 25° dari lantai. Karena 25° < 90°, termasuk sudut lancip.',
            hots: true
        },
        {
            id: 13,
            question: '🔍 [HOTS] Ibu Guru minta siswa menggambar sudut yang berpelurus dengan sudut 73°. Rino menggambar 107°, Sinta menggambar 117°, Dino menggambar 97°. Siapa yang jawabannya BENAR dan mengapa?',
            options: ['Sinta benar, karena 73° + 117° = 190° mendekati 180°', 'Rino benar, karena dua sudut berpelurus jumlahnya harus tepat 180°, dan 73° + 107° = 180°', 'Dino benar, karena 73° + 97° = 170° paling dekat ke 180°'],
            correct: 1,
            explanation: 'Dua sudut berpelurus adalah dua sudut yang jika digabung membentuk garis lurus = 180°. Jadi pasangan sudut 73° adalah 180° − 73° = 107°. Rino yang benar!',
            hots: true
        },
        {
            id: 14,
            question: '🔍 [HOTS] Sebuah ornamen Kraton berbentuk persegi panjang. Di dalam persegi panjang itu digambar garis diagonal dari pojok kiri atas ke pojok kanan bawah, sehingga terbentuk 2 segitiga. Jika sudut lancip segitiga atas = 35°, berapakah sudut lancip segitiga bawah yang terbentuk di pojok kanan bawah?',
            options: ['35°, karena kedua segitiga kembar dan sudutnya sama', '55°, karena 90° − 35° = 55°', '145°, karena 180° − 35° = 145°'],
            correct: 0,
            explanation: 'Garis diagonal memotong persegi panjang menjadi 2 segitiga yang identik (kongruen). Sudut yang berhadapan di dua segitiga tersebut besarnya sama. Jadi jika sudut lancip segitiga atas = 35°, maka sudut lancip segitiga bawah di posisi yang sama juga = 35°.',
            hots: true
        }
    ];

    // Acak urutan soal setiap kali halaman dibuka (soal dikocok seperti kartu)
    for (let i = evaluasiQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [evaluasiQuestions[i], evaluasiQuestions[j]] = [evaluasiQuestions[j], evaluasiQuestions[i]];
    }

    // Render soal ke dalam halaman secara otomatis
    const soalContainer = document.getElementById('soalContainer');
    if (soalContainer) {
        soalContainer.innerHTML = evaluasiQuestions.map((q, idx) => `
            <div class="question-card${q.hots ? ' hots-card' : ''}">
                <div class="question-header">
                    <span class="question-number">SOAL ${idx + 1}${q.hots ? ' 🔍 HOTS' : ''}</span>
                    <h4 class="question-title">${q.question.replace('🔍 [HOTS] ', '')}</h4>
                </div>
                <div class="options">
                    ${q.options.map((opt, oi) => `
                    <label class="option">
                        <input type="radio" name="answer_${idx}" value="${oi}"${oi === 0 ? ' required' : ''}>
                        <span>${opt}</span>
                    </label>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // =========================================================================
    // INTEGRASI GOOGLE SHEETS (REKAP NILAI SISWA KE SPREADSHEET SECARA OTOMATIS)
    // =========================================================================
    // Masukkan URL Web App Google Apps Script Anda di sini:
    const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6L0N8Ygr0vFeD5gQWRLrEPXLU1f3RtxO9tCLidc_S0V9gqJFq8box6ayiKSsdvqh2Jw/exec';

    const evaluasiForm = document.getElementById('evaluasiForm');
    const evaluasiResultCard = document.getElementById('evaluasiResultCard');
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreTitle = document.getElementById('scoreTitle');
    const scoreMessage = document.getElementById('scoreMessage');
    const reflectionResultBox = document.getElementById('reflectionResultBox');
    const reflectionResultText = document.getElementById('reflectionResultText');
    const reviewItemsContainer = document.getElementById('reviewItemsContainer');
    const retryQuizBtn = document.getElementById('retryQuizBtn');
    const cloudSyncStatus = document.getElementById('cloudSyncStatus');
    const cloudSyncIcon = document.getElementById('cloudSyncIcon');
    const cloudSyncText = document.getElementById('cloudSyncText');

    // =========================================================================
    // MATIKAN MUSIK OTOMATIS SAAT SISWA MULAI MENGERJAKAN KUIS
    // (Musik bisa dinyalakan lagi kapan saja lewat tombol gamelan)
    // =========================================================================
    if (evaluasiForm) {
        // Pantau setiap kali siswa mulai mengetik nama / memilih kelas / menjawab soal
        evaluasiForm.addEventListener('focusin', () => {
            // Hanya matikan 1x saat pertama kali masuk form kuis
            if (!evaluasiForm.dataset.musicMuted) {
                evaluasiForm.dataset.musicMuted = 'true';
                // Matikan file audio jika sedang memutar
                if (bgMusicAudio && !bgMusicAudio.paused) {
                    bgMusicAudio.pause();
                }
                // Matikan synth gamelan jika aktif
                if (isGamelanPlaying) {
                    isGamelanPlaying = false;
                    stopGamelanSynth();
                    updatePlayerUI(false);
                }
            }
        }, { once: false });
    }

    if (evaluasiForm) {
        evaluasiForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentName = (document.getElementById('student_name')?.value || 'Siswa Kelas V').trim();
            const studentClass = (document.getElementById('student_class')?.value || 'V').trim();
            const uraianJawaban = (document.getElementById('jawaban_uraian')?.value || '').trim();
            const refleksi = (document.getElementById('jawaban_refleksi')?.value || '').trim();

            let correctCount = 0;
            const userAnswers = [];

            evaluasiQuestions.forEach((q, idx) => {
                const selected = document.querySelector(`input[name="answer_${idx}"]:checked`);
                const val = selected ? parseInt(selected.value, 10) : -1;
                userAnswers.push(val);
                if (val === q.correct) {
                    correctCount++;
                }
            });

            const score = Math.round((correctCount / evaluasiQuestions.length) * 100);

            // Update skor angka
            if (scoreNumber) scoreNumber.textContent = score;

            // Judul & pesan evaluasi berdasarkan nilai
            if (scoreTitle && scoreMessage) {
                if (score >= 80) {
                    scoreTitle.textContent = `🎉 Luar Biasa, ${studentName}!`;
                    scoreMessage.textContent = 'Selamat! Kamu telah menguasai materi sudut dan etnomatematika Kraton Yogyakarta dengan sangat baik. Pertahankan prestasimu!';
                } else if (score >= 60) {
                    scoreTitle.textContent = `👍 Bagus, ${studentName}!`;
                    scoreMessage.textContent = 'Kamu sudah memahami dasar-dasar materi sudut, namun masih ada beberapa soal yang perlu kamu cermati lagi.';
                } else if (score > 0) {
                    scoreTitle.textContent = `⚠️ Perlu Belajar Lagi, ${studentName}!`;
                    scoreMessage.textContent = 'Kamu masih keliru pada sebagian besar soal. Yuk amati kembali materi dan penjelasan sudut budaya Kraton di atas, lalu coba lagi!';
                } else {
                    scoreTitle.textContent = `❌ Belum Tuntas, ${studentName}!`;
                    scoreMessage.textContent = 'Kamu belum berhasil menjawab soal dengan benar (Skor 0). Jangan patah semangat, pelajari kembali materi bagian & jenis sudut di atas lalu coba ulangi evaluasi ini ya!';
                }
            }

            // Tampilkan refleksi jika diisi
            if (reflectionResultBox && reflectionResultText) {
                if (refleksi) {
                    reflectionResultText.textContent = `"${refleksi}"`;
                    reflectionResultBox.style.display = 'block';
                } else {
                    reflectionResultBox.style.display = 'none';
                }
            }

            // Render pembahasan soal
            if (reviewItemsContainer) {
                reviewItemsContainer.innerHTML = '';
                evaluasiQuestions.forEach((q, idx) => {
                    const userAns = userAnswers[idx];
                    const isCorrect = (userAns === q.correct);

                    const item = document.createElement('div');
                    item.className = `review-item ${isCorrect ? '' : 'wrong'}`;

                    const userAnswerText = userAns >= 0 ? q.options[userAns] : 'Tidak dijawab';
                    const statusColor = isCorrect ? '#2e7d32' : '#c62828';
                    const statusLabel = isCorrect ? '✔ Jawabanmu Benar' : `✖ Jawabanmu: ${userAnswerText}`;

                    item.innerHTML = `
                        <strong>Soal ${idx + 1}:</strong> ${q.question}<br>
                        <span style="font-size: 0.9rem; color: ${statusColor}; font-weight: 600;">
                            ${statusLabel}
                        </span><br>
                        <span style="font-size: 0.9rem; color: var(--text-muted);">
                            💡 <strong>Kunci Jawaban:</strong> ${q.options[q.correct]} — ${q.explanation}
                        </span>
                    `;
                    reviewItemsContainer.appendChild(item);
                });
            }

            // Simpan riwayat di browser (localStorage)
            try {
                localStorage.setItem('etno_evaluasi_terakhir', JSON.stringify({
                    nama: studentName,
                    kelas: studentClass,
                    skor: score,
                    tanggal: new Date().toLocaleString('id-ID')
                }));
            } catch (err) {
                // Abaikan jika localStorage dibatasi browser
            }

            // Kirim rekap nilai ke Google Sheets (jika URL sudah dipasang)
            if (GOOGLE_SHEETS_SCRIPT_URL && GOOGLE_SHEETS_SCRIPT_URL.trim() !== '') {
                if (cloudSyncStatus) {
                    cloudSyncStatus.style.display = 'inline-flex';
                    cloudSyncStatus.className = 'cloud-sync-status loading';
                    if (cloudSyncIcon) cloudSyncIcon.textContent = '⏳';
                    if (cloudSyncText) cloudSyncText.textContent = 'Menyimpan nilai ke Google Sheets Guru...';
                }

                const gabunganRefleksi = [
                    uraianJawaban ? `[Uraian: ${uraianJawaban}]` : '',
                    refleksi ? `[Refleksi: ${refleksi}]` : ''
                ].filter(Boolean).join(' ') || '-';

                const payload = {
                    nama: studentName,
                    kelas: studentClass,
                    skor: score,
                    benar: correctCount,
                    total: evaluasiQuestions.length,
                    total_soal: evaluasiQuestions.length,
                    jawaban_uraian: uraianJawaban,
                    refleksi: gabunganRefleksi,
                    timestamp: new Date().toLocaleString('id-ID'),
                    tanggal: new Date().toLocaleString('id-ID')
                };

                fetch(GOOGLE_SHEETS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).then(() => {
                    if (cloudSyncStatus) {
                        cloudSyncStatus.className = 'cloud-sync-status success';
                        if (cloudSyncIcon) cloudSyncIcon.textContent = '✅';
                        if (cloudSyncText) cloudSyncText.textContent = 'Nilai berhasil tersimpan di Google Sheets Guru!';
                    }
                }).catch(() => {
                    if (cloudSyncStatus) {
                        cloudSyncStatus.className = 'cloud-sync-status error';
                        if (cloudSyncIcon) cloudSyncIcon.textContent = '⚠️';
                        if (cloudSyncText) cloudSyncText.textContent = 'Gagal sync ke cloud (tetap tersimpan di perangkat siswa)';
                    }
                });
            }

            // Tampilkan kartu hasil dan scroll ke sana
            if (evaluasiResultCard) {
                evaluasiResultCard.style.display = 'block';
                evaluasiResultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (retryQuizBtn) {
        retryQuizBtn.addEventListener('click', () => {
            if (evaluasiForm) evaluasiForm.reset();
            if (evaluasiResultCard) evaluasiResultCard.style.display = 'none';
            if (cloudSyncStatus) cloudSyncStatus.style.display = 'none';
            if (evaluasiForm) {
                evaluasiForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // =========================================================================
    // 6. MUSIK GAMELAN TRADISIONAL KRATON (AUDIO FILE + WEB AUDIO SYNTHESIZER)
    // =========================================================================
    const gamelanPlayer = document.getElementById('gamelanPlayer');
    const gamelanPlayBtn = document.getElementById('gamelanPlayBtn');
    const gamelanPlayState = document.getElementById('gamelanPlayState');
    const bgMusicAudio = document.getElementById('bgMusicAudio');

    let isGamelanPlaying = false;
    let gamelanInterval = null;
    let gamelanCtx = null;
    let usingSynth = false;

    // Frekuensi Nada Gamelan Jawa Laras Slendro (Hz)
    // 1 (Ji): 261.6Hz, 2 (Ro): 293.7Hz, 3 (Lu): 329.6Hz, 5 (Ma): 392Hz, 6 (Nem): 440Hz
    const slendroNotes = {
        1: 261.63,
        2: 293.66,
        3: 329.63,
        5: 392.00,
        6: 440.00,
        '1_high': 523.25,
        '2_high': 587.33,
        '3_high': 659.25,
        'gong': 65.41 // C2 Sub-bass Gong Ageng
    };

    // Pola Melodi Gending Lancaran Kraton (16 Ketukan)
    const gendingPattern = [
        { note: 1, kenong: true, kempul: false, gong: false },
        { note: 2, kenong: false, kempul: false, gong: false },
        { note: 3, kenong: false, kempul: false, gong: false },
        { note: 5, kenong: false, kempul: true, gong: false },
        { note: 6, kenong: false, kempul: false, gong: false },
        { note: 3, kenong: false, kempul: false, gong: false },
        { note: 2, kenong: false, kempul: false, gong: false },
        { note: 1, kenong: true, kempul: false, gong: false },
        { note: 2, kenong: false, kempul: false, gong: false },
        { note: 3, kenong: false, kempul: false, gong: false },
        { note: 5, kenong: false, kempul: true, gong: false },
        { note: 6, kenong: false, kempul: false, gong: false },
        { note: 5, kenong: false, kempul: false, gong: false },
        { note: 3, kenong: false, kempul: false, gong: false },
        { note: 2, kenong: false, kempul: false, gong: false },
        { note: 1, kenong: true, kempul: false, gong: true } // Dentuman Gong Ageng penutup siklus
    ];

    let currentBeat = 0;

    function initGamelanCtx() {
        if (!gamelanCtx && (window.AudioContext || window.webkitAudioContext)) {
            gamelanCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (gamelanCtx && gamelanCtx.state === 'suspended') {
            gamelanCtx.resume();
        }
    }

    // Membunyikan bilah perunggu gamelan (metallophone bronze strike)
    function strikeGamelan(freq, duration = 1.8, volume = 0.12) {
        if (!gamelanCtx) return;
        const now = gamelanCtx.currentTime;

        // Nada dasar perunggu
        const osc = gamelanCtx.createOscillator();
        const gain = gamelanCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Harmonik logam (ring modulasi lembut)
        const overtone = gamelanCtx.createOscillator();
        const overtoneGain = gamelanCtx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2.76, now); // Frekuensi resonansi logam

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        overtoneGain.gain.setValueAtTime(volume * 0.4, now);
        overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + (duration * 0.6));

        osc.connect(gain);
        gain.connect(gamelanCtx.destination);

        overtone.connect(overtoneGain);
        overtoneGain.connect(gamelanCtx.destination);

        osc.start(now);
        overtone.start(now);
        osc.stop(now + duration);
        overtone.stop(now + duration);
    }

    // Dentuman Gong Ageng Kraton yang megah dan bergetar lama
    function strikeGong() {
        if (!gamelanCtx) return;
        const now = gamelanCtx.currentTime;
        const osc = gamelanCtx.createOscillator();
        const gain = gamelanCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(65.41, now);
        osc.frequency.exponentialRampToValueAtTime(58.0, now + 3.5); // Penurunan resonansi gong

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

        osc.connect(gain);
        gain.connect(gamelanCtx.destination);

        osc.start(now);
        osc.stop(now + 4.5);
    }

    function playNextBeat() {
        if (!isGamelanPlaying) return;
        const step = gendingPattern[currentBeat];

        // Saron / Bonang melody
        const freq = slendroNotes[step.note] || 329.63;
        strikeGamelan(freq, 1.4, 0.12);

        // Kenong
        if (step.kenong) {
            strikeGamelan(freq * 0.5, 2.5, 0.16);
        }

        // Kempul
        if (step.kempul) {
            strikeGamelan(slendroNotes[5] * 0.75, 2.0, 0.14);
        }

        // Gong Ageng penutup siklus gending
        if (step.gong) {
            strikeGong();
        }

        currentBeat = (currentBeat + 1) % gendingPattern.length;
    }

    function startGamelanSynth() {
        initGamelanCtx();
        usingSynth = true;
        currentBeat = 0;
        playNextBeat();
        gamelanInterval = setInterval(playNextBeat, 650); // Tempo tenang 92 BPM
    }

    function stopGamelanSynth() {
        if (gamelanInterval) {
            clearInterval(gamelanInterval);
            gamelanInterval = null;
        }
        usingSynth = false;
    }

    function toggleGamelanMusic() {
        if (!isGamelanPlaying) {
            // Coba putar file audio jika tersedia
            if (bgMusicAudio) {
                bgMusicAudio.volume = 0.5;
                const playPromise = bgMusicAudio.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // File audio berhasil diputar
                        isGamelanPlaying = true;
                        updatePlayerUI(true);
                    }).catch(() => {
                        // Jika file belum diisi atau autoplay dicegah, gunakan synth bawaan otomatis!
                        isGamelanPlaying = true;
                        startGamelanSynth();
                        updatePlayerUI(true);
                    });
                } else {
                    isGamelanPlaying = true;
                    startGamelanSynth();
                    updatePlayerUI(true);
                }
            } else {
                isGamelanPlaying = true;
                startGamelanSynth();
                updatePlayerUI(true);
            }
        } else {
            // Berhenti memutar
            isGamelanPlaying = false;
            if (bgMusicAudio) bgMusicAudio.pause();
            stopGamelanSynth();
            updatePlayerUI(false);
        }
    }

    function updatePlayerUI(playing) {
        if (!gamelanPlayer || !gamelanPlayState) return;
        if (playing) {
            gamelanPlayer.classList.add('playing');
            gamelanPlayState.textContent = '⏸';
            gamelanPlayer.setAttribute('title', 'Alunan Gamelan Kraton sedang berputar (Klik untuk jeda)');
        } else {
            gamelanPlayer.classList.remove('playing');
            gamelanPlayState.textContent = '▶';
            gamelanPlayer.setAttribute('title', 'Klik untuk memutar alunan musik Gamelan Kraton');
        }
    }

    if (gamelanPlayBtn) {
        gamelanPlayBtn.addEventListener('click', toggleGamelanMusic);
    }
});


