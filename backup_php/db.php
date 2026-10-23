<?php
// db.php - Pengelola Koneksi Database (MySQL dengan Fallback Cerdas)

$host = '127.0.0.1';
$user = 'root';
$pass = '';
$dbname = 'mengenal_sudut';
$pdo = null;
$db_status = 'disconnected';
$db_driver = 'none';

// Pastikan direktori data ada jika memakai fallback
$dataDir = __DIR__ . '/data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0777, true);
}

try {
    // 1. Coba sambungkan ke server MySQL
    $pdoTest = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 2
    ]);

    // Buat database jika belum ada
    $pdoTest->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    
    // Hubungkan langsung ke database mengenal_sudut
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // Buat tabel jika belum ada
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `evaluasi_siswa` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `nama_siswa` VARCHAR(100) NOT NULL,
            `kelas` VARCHAR(20) DEFAULT 'V (Lima)',
            `skor` INT NOT NULL,
            `total_soal` INT NOT NULL,
            `jawaban_pilihan` TEXT,
            `jawaban_uraian` TEXT,
            `refleksi` TEXT,
            `tanggal` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `skor_detektif` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `nama_pemain` VARCHAR(100) NOT NULL,
            `skor` INT NOT NULL,
            `waktu_selesai` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $db_status = 'connected';
    $db_driver = 'mysql';

} catch (Exception $e) {
    // 2. Jika MySQL di Laragon belum dinyalakan, gunakan SQLite lokal agar website tetap 100% bekerja
    try {
        $sqliteFile = $dataDir . '/mengenal_sudut.sqlite';
        $pdo = new PDO("sqlite:" . $sqliteFile, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `evaluasi_siswa` (
                `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                `nama_siswa` TEXT NOT NULL,
                `kelas` TEXT DEFAULT 'V (Lima)',
                `skor` INTEGER NOT NULL,
                `total_soal` INTEGER NOT NULL,
                `jawaban_pilihan` TEXT,
                `jawaban_uraian` TEXT,
                `refleksi` TEXT,
                `tanggal` DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `skor_detektif` (
                `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                `nama_pemain` TEXT NOT NULL,
                `skor` INTEGER NOT NULL,
                `waktu_selesai` DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        $db_status = 'connected_sqlite';
        $db_driver = 'sqlite';
    } catch (Exception $e2) {
        $db_status = 'error';
        $db_driver = 'none';
    }
}

/**
 * Fungsi helper untuk menyimpan hasil evaluasi siswa
 */
function simpanEvaluasi($nama, $kelas, $skor, $total_soal, $pilihan, $uraian, $refleksi) {
    global $pdo, $db_driver;
    if (!$pdo) return false;

    try {
        $pilihanJson = is_array($pilihan) ? json_encode($pilihan, JSON_UNESCAPED_UNICODE) : $pilihan;
        $stmt = $pdo->prepare("
            INSERT INTO evaluasi_siswa (nama_siswa, kelas, skor, total_soal, jawaban_pilihan, jawaban_uraian, refleksi)
            VALUES (:nama, :kelas, :skor, :total, :pilihan, :uraian, :refleksi)
        ");
        $stmt->execute([
            ':nama' => $nama,
            ':kelas' => $kelas,
            ':skor' => $skor,
            ':total' => $total_soal,
            ':pilihan' => $pilihanJson,
            ':uraian' => $uraian,
            ':refleksi' => $refleksi
        ]);
        return true;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Fungsi helper untuk menyimpan skor mini game
 */
function simpanSkorDetektif($nama, $skor) {
    global $pdo;
    if (!$pdo) return false;

    try {
        $stmt = $pdo->prepare("INSERT INTO skor_detektif (nama_pemain, skor) VALUES (:nama, :skor)");
        $stmt->execute([':nama' => $nama, ':skor' => $skor]);
        return true;
    } catch (Exception $e) {
        return false;
    }
}
