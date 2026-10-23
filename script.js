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
            detailContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
});
