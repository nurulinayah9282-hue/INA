import { BattleQuestion, BattleRoundNumber, GrowthMetricItem } from '../types';

export interface RoundMetadata {
  round: BattleRoundNumber;
  title: string;
  subtitle: string;
  pointsRule: string;
  maxPoints: number;
  icon: string;
  color: string;
  description: string;
}

export const BATTLE_ROUNDS_CONFIG: Record<BattleRoundNumber, RoundMetadata> = {
  1: {
    round: 1,
    title: 'Babak 1: Tebak Cepat Peta',
    subtitle: 'Adu Kecepatan dan Ketepatan Konsep Dasar Peta',
    pointsRule: '10 Poin per Jawaban Benar',
    maxPoints: 10,
    icon: '⚡',
    color: '#0284C7', // Sky Blue
    description: 'Semua kelompok menjawab secara bersamaan. Diskusikan cepat, tentukan pilihan kelompok, dan angkat kartu jawaban!',
  },
  2: {
    round: 2,
    title: 'Babak 2: Duel Arah Mata Angin',
    subtitle: 'Menentukan Navigasi & Orientasi 8 Arah Mata Angin',
    pointsRule: '15 Poin per Jawaban Benar',
    maxPoints: 15,
    icon: '🧭',
    color: '#D97706', // Amber
    description: 'Uji keahlian navigasi kelompokmu! Tentukan arah mata angin yang tepat dari satu titik penting ke titik tujuan.',
  },
  3: {
    round: 3,
    title: 'Babak 3: Detektif Simbol & Legenda',
    subtitle: 'Membaca Simbol, Warna, dan Keterangan Peta',
    pointsRule: '15 Poin Jawaban Benar + 5 Poin Bonus Alasan Tepat (Maks. 20 Poin)',
    maxPoints: 20,
    icon: '🔍',
    color: '#059669', // Emerald
    description: 'Jadilah detektif peta handal! Temukan arti simbol dan jelaskan mengapa simbol tersebut dipilih pembuat peta.',
  },
  4: {
    round: 4,
    title: 'Babak 4: Puzzle Rute & Skala',
    subtitle: 'Menemukan Jalur Aman, Terpendek, dan Perhitungan Jarak',
    pointsRule: 'Maksimal 20 Poin per Solusi Rute Tepat',
    maxPoints: 20,
    icon: '🗺️',
    color: '#7C3AED', // Purple
    description: 'Pecahkan teka-teki rute desa! Perhatikan rintangan sungai deras, jembatan kayu, jalan rusak, dan perkiraan jarak skala.',
  },
  5: {
    round: 5,
    title: 'Babak 5: Growth Mindset Challenge',
    subtitle: 'Tantangan Penalaran Tingkat Tinggi & Semangat Pantang Menyerah',
    pointsRule: '15 Poin Jawaban Benar + 5 Poin Bonus Perbaikan dengan Petunjuk (Maks. 20 Poin)',
    maxPoints: 20,
    icon: '🌱',
    color: '#EA580C', // Orange
    description: 'Soal penantang logika peta tingkat tinggi! Jika jawaban kelompokmu belum tepat, jangan berkecil hati. Buka Petunjuk Tumbuh dan perbaiki bersama!',
  },
};

/**
 * 5 Indikator Observasi Sikap Belajar & Karakter Growth Mindset
 */
export const GROWTH_OBSERVATION_METRICS: GrowthMetricItem[] = [
  {
    id: 'perseverance',
    label: 'Ketekunan Menghadapi Soal Sulit',
    description: 'Kelompok tetap tenang, tidak gampang menyerah saat soal terlihat panjang atau menantang.',
    icon: '🛡️',
  },
  {
    id: 'learn_from_mistake',
    label: 'Kesediaan Belajar dari Kekeliruan',
    description: 'Saat jawaban salah, kelompok tidak saling menyalahkan melainkan antusias mencari tahu di mana letak kesalahannya.',
    icon: '💡',
  },
  {
    id: 'hint_utilization',
    label: 'Penggunaan Petunjuk secara Bijak',
    description: 'Kelompok membaca petunjuk dengan teliti dan menghubungkannya kembali dengan data pada peta.',
  icon: '🔍',
  },
  {
    id: 'strategy_shift',
    label: 'Fleksibilitas Strategi Diskusi',
    description: 'Berani mengubah jawaban awal setelah mendengarkan argumen teman atau bukti baru di peta.',
    icon: '🔄',
  },
  {
    id: 'collaboration',
    label: 'Kerja Sama & Saling Menghargai',
    description: 'Semua anggota kelompok diajak berpendapat, saling menyemangati, dan tidak didominasi satu siswa saja.',
    icon: '🤝',
  },
];

/**
 * BANK SOAL RESMI KOMPETISI KELOMPOK
 * Terdiri dari 16 soal komprehensif yang terbagi ke dalam 5 babak permainan.
 * Semua soal ini BARU dan TIDAK MENGAMBIL dari 25 soal Peta Petualangan!
 */
export const BATTLE_QUESTIONS: BattleQuestion[] = [
  // ==========================================
  // BABAK 1: TEBAK CEPAT PETA (10 Poin)
  // ==========================================
  {
    id: 'b1_q1',
    round: 1,
    roundName: 'Babak 1: Tebak Cepat Peta',
    numberInRound: 1,
    title: 'Komponen Penjelas Utama Peta',
    question: 'Di sudut peta Desa Suka Maju terdapat kotak bertuliskan keterangan gambar: segitiga hitam berarti gunung, garis biru berarti sungai, dan lingkaran merah berarti kantor pos. Komponen peta yang memuat keterangan semua simbol tersebut dinamakan...',
    options: [
      { label: 'A', text: 'Judul Peta' },
      { label: 'B', text: 'Legenda' },
      { label: 'C', text: 'Garis Astronomis' },
      { label: 'D', text: 'Tahun Pembuatan' },
    ],
    correctAnswer: 'B',
    points: 10,
    explanation: 'Legenda adalah kolom atau kotak keterangan pada peta yang menjelaskan arti simbol-simbol yang digunakan agar pembaca memahami isi peta dengan benar.',
    growthHint: 'Coba ingat kotak penting di tepi peta yang berisi daftar simbol beserta arti keterangannya.',
    visualType: 'symbol_legend',
    visualMeta: {
      highlightSymbol: 'legenda_box',
    },
  },
  {
    id: 'b1_q2',
    round: 1,
    roundName: 'Babak 1: Tebak Cepat Peta',
    numberInRound: 2,
    title: 'Fungsi Utama Garis Astronomis',
    question: 'Pak Guru menunjuk garis mendatar (Lintang) dan garis tegak (Bujur) yang saling berpotongan membentuk jaring-jaring kotak pada peta Indonesia. Fungsi utama dari garis astronomis tersebut adalah...',
    options: [
      { label: 'A', text: 'Menghias tepi peta agar tampak rapi dan indah' },
      { label: 'B', text: 'Menentukan lokasi mutlak (koordinat pasti) suatu wilayah di bumi' },
      { label: 'C', text: 'Menunjukkan batas kepemilikan sawah milik warga desa' },
      { label: 'D', text: 'Menghitung jumlah penduduk yang tinggal di kota' },
    ],
    correctAnswer: 'B',
    points: 10,
    explanation: 'Garis astronomis (garis lintang dan garis bujur) digunakan untuk menentukan letak koordinat mutlak suatu tempat di permukaan bumi secara akurat serta menentukan pembagian zona waktu dan iklim.',
    growthHint: 'Garis lintang dan bujur memiliki angka derajat (°), fungsinya mirip seperti alamat koordinat GPS di bumi.',
    visualType: 'scale_ruler',
    visualMeta: {
      scaleRatio: 'Garis Lintang & Bujur',
    },
  },
  {
    id: 'b1_q3',
    round: 1,
    roundName: 'Babak 1: Tebak Cepat Peta',
    numberInRound: 3,
    title: 'Warna Wilayah pada Peta Rupa Bumi',
    question: 'Pada peta provinsi, daerah pesisir pantai dan dataran rendah yang subur untuk persawahan secara standar kartografi diwarnai dengan warna...',
    options: [
      { label: 'A', text: 'Cokelat Tua' },
      { label: 'B', text: 'Kuning Jingga' },
      { label: 'C', text: 'Hijau' },
      { label: 'D', text: 'Biru Tua' },
    ],
    correctAnswer: 'C',
    points: 10,
    explanation: 'Warna hijau pada peta rupa bumi melambangkan dataran rendah (ketinggian 0–200 meter di atas permukaan laut). Kuning/oranye untuk dataran tinggi, cokelat untuk pegunungan, dan biru untuk perairan.',
    growthHint: 'Pikirkan tanaman padi di sawah dataran rendah yang menghampar hijau dan subur.',
    visualType: 'symbol_legend',
  },

  // ==========================================
  // BABAK 2: DUEL ARAH MATA ANGIN (15 Poin)
  // ==========================================
  {
    id: 'b2_q1',
    round: 2,
    roundName: 'Babak 2: Duel Arah Mata Angin',
    numberInRound: 1,
    title: 'Arah Antara Dua Titik Utama',
    question: 'Ahmad sedang berada di Pos Kompas. Jarum kompas menunjuk ke arah Utara. Jika Ahmad berputar ke arah kanan sebesar 45 derajat (berada di antara arah Utara dan arah Timur), maka Ahmad kini sedang menghadap ke arah...',
    options: [
      { label: 'A', text: 'Timur Laut' },
      { label: 'B', text: 'Barat Laut' },
      { label: 'C', text: 'Tenggara' },
      { label: 'D', text: 'Barat Daya' },
    ],
    correctAnswer: 'A',
    points: 15,
    explanation: 'Arah di antara Utara (0°) dan Timur (90°) adalah Timur Laut (45°). Urutan mata angin searah jarum jam: Utara -> Timur Laut -> Timur -> Tenggara -> Selatan -> Barat Daya -> Barat -> Barat Laut.',
    growthHint: 'Ingat lagu 8 arah mata angin: "Timur, tenggara, selatan, barat daya... barat, barat laut, utara, TIMUR LAUT!"',
    visualType: 'compass',
    visualMeta: {
      bearingAngle: 45,
      fromLocation: 'Utara (0°)',
      toLocation: 'Timur Laut (45°)',
    },
  },
  {
    id: 'b2_q2',
    round: 2,
    roundName: 'Babak 2: Duel Arah Mata Angin',
    numberInRound: 2,
    title: 'Orientasi Posisi Tempat di Desa',
    question: 'Perhatikan peta desa: Gedung SDN Nusantara terletak tepat di tengah desa. Di sebelah Utara sekolah terdapat Lapangan Sepak Bola. Di sebelah Selatan terdapat Puskesmas. Jika regu penjelajah berjalan dari SDN Nusantara menuju Danau Biru yang berada di sebelah pojok kiri bawah peta (antara Barat dan Selatan), arah manakah yang mereka tuju?',
    options: [
      { label: 'A', text: 'Barat Laut' },
      { label: 'B', text: 'Tenggara' },
      { label: 'C', text: 'Barat Daya' },
      { label: 'D', text: 'Timur Laut' },
    ],
    correctAnswer: 'C',
    points: 15,
    explanation: 'Arah antara Barat dan Selatan dinamakan Barat Daya. Pada peta standar, arah bawah adalah Selatan dan arah kiri adalah Barat, sehingga pojok kiri bawah merupakan arah Barat Daya.',
    growthHint: 'Kiri = Barat, Bawah = Selatan. Gabungan Barat dan Selatan adalah...?',
    visualType: 'village_map',
    visualMeta: {
      fromLocation: 'SDN Nusantara (Tengah)',
      toLocation: 'Danau Biru (Pojok Kiri Bawah)',
      bearingAngle: 225,
    },
  },
  {
    id: 'b2_q3',
    round: 2,
    roundName: 'Babak 2: Duel Arah Mata Angin',
    numberInRound: 3,
    title: 'Tantangan Bayangan Matahari Pagi',
    question: 'Pukul 07.30 pagi, Siti sedang berolahraga di halaman sekolah. Ia melihat bayangan tubuhnya jatuh condong ke arah Barat. Berdasarkan posisi matahari terbit, jika Siti ingin berjalan menghadap ke arah Selatan, maka tangan kanannya akan menunjuk ke arah...',
    options: [
      { label: 'A', text: 'Timur (arah matahari terbit)' },
      { label: 'B', text: 'Barat (arah bayangan jatuh)' },
      { label: 'C', text: 'Utara' },
      { label: 'D', text: 'Selatan' },
    ],
    correctAnswer: 'B',
    points: 15,
    explanation: 'Jika kita berdiri menghadap ke Selatan, maka: Depan = Selatan, Belakang = Utara, Tangan Kiri = Timur, dan Tangan Kanan = Barat!',
    growthHint: 'Bayangkan diri kalian menghadap ke Selatan (menghadap ke arah bawah peta). Rentangkan kedua tanganmu!',
    visualType: 'compass',
    visualMeta: {
      bearingAngle: 180,
      fromLocation: 'Menghadap Selatan',
      toLocation: 'Tangan Kanan = Barat',
    },
  },

  // ==========================================
  // BABAK 3: DETEKTIF SIMBOL & LEGENDA (Maks. 20 Poin)
  // ==========================================
  {
    id: 'b3_q1',
    round: 3,
    roundName: 'Babak 3: Detektif Simbol & Legenda',
    numberInRound: 1,
    title: 'Membedakan Jenis Simbol Titik, Garis, dan Area',
    question: 'Kelompok detektif mengamati tiga hal di peta: (1) Bangunan Masjid Desa, (2) Aliran Sungai Musi, dan (3) Hutan Lindung Bakau. Berdasarkan bentuk kartografinya, kelompok simbol yang paling tepat secara berturut-turut adalah...',
    options: [
      { label: 'A', text: 'Simbol Garis, Simbol Titik, Simbol Area' },
      { label: 'B', text: 'Simbol Titik, Simbol Garis, Simbol Area' },
      { label: 'C', text: 'Simbol Area, Simbol Garis, Simbol Titik' },
      { label: 'D', text: 'Semuanya adalah Simbol Garis' },
    ],
    correctAnswer: 'B',
    points: 15,
    explanation: 'Bangunan masjid digambarkan dengan Simbol Titik (point), aliran sungai memanjang digambarkan dengan Simbol Garis (line), dan kawasan hutan yang luas digambarkan dengan Simbol Area (polygon/wilayah).',
    growthHint: 'Perhatikan wujud fisiknya: bangunan = satu titik lokasi, sungai = alur memanjang, hutan = kawasan luas berbidang.',
    visualType: 'symbol_legend',
    visualMeta: {
      highlightSymbol: 'jenis_simbol',
    },
  },
  {
    id: 'b3_q2',
    round: 3,
    roundName: 'Babak 3: Detektif Simbol & Legenda',
    numberInRound: 2,
    title: 'Misteri Simbol Segitiga Merah dan Hitam',
    question: 'Di peta Pulau Jawa dan Bali, terdapat simbol segitiga berwarna MERAH dan segitiga berwarna HITAM di dekat pegunungan. Apakah arti dari simbol segitiga merah tersebut, dan mengapa diwarnai merah?',
    options: [
      { label: 'A', text: 'Tenda tempat perkemahan pramuka di lereng gunung' },
      { label: 'B', text: 'Gunung berapi yang masih aktif/berbahaya, warna merah melambangkan kewaspadaan & magma api' },
      { label: 'C', text: 'Puncak gunung tertinggi yang tertutup salju abadi' },
      { label: 'D', text: 'Bukit berbatu kapur yang tidak memiliki sumber air' },
    ],
    correctAnswer: 'B',
    points: 15,
    explanation: 'Segitiga merah melambangkan gunung berapi aktif (dapat meletus/waspada), sedangkan segitiga hitam melambangkan gunung mati atau tidak aktif.',
    growthHint: 'Warna merah dalam rambu dan peta sering digunakan untuk tanda bahaya, energi api, atau kewaspadaan.',
    visualType: 'symbol_legend',
    visualMeta: {
      highlightSymbol: 'segitiga_gunung',
    },
  },
  {
    id: 'b3_q3',
    round: 3,
    roundName: 'Babak 3: Detektif Simbol & Legenda',
    numberInRound: 3,
    title: 'Simbol Fasilitas Umum Ceria',
    question: 'Di persimpangan jalan Desa Permai terdapat simbol lingkaran biru bergambar huruf "H" putih berukuran tebal, serta simbol tanda palang merah (+). Fasilitas umum apakah yang ditunjukkan oleh simbol tersebut?',
    options: [
      { label: 'A', text: 'Hotel Bintang Lima dan Museum Seni' },
      { label: 'B', text: 'Rumah Sakit / Fasilitas Layanan Medis Darurat' },
      { label: 'C', text: 'Hutan Lindung dan Tempat Berkemah' },
      { label: 'D', text: 'Halte Bus Kota' },
    ],
    correctAnswer: 'B',
    points: 15,
    explanation: 'Huruf "H" pada latar biru menandakan Hospital (Rumah Sakit) dan palang merah menandakan fasilitas kesehatan/medis darurat.',
    growthHint: '"H" singkatan dari Hospital dalam standar rambu internasional, dan tanda palang merah identik dengan tenaga medis.',
    visualType: 'symbol_legend',
    visualMeta: {
      highlightSymbol: 'hospital_medical',
    },
  },

  // ==========================================
  // BABAK 4: PUZZLE RUTE & SKALA (Maks. 20 Poin)
  // ==========================================
  {
    id: 'b4_q1',
    round: 4,
    roundName: 'Babak 4: Puzzle Rute & Skala',
    numberInRound: 1,
    title: 'Rute Evakuasi Bebas Jembatan Rusak',
    question: 'Regu penjelajah ingin mengantar bekal obat dari Balai Desa ke Posko Bukit Pinus. Terdapat 2 rute di peta:\n• Rute Merah: Melewati Jembatan Kayu Tua (tertulis tanda silang merah = sedang diperbaiki) dengan jarak 2 cm di peta.\n• Rute Hijau: Memutar lewat Jalan Raya Desa yang beraspal aman dan melewati Jembatan Beton dengan jarak 4 cm di peta.\nJika skala peta adalah 1 : 10.000 (1 cm di peta = 100 meter sebenarnya), rute manakah yang harus dipilih dan berapa jarak sebenarnya rute aman tersebut?',
    options: [
      { label: 'A', text: 'Rute Merah karena lebih dekat yaitu 200 meter' },
      { label: 'B', text: 'Rute Hijau karena aman dari jembatan rusak, dengan jarak 400 meter' },
      { label: 'C', text: 'Rute Merah dengan jarak 2.000 meter' },
      { label: 'D', text: 'Rute Hijau dengan jarak 4.000 meter' },
    ],
    correctAnswer: 'B',
    points: 20,
    explanation: 'Keselamatan adalah prioritas utama navigator! Rute Merah berbahaya karena jembatan sedang diperbaiki. Rute Hijau adalah rute yang tepat dan aman. Jarak sebenarnya = 4 cm × 100 m = 400 meter.',
    growthHint: 'Perhatikan kondisi jalan pada peta: jalur yang lebih pendek belum tentu aman jika ada tanda rintangan berbahaya!',
    visualType: 'route_puzzle',
    visualMeta: {
      fromLocation: 'Balai Desa',
      toLocation: 'Posko Bukit Pinus',
      routeSteps: ['Jalan Raya Beraspal (Aman)', 'Jembatan Beton Kokoh', 'Tiba di Bukit Pinus (400 m)'],
      scaleRatio: '1 : 10.000 (1 cm = 100 m)',
    },
  },
  {
    id: 'b4_q2',
    round: 4,
    roundName: 'Babak 4: Puzzle Rute & Skala',
    numberInRound: 2,
    title: 'Membaca Skala Grafis (Batang)',
    question: 'Pada sudut bawah peta terpajang skala batang: setiap ruas 1 cm diberi angka bertingkat: [ 0 ] --- [ 500 m ] --- [ 1.000 m ] --- [ 1.500 m ]. Jika kelompokmu mengukur jarak antara Danau Teratai dengan Air Terjun di peta sepanjang 3 cm, berapakah jarak sebenarnya di lapangan?',
    options: [
      { label: 'A', text: '500 meter' },
      { label: 'B', text: '1.000 meter' },
      { label: 'C', text: '1.500 meter (1,5 km)' },
      { label: 'D', text: '3.000 meter (3 km)' },
    ],
    correctAnswer: 'C',
    points: 20,
    explanation: 'Setiap 1 cm pada skala batang mewakili 500 meter di lapangan sebenarnya. Jika jarak pada peta adalah 3 cm, maka jarak sesungguhnya adalah 3 × 500 meter = 1.500 meter (atau 1,5 kilometer).',
    growthHint: 'Lihat ruas pada batang skala: 1 ruas = 500 m, 2 ruas = 1.000 m, maka 3 ruas adalah...?',
    visualType: 'scale_ruler',
    visualMeta: {
      scaleRatio: '1 cm = 500 meter',
    },
  },
  {
    id: 'b4_q3',
    round: 4,
    roundName: 'Babak 4: Puzzle Rute & Skala',
    numberInRound: 3,
    title: 'Rute Tercepat Menghindari Kemacetan Pasar',
    question: 'Ambulans desa di Pos Timur ingin menuju Puskesmas di Sisi Barat. Jalan utama melewati Pasar Desa yang ditandai warna merah (padat merayap dan macet). Ada Jalan Lingkar Utara yang jalannya mulus dan bebas hambatan. Sebagai pengatur rute, saran terbaik kelompokmu adalah...',
    options: [
      { label: 'A', text: 'Tetap lewat pasar dan menunggu pasar sepi pada malam hari' },
      { label: 'B', text: 'Memilih Jalan Lingkar Utara agar ambulans cepat sampai menyelamatkan pasien' },
      { label: 'C', text: 'Berhenti di pos timur dan tidak berangkat' },
      { label: 'D', text: 'Memutar keluar wilayah kabupaten yang sangat jauh' },
    ],
    correctAnswer: 'B',
    points: 20,
    explanation: 'Dalam analisis peta transportasi darurat, rute dengan kelancaran arus lalu lintas bebas hambatan adalah pilihan terbaik meski sedikit lebih melengkung di peta.',
    growthHint: 'Peta rute membantu kita membuat keputusan cerdas berdasarkan kondisi nyata seperti kepadatan lalu lintas.',
    visualType: 'route_puzzle',
    visualMeta: {
      fromLocation: 'Pos Timur',
      toLocation: 'Puskesmas Barat',
      routeSteps: ['Belok ke Jalan Lingkar Utara', 'Bebas Macet Pasar', 'Tiba di Puskesmas'],
    },
  },

  // ==========================================
  // BABAK 5: GROWTH MINDSET CHALLENGE (15 Poin + 5 Poin Bonus)
  // ==========================================
  {
    id: 'b5_q1',
    round: 5,
    roundName: 'Babak 5: Growth Mindset Challenge',
    numberInRound: 1,
    title: 'Tantangan Inset Peta yang Mengecoh',
    question: 'Kelompok Arka menemukan peta besar Kabupaten Banyuwangi. Di pojok kiri bawah terdapat gambar peta kecil Pulau Jawa utuh dengan kotak merah kecil menandai letak Banyuwangi. Salah satu anggota mengira itu adalah peta pulau lain yang terpisah. Bagaimana kelompok kalian meluruskan kekeliruan tersebut dengan konsep Inset Peta?',
    options: [
      { label: 'A', text: 'Itu adalah hiasan gambar bebas agar sudut peta tidak kosong melompong' },
      { label: 'B', text: 'Itu adalah Inset Peta, fungsinya menunjukkan kedudukan daerah yang dipetakan terhadap wilayah yang lebih luas' },
      { label: 'C', text: 'Itu adalah kesalahan pencetak yang tidak sengaja menempelkan pulau lain' },
      { label: 'D', text: 'Itu adalah legenda cadangan untuk menggambarkan hutan lindung' },
    ],
    correctAnswer: 'B',
    points: 15,
    explanation: 'Hebat! Inset peta adalah peta berukuran kecil di dalam peta utama yang berfungsi menunjukkan kedudukan wilayah yang dipetakan terhadap wilayah sekitarnya yang jauh lebih luas (misalnya Kabupaten Banyuwangi dalam kaitannya dengan seluruh Pulau Jawa).',
    growthHint: '🌱 Petunjuk Tumbuh: Perhatikan ukuran peta kecil tersebut. Mengapa wilayah yang kecil diperlihatkan posisinya di dalam pulau yang lebih besar? Pikirkan hubungan "bagian" dengan "keseluruhan"!',
    visualType: 'village_map',
    visualMeta: {
      highlightSymbol: 'inset_map',
      scaleRatio: 'Inset Posisi Regional',
    },
  },
  {
    id: 'b5_q2',
    round: 5,
    roundName: 'Babak 5: Growth Mindset Challenge',
    numberInRound: 2,
    title: 'Analisis Aliran Sungai & Kontur Desa',
    question: 'Di peta topografi Desa Lembah Hijau, sungai mengalir di antara dua bukit: Bukit Sakura (ketinggian 450 mdpl) dan Bukit Cemara (ketinggian 300 mdpl). Jika Danau Muara berada di ketinggian 50 mdpl di sebelah Selatan, ke arah manakah air sungai pasti mengalir berdasarkan hukum alam dan peta ketinggian?',
    options: [
      { label: 'A', text: 'Mengalir dari Danau Muara naik ke puncak Bukit Sakura' },
      { label: 'B', text: 'Mengalir dari daerah yang lebih tinggi (pegunungan/bukit) menuju daerah yang lebih rendah (Danau Muara di Selatan)' },
      { label: 'C', text: 'Air sungai diam tidak mengalir ke mana-mana' },
      { label: 'D', text: 'Mengalir berputar-putar di puncak Bukit Cemara' },
    ],
    correctAnswer: 'B',
    points: 15,
    explanation: 'Sempurna! Berdasarkan prinsip alam dan elevasi peta, air selalu mengalir dari tempat tinggi (pegunungan/bukit) menuju ke tempat yang lebih rendah (lembah, danau, atau laut).',
    growthHint: '🌱 Petunjuk Tumbuh: Coba ingat sifat air saat kita menuangkan air dari botol ke mangkok. Apakah air mengalir dari bawah ke atas atau dari atas ke bawah?',
    visualType: 'village_map',
    visualMeta: {
      fromLocation: 'Bukit Ketinggian 450 mdpl',
      toLocation: 'Danau Muara Ketinggian 50 mdpl (Selatan)',
      bearingAngle: 180,
    },
  },
  {
    id: 'b5_q3',
    round: 5,
    roundName: 'Babak 5: Growth Mindset Challenge',
    numberInRound: 3,
    title: 'Menyusun Kembali Rencana Setelah Tersesat',
    question: 'Sebuah regu penjelajah salah membaca arah karena kompas mereka terpengaruh logam besi di saku, sehingga mereka berjalan ke Timur padahal tujuannya ke Utara. Anggota regu mulai panik dan saling menyalahkan. Menurut prinsip Growth Mindset dalam berpetualang dengan peta, tindakan terbaik apa yang harus dilakukan kelompok tersebut?',
    options: [
      { label: 'A', text: 'Membuang peta dan kompas, lalu berhenti berjalan dan menangis' },
      { label: 'B', text: 'Saling menuduh siapa yang paling bersalah membawa logam di saku' },
      { label: 'C', text: 'Tetap tenang, mengakui kesalahan, menjauhkan logam dari kompas, mengecek posisi saat ini di peta, dan menentukan rute baru bersama-sama' },
      { label: 'D', text: 'Berlari secepat mungkin tanpa melihat peta lagi' },
    ],
    correctAnswer: 'C',
    points: 15,
    explanation: 'Luar biasa! Inilah esensi sejati Growth Mindset. Kesalahan bukanlah akhir, melainkan bekal belajar berharga. Tenang, evaluasi penyebabnya, perbaiki strategi, dan terus melangkah maju bersama tim!',
    growthHint: '🌱 Petunjuk Tumbuh: Saat menghadapi kekeliruan, apa yang membuat kita menjadi lebih pintar dan lebih kuat bersama teman-teman?',
    visualType: 'compass',
    visualMeta: {
      bearingAngle: 0,
      fromLocation: 'Evaluasi Kesalahan -> Tumbuh',
      toLocation: 'Rute Baru yang Sukses',
    },
  },
  {
    id: 'b5_q4',
    round: 5,
    roundName: 'Babak 5: Growth Mindset Challenge',
    numberInRound: 4,
    title: 'Misteri Perbedaan Peta Kertas vs Peta Digital',
    question: 'Siswa kelas IV membandingkan peta kertas di atlas sekolah dengan peta digital di Google Maps. Salah satu kelompok bingung mengapa saat peta digital dizoom in (diperbesar di layar HP), angka skala petanya otomatis berubah dari 1:1.000.000 menjadi 1:5.000. Penjelasan ilmiah yang paling tepat untuk fenomena ini adalah...',
    options: [
      { label: 'A', text: 'HP mereka mengalami kerusakan pada sensor layarnya' },
      { label: 'B', text: 'Peta digital memiliki skala dinamis: saat diperbesar, wilayah yang terlihat semakin sempit namun semakin detail, sehingga angka penyebut skala mengecil (menjadi skala besar)' },
      { label: 'C', text: 'Peta kertas lebih akurat daripada satelit luar angkasa' },
      { label: 'D', text: 'Angka skala pada peta digital hanyalah hiasan acak tanpa arti' },
    ],
    correctAnswer: 'B',
    points: 15,
    explanation: 'Tepat sekali! Peta digital memiliki skala dinamis (interaktif). Ketika dizoom in, objek terlihat sangat rinci (skala besar, penyebut kecil). Saat dizoom out, cakupan wilayah sangat luas (skala kecil, penyebut besar).',
    growthHint: '🌱 Petunjuk Tumbuh: Pikirkan apa yang terjadi saat kalian memperbesar foto di ponsel. Apakah kalian melihat gambar lebih dekat dan lebih rinci?',
    visualType: 'scale_ruler',
    visualMeta: {
      scaleRatio: 'Skala Dinamis Zoom In/Out',
    },
  },
];
