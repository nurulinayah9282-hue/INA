import { MaterialLesson, MaterialInfographic } from '../types';

export interface GalleryInfographicItem {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  src: string;
  alt: string;
  description: string;
  badge: string;
  tags: string[];
  keyTopics: string[];
}

export const MAP_INFOGRAPHICS_GALLERY: GalleryInfographicItem[] = [
  {
    id: 'poster-1',
    number: 1,
    title: 'Mengenal Peta & Jenis-Jenis Peta',
    subtitle: 'Pengertian, Bentuk Peta, dan Isi Peta',
    src: '/assets/aistudio/Infografik_Ceria_Mengenal_Peta_1d186f6b.png',
    alt: 'Infografik Ceria Mengenal Peta dan Ragam Jenis Peta',
    badge: 'Poster 1',
    description:
      'Pengertian peta, pembagian jenis peta berdasarkan bentuknya (peta datar, peta timbul/relief, peta digital, peta garis, peta foto) dan berdasarkan isinya (peta umum dan peta tematik).',
    tags: ['Pengertian Peta', 'Peta Datar', 'Peta Digital', 'Peta Tematik'],
    keyTopics: [
      'Peta: gambaran wilayah pada bidang datar diperkecil dengan skala.',
      'Jenis bentuk: Datar (kertas/kain), Timbul/Relief, Digital (gawai), Garis, Foto (satelit).',
      'Jenis isi: Peta Umum (jalan, sungai, gunung) & Peta Tematik (jumlah penduduk, curah hujan).',
    ],
  },
  {
    id: 'poster-2',
    number: 2,
    title: 'Petualangan Peta Desa Maju Sejahtera',
    subtitle: 'Contoh Nyata Peta Wilayah & Komponen Penting',
    src: '/assets/aistudio/Petualangan_Belajar_Peta_Desa_82df259e.png',
    alt: 'Poster Petualangan Belajar Peta Desa Maju Sejahtera',
    badge: 'Poster 2',
    description:
      'Contoh peta lingkungan tempat tinggal lengkap dengan fasilitas sekolah, masjid, puskesmas, balai desa, sawah, sungai, penunjuk arah, legenda, dan skala (1 cm = 100 m).',
    tags: ['Peta Desa', 'Komponen Peta', 'Fasilitas Umum', 'Skala Desa'],
    keyTopics: [
      '6 Komponen Peta: Judul, Arah Mata Angin, Legenda, Skala, Simbol, Garis & Warna.',
      'Peta Desa Maju Sejahtera memuat ikon fasilitas ramah anak.',
      'Skala 1 cm = 100 m menunjukkan perbandingan jarak nyata.',
    ],
  },
  {
    id: 'poster-3',
    number: 3,
    title: 'Komponen-Komponen Peta (Bagian 1)',
    subtitle: 'Judul, Skala, Garis Astronomis, Petunjuk Arah, dan Inset',
    src: '/assets/aistudio/Infografik_Komponen-Komponen_Peta_07097929.png',
    alt: 'Infografik Komponen-Komponen Peta Bagian 1',
    badge: 'Poster 3',
    description:
      'Memahami lima komponen penting peta: Judul peta, Skala (angka, verbal, grafis/garis), Garis Astronomis (lintang & bujur), Orientasi/Petunjuk arah kompas, dan Inset peta Provinsi Bali pada peta Indonesia.',
    tags: ['Judul Peta', 'Skala Angka & Garis', 'Garis Astronomis', 'Inset Bali'],
    keyTopics: [
      'Judul Peta: menunjukkan wilayah yang digambarkan (contoh: Peta Indonesia).',
      'Skala: Angka (1:400.000), Verbal (1 cm mewakili 5 km), Garis/Grafis (batang penggaris).',
      'Garis Astronomis: Garis lintang (timur-barat) & Garis bujur (kutub utara-selatan).',
      'Inset: peta kecil yang disisipkan untuk memperjelas posisi wilayah.',
    ],
  },
  {
    id: 'poster-4',
    number: 4,
    title: 'Komponen-Komponen Peta (Bagian 2)',
    subtitle: 'Legenda, Simbol Peta, Lettering, dan Sumber Data',
    src: '/assets/aistudio/Infografis_Komponen-Komponen_Peta_Islami_Bali_937fd784.png',
    alt: 'Infografik Komponen-Komponen Peta Bagian 2 Legenda dan Simbol',
    badge: 'Poster 4',
    description:
      'Memahami kotak Legenda, ragam simbol peta (kota, jalan, sungai, gunung, bandara, pelabuhan), kaidah Lettering (huruf tegak untuk buatan manusia & huruf miring untuk perairan), serta penerbit resmi (BIG).',
    tags: ['Kotak Legenda', 'Kaidah Lettering', 'Simbol Peta', 'Badan Informasi Geospasial'],
    keyTopics: [
      'Legenda: keterangan yang berisi arti dari simbol-simbol pada peta.',
      'Lettering: Huruf tegak (objek buatan: jembatan, jalan) & Huruf miring (perairan: sungai, selat, danau).',
      'Sumber data & tahun: menunjukkan keabsahan dan pembaruan data peta.',
      'Penerbit resmi: Badan Informasi Geospasial (BIG).',
    ],
  },
  {
    id: 'poster-5',
    number: 5,
    title: 'Arah Mata Angin, Simbol, & Cara Baca Peta',
    subtitle: 'Pedoman Navigasi 8 Arah & 4 Langkah Membaca Peta',
    src: '/assets/aistudio/Poster_Edukasi_Arah__Simbol__dan_Peta_8685a039.png',
    alt: 'Poster Edukasi Arah Mata Angin Simbol dan Cara Membaca Peta',
    badge: 'Poster 5',
    description:
      'Delapan arah mata angin kompas, posisi matahari terbit di timur & terbenam di barat, tabel simbol penting, serta 4 tahapan sistematis membaca peta secara runtut.',
    tags: ['8 Arah Mata Angin', 'Matahari Terbit', 'Tabel Simbol', '4 Langkah Baca Peta'],
    keyTopics: [
      'Delapan Arah: Utara, Timur Laut, Timur, Tenggara, Selatan, Barat Daya, Barat, Barat Laut.',
      'Matahari: Terbit di Timur (kanan) dan terbenam di Barat (kiri).',
      '4 Langkah Baca Peta: (1) Tentukan arah, (2) Kenali simbol, (3) Cari lokasi tujuan, (4) Ambil kesimpulan.',
    ],
  },
  {
    id: 'poster-6',
    number: 6,
    title: 'Peta Digital, Letak Wilayah, & Zona Waktu',
    subtitle: 'Peta Digital vs Konvensional, Batas Jawa, dan WIB/WITA/WIT',
    src: '/assets/aistudio/Infografik_Peta_Digital_dan_Letak_Wilayah_fe37679b.png',
    alt: 'Infografik Peta Digital dan Letak Wilayah di Permukaan Bumi',
    badge: 'Poster 6',
    description:
      'Perbandingan peta konvensional (kertas) dengan peta digital (aplikasi/gawai), letak geografis batas Pulau Jawa, letak astronomis Indonesia (6° LU - 11° LS & 95° BT - 141° BT), serta pengaruhnya terhadap iklim dan 3 zona waktu (WIB, WITA, WIT).',
    tags: ['Peta Digital', 'Letak Geografis Jawa', 'Letak Astronomis RI', 'WIB WITA WIT'],
    keyTopics: [
      'Peta Konvensional (cetak kertas) vs Peta Digital (aplikasi/fitur zoom & rute).',
      'Letak Geografis Jawa: Utara (Laut Jawa), Timur (Selat Bali), Selatan (Samudra Hindia), Barat (Selat Sunda).',
      'Letak Astronomis RI: 6° LU - 11° LS dan 95° BT - 141° BT.',
      'Pengaruh: Beriklim tropis, curah hujan tinggi, dan terbagi menjadi 3 zona waktu (WIB, WITA, WIT).',
    ],
  },
];

export const MATERIAL_LESSONS: MaterialLesson[] = [
  {
    id: 1,
    title: 'Apa Itu Peta?',
    subheading: 'Pondasi Dasar Mengenal Gambaran Wilayah & Jenis-Jenis Peta',
    badge: 'Materi 1',
    summary:
      'Peta adalah gambaran permukaan bumi atau suatu wilayah pada bidang datar dengan ukuran yang diperkecil menggunakan skala.',
    infographic: {
      src: '/assets/aistudio/Infografik_Ceria_Mengenal_Peta_1d186f6b.png',
      alt: 'Infografik Ceria Mengenal Peta dan Ragam Jenis Peta',
      title: 'Infografik: Mengenal Peta & Ragam Jenis Peta',
      caption:
        'Poster ceria ini menjelaskan pengertian peta serta pembagian jenis peta berdasarkan bentuknya (datar, timbul, digital, garis, foto) dan berdasarkan isinya (peta umum dan tematik).',
      highlights: [
        'Peta Datar (kertas/kain)',
        'Peta Timbul/Relief (3 Dimensi)',
        'Peta Digital (ponsel/tablet)',
        'Peta Umum & Tematik',
      ],
    },
    sections: [
      {
        heading: 'Pengertian Peta',
        content:
          'Peta adalah gambaran permukaan bumi atau suatu wilayah pada bidang datar dengan ukuran yang diperkecil menggunakan skala. Peta membantu kita mengetahui lokasi, letak, jarak, dan hubungan posisi antara suatu tempat dengan tempat lain.',
        diagramType: 'definition',
      },
      {
        heading: 'Ragam Jenis Peta Berdasarkan Bentuk & Isinya',
        content:
          'Sesuai poster infografis di atas, peta dapat dibuat dalam berbagai bentuk dan isi sesuai kegunaannya:',
        keyPoints: [
          '1. Peta Datar: Dibuat pada permukaan datar seperti kertas, kain, atau kanvas.',
          '2. Peta Timbul (Relief): Permukaannya menonjol menunjukkan tinggi rendahnya bumi (pegunungan, lembah).',
          '3. Peta Digital: Disajikan elektronik pada komputer, tablet, atau ponsel dan bersifat interaktif.',
          '4. Peta Garis: Menggunakan garis-garis untuk batas wilayah, kenampakan jalan, dan sungai.',
          '5. Peta Foto: Dibuat dari foto udara atau citra satelit sehingga terlihat nyata.',
          '6. Peta Umum vs Tematik: Peta umum menggambarkan wilayah secara luas, sedangkan peta tematik fokus pada satu tema khusus (misal persebaran penduduk atau curah hujan).',
        ],
      },
    ],
    quickCheck: {
      question: 'Peta yang disajikan dalam bentuk elektronik pada ponsel atau tablet disebut...',
      options: [
        'Peta timbul',
        'Peta digital',
        'Peta foto udara',
      ],
      correctIndex: 1,
      explanation: 'Tepat sekali! Peta digital diakses lewat gawai/ponsel dan bisa diperbesar atau diperkecil.',
    },
  },
  {
    id: 2,
    title: 'Fungsi Peta & Peta Desa',
    subheading: 'Manfaat Nyata Peta bagi Kehidupan Sehari-hari',
    badge: 'Materi 2',
    summary:
      'Peta memiliki berbagai fungsi penting mulai dari menentukan posisi, merencanakan perjalanan, hingga mengenal fasilitas di tempat tinggal kita.',
    infographic: {
      src: '/assets/aistudio/Petualangan_Belajar_Peta_Desa_82df259e.png',
      alt: 'Poster Petualangan Belajar Peta Desa Maju Sejahtera',
      title: 'Poster Edukasi: Peta Desa Maju Sejahtera',
      caption:
        'Perhatikan contoh peta desa lengkap ini! Anak-anak dapat melihat bagaimana simbol sekolah, masjid, puskesmas, balai desa, sawah, dan sungai tersusun rapi dengan arah mata angin dan skala 1 cm = 100 m.',
      highlights: [
        'Peta Desa Maju Sejahtera',
        'Sekolah, Masjid, & Puskesmas',
        'Skala 1 cm = 100 meter',
        'Kompas Penunjuk Arah',
      ],
    },
    sections: [
      {
        heading: 'Empat Fungsi Pokok Peta',
        content: 'Dalam pembelajaran IPAS kelas IV, kita mengenal beberapa fungsi penting peta:',
        keyPoints: [
          '1. Mengetahui letak suatu tempat di permukaan bumi.',
          '2. Mengetahui arah dan posisi relatif suatu tempat terhadap tempat lainnya.',
          '3. Membantu merencanakan perjalanan agar rute yang dipilih lebih mudah dan aman.',
          '4. Memahami gambaran dan kondisi bentuk suatu wilayah secara menyeluruh.',
        ],
        diagramType: 'functions',
      },
      {
        heading: 'Contoh Nyata pada Peta Desa Maju Sejahtera',
        content:
          'Pada poster di atas, anak-anak dapat melihat posisi Sekolah di dekat persimpangan jalan, Puskesmas di sebelah barat daya, Balai Desa di sebelah selatan, dan Masjid di seberang jembatan sungai. Dengan peta, warga dan pendatang baru bisa langsung tahu rute tercepat!',
      },
    ],
    quickCheck: {
      question: 'Jika kamu ingin merencanakan rute jalan santai keliling desa, fungsi peta apa yang kamu gunakan?',
      options: [
        'Merencanakan rute perjalanan dan melihat posisi tempat yang ingin dikunjungi',
        'Menghitung jumlah kendaraan yang lewat',
        'Memeriksa ramalan cuaca bulan depan',
      ],
      correctIndex: 0,
      explanation: 'Hebat! Merencanakan rute adalah salah satu fungsi praktis peta dalam kehidupan nyata.',
    },
  },
  {
    id: 3,
    title: 'Komponen Peta (Bagian 1)',
    subheading: 'Judul, Skala, Garis Astronomis, Petunjuk Arah, & Inset',
    badge: 'Materi 3',
    summary:
      'Peta tersusun dari komponen penting agar dapat dibaca dengan akurat: Judul, Skala, Garis Astronomis, Petunjuk Arah, dan Inset.',
    infographic: {
      src: '/assets/aistudio/Infografik_Komponen-Komponen_Peta_07097929.png',
      alt: 'Infografik Komponen-Komponen Peta Bagian 1',
      title: 'Infografik: Komponen Peta (Bagian 1)',
      caption:
        'Poster ini mengupas 5 komponen peta: Judul peta, Skala (angka, verbal, grafis), Garis Astronomis (garis lintang & garis bujur), Arah mata angin, dan Inset peta Provinsi Bali pada kepulauan Indonesia.',
      highlights: [
        'Judul Peta',
        '3 Jenis Skala (Angka, Verbal, Grafis)',
        'Garis Lintang & Bujur',
        'Inset Peta Kecil',
      ],
    },
    sections: [
      {
        heading: 'Lima Komponen Utama Peta (Bagian 1)',
        content: 'Komponen peta membantu pembaca memahami informasi spasial secara tepat:',
        keyPoints: [
          'a. Judul Peta: Menunjukkan isi atau daerah yang digambarkan (contoh: "PETA INDONESIA").',
          'b. Skala Peta: Perbandingan jarak pada peta dengan jarak sebenarnya. Ada 3 jenis: Skala Angka (1:400.000), Skala Verbal (1 cm mewakili 5 km), dan Skala Garis/Grafis (batang berskala).',
          'c. Garis Astronomis: Garis khayal pembantu lokasi. Garis lintang membentang timur-barat, garis bujur membentang kutub utara-selatan.',
          'd. Orientasi/Petunjuk Arah: Menunjukkan arah Utara (atas), Selatan (bawah), Timur (kanan), dan Barat (kiri).',
          'e. Inset: Peta kecil yang disisipkan untuk memberikan kejelasan posisi suatu wilayah di daerah sekitarnya yang lebih luas.',
        ],
        diagramType: 'elements',
      },
    ],
    quickCheck: {
      question: 'Peta kecil yang disisipkan pada peta utama untuk memperjelas letak suatu wilayah disebut...',
      options: [
        'Skala verbal',
        'Inset peta',
        'Legenda',
      ],
      correctIndex: 1,
      explanation: 'Tepat sekali! Inset adalah peta kecil sisipan yang memperjelas posisi wilayah terhadap daerah yang lebih luas.',
    },
  },
  {
    id: 4,
    title: 'Komponen Peta (Bagian 2): Legenda & Simbol',
    subheading: 'Legenda, Simbol Peta, Kaidah Lettering, & Penerbit BIG',
    badge: 'Materi 4',
    summary:
      'Legenda adalah kamus penjelas simbol, lettering adalah aturan penulisan huruf, serta sumber data resmi diterbitkan oleh Badan Informasi Geospasial (BIG).',
    infographic: {
      src: '/assets/aistudio/Infografis_Komponen-Komponen_Peta_Islami_Bali_937fd784.png',
      alt: 'Infografik Komponen Peta Bagian 2 Legenda dan Simbol',
      title: 'Infografik: Komponen Peta (Bagian 2)',
      caption:
        'Pelajari arti kotak Legenda, daftar simbol resmi (kota, jalan, sungai, gunung, bandara, pelabuhan), kaidah penulisan Lettering (tegak vs miring), serta lembaga resmi penerbit peta Indonesia (BIG).',
      highlights: [
        'Kotak Legenda Lengkap',
        'Simbol Gunung, Bandara, Pelabuhan',
        'Kaidah Huruf Tegak & Miring',
        'Badan Informasi Geospasial (BIG)',
      ],
    },
    sections: [
      {
        heading: 'Komponen Lanjutan Pembentuk Peta',
        content: 'Komponen peta berikutnya yang wajib kita ketahui:',
        keyPoints: [
          'f. Legenda: Keterangan yang berisi arti dari simbol-simbol pada peta agar pembaca tidak salah tafsir.',
          'g. Simbol Peta: Gambar atau tanda untuk mewakili kenampakan alam atau buatan (ibukota, gunung, jalan, sungai, bandara, pelabuhan).',
          'h. Lettering: Penulisan huruf, angka, dan kata. Huruf TEGAK digunakan untuk buatan manusia (jalan, kota, jembatan), sedangkan huruf MIRING digunakan untuk perairan/hidrografi (sungai, laut, selat, danau).',
          'i. Sumber Data & Tahun Pembuatan: Menunjukkan asal data dan kapan peta dibuat.',
          'j. Nama Penerbit: Lembaga yang menerbitkan peta, contohnya Badan Informasi Geospasial (BIG).',
        ],
        diagramType: 'legend',
      },
    ],
    quickCheck: {
      question: 'Menurut aturan lettering, penulisan nama perairan seperti Selat Bali atau Sungai menggunakan jenis huruf...',
      options: [
        'Huruf miring (italic)',
        'Huruf tegak tebal',
        'Huruf coret',
      ],
      correctIndex: 0,
      explanation: 'Benar sekali! Huruf miring digunakan khusus untuk kenampakan hidrografi atau perairan seperti sungai dan laut.',
    },
  },
  {
    id: 5,
    title: 'Arah Mata Angin & Membaca Peta',
    subheading: 'Pedoman Navigasi 8 Arah Mata Angin dan 4 Langkah Praktis',
    badge: 'Materi 5',
    summary:
      'Delapan arah mata angin membantu menentukan posisi secara tepat, dibimbing posisi matahari, dan 4 tahapan runtut membaca peta.',
    infographic: {
      src: '/assets/aistudio/Poster_Edukasi_Arah__Simbol__dan_Peta_8685a039.png',
      alt: 'Poster Edukasi Arah Mata Angin Simbol dan Cara Membaca Peta',
      title: 'Poster Edukasi: 8 Arah Mata Angin & 4 Langkah Baca Peta',
      caption:
        'Poster lengkap ini menyajikan kompas 8 arah mata angin (U, TL, T, TG, S, BD, B, BL), fakta matahari terbit di Timur, tabel simbol warna-warni, dan 4 langkah sistematis membaca peta.',
      highlights: [
        '8 Arah Mata Angin Lengkap',
        'Matahari Terbit (T) & Terbenam (B)',
        'Tabel 15 Simbol Penting',
        '4 Langkah Praktis Baca Peta',
      ],
    },
    sections: [
      {
        heading: 'Delapan Arah Mata Angin',
        content: 'Kompas delapan arah mata angin memandu orientasi kita di permukaan bumi:',
        keyPoints: [
          'Utara (U): Berada di bagian atas peta.',
          'Timur Laut (TL): Berada di antara Utara dan Timur.',
          'Timur (T): Berada di sebelah kanan peta (arah matahari terbit).',
          'Tenggara (TG): Berada di antara Timur dan Selatan.',
          'Selatan (S): Berada di bagian bawah peta.',
          'Barat Daya (BD): Berada di antara Selatan dan Barat.',
          'Barat (B): Berada di sebelah kiri peta (arah matahari terbenam).',
          'Barat Laut (BL): Berada di antara Barat dan Utara.',
        ],
        diagramType: 'compass',
      },
      {
        heading: 'Empat Langkah Membaca Peta',
        content: 'Ikuti 4 langkah mudah sesuai poster di atas:',
        keyPoints: [
          'Langkah 1: Tentukan arah mata angin pada peta terlebih dahulu.',
          'Langkah 2: Kenali simbol pada peta dan periksa kotak keterangannya.',
          'Langkah 3: Cari lokasi yang dituju menggunakan simbol dan arah mata angin.',
          'Langkah 4: Ambil kesimpulan mengenai letak, arah, dan jarak yang tepat.',
        ],
      },
    ],
    quickCheck: {
      question: 'Arah mata angin yang berada di antara arah Selatan dan Barat adalah...',
      options: [
        'Barat Daya (BD)',
        'Timur Laut (TL)',
        'Tenggara (TG)',
      ],
      correctIndex: 0,
      explanation: 'Tepat! Barat Daya (BD) terletak tepat di antara arah Selatan dan arah Barat.',
    },
  },
  {
    id: 6,
    title: 'Peta Digital & Letak Wilayah Indonesia',
    subheading: 'Peta Konvensional vs Digital, Letak Geografis, & Astronomis',
    badge: 'Materi 6',
    summary:
      'Peta digital interaktif memudahkan pencarian lokasi, didukung pemahaman letak geografis wilayah dan letak astronomis Indonesia.',
    infographic: {
      src: '/assets/aistudio/Infografik_Peta_Digital_dan_Letak_Wilayah_fe37679b.png',
      alt: 'Infografik Peta Digital dan Letak Wilayah di Permukaan Bumi',
      title: 'Infografik: Peta Digital, Letak Geografis & Astronomis',
      caption:
        'Pelajari perbedaan peta kertas dan peta digital pada ponsel/tablet, batas geografis Pulau Jawa, garis astronomis lintang dan bujur Indonesia (6° LU-11° LS & 95° BT-141° BT), serta 3 zona waktu (WIB, WITA, WIT).',
      highlights: [
        'Peta Digital vs Konvensional',
        'Batas Geografis Pulau Jawa',
        'Letak Astronomis 6°LU-11°LS',
        'Zona Waktu WIB, WITA, WIT',
      ],
    },
    sections: [
      {
        heading: 'Peta Konvensional vs Peta Digital',
        content: 'Perkembangan teknologi memudahkan kita menggunakan peta dalam bentuk modern:',
        keyPoints: [
          'Peta Konvensional: Dicetak pada media kertas atau kain, berupa lembaran fisik.',
          'Peta Digital: Disimpan dalam komputer, tablet, atau ponsel; dapat diperbesar/diperkecil secara interaktif; dan menampilkan navigasi langsung.',
        ],
        diagramType: 'practical',
      },
      {
        heading: 'Letak Geografis & Letak Astronomis Indonesia',
        content:
          'Letak suatu tempat di bumi dapat dilihat melalui dua sudut pandang penting:',
        keyPoints: [
          'Letak Geografis: Posisi wilayah berdasarkan kenampakan alam di sekitarnya. Contoh Pulau Jawa: Sebelah utara (Laut Jawa), timur (Selat Bali), selatan (Samudra Hindia), barat (Selat Sunda).',
          'Letak Astronomis: Letak berdasarkan garis lintang dan garis bujur khayal. Indonesia terletak pada 6° LU - 11° LS dan 95° BT - 141° BT.',
          'Pengaruh: Indonesia beriklim tropis, curah hujan tinggi, keanekaragaman hayati melimpah, dan terbagi ke dalam 3 zona waktu: WIB (Waktu Indonesia Barat), WITA (Tengah), dan WIT (Timur).',
        ],
      },
    ],
    quickCheck: {
      question: 'Pulau Jawa berbatasan dengan Samudra Hindia di sebelah...',
      options: [
        'Utara',
        'Selatan',
        'Timur',
      ],
      correctIndex: 1,
      explanation: 'Benar! Sebelah selatan Pulau Jawa berbatasan langsung dengan Samudra Hindia yang luas.',
    },
  },
  {
    id: 7,
    title: 'Penerapan Peta dalam Kehidupan',
    subheading: 'Pemanfaatan Peta untuk Navigasi, Profesi, & Wisata',
    badge: 'Materi 7',
    summary:
      'Peta digunakan setiap hari oleh masyarakat luas, kurir barang, wisatawan, dan petugas keselamatan untuk navigasi aman.',
    infographic: {
      src: '/assets/aistudio/Petualangan_Belajar_Peta_Desa_82df259e.png',
      alt: 'Penerapan Peta dalam Menemukan Tempat dan Navigasi Lingkungan',
      title: 'Penerapan Praktis: Peta Lingkungan & Denah Tempat Tinggal',
      caption:
        'Peta membantu masyarakat mengenali jalur aman, fasilitas kesehatan, tempat ibadah, serta menghitung perkiraan jarak tempuh dengan skala yang tepat.',
      highlights: [
        'Menemukan Fasilitas Umum',
        'Membantu Kurir & Petualang',
        'Menghitung Jarak dengan Skala',
        'Rute Aman Lingkungan',
      ],
    },
    sections: [
      {
        heading: 'Siapa Saja yang Membutuhkan Peta?',
        content: 'Peta bukan hanya pelajaran sekolah, melainkan alat bantu nyata:',
        keyPoints: [
          '• Siswa & Guru: Mengetahui denah sekolah dan rute darurat.',
          '• Wisatawan: Mencari lokasi wisata alam, pantai, dan pegunungan baru.',
          '• Kurir Paket & Ojek Online: Menemukan alamat rumah pemesan dengan cepat dan tepat.',
          '• Tim Penyelamat (SAR/Damkar): Menemukan jalur evakuasi bencana yang aman dari banjir.',
        ],
        diagramType: 'relative',
      },
    ],
    quickCheck: {
      question: 'Profesi apa yang sangat bergantung pada peta digital setiap hari untuk mengantar barang?',
      options: [
        'Kurir ekspedisi dan pengemudi online',
        'Penjaga perpustakaan',
        'Tukang jahit pakaian',
      ],
      correctIndex: 0,
      explanation: 'Tepat sekali! Kurir dan pengemudi online memakai peta digital setiap saat untuk navigasi jalan.',
    },
  },
  {
    id: 8,
    title: 'Rangkuman Lengkap & Kuis Cepat',
    subheading: 'Uji Pemahaman Komprehensif Sebelum Masuk Papan Petualangan',
    badge: 'Materi 8',
    summary:
      'Kaji ulang seluruh konsep 6 komponen peta, 8 arah mata angin, simbol, serta aturan lettering sebelum memulai tantangan nomor 1 - 25!',
    infographic: {
      src: '/assets/aistudio/Poster_Edukasi_Arah__Simbol__dan_Peta_8685a039.png',
      alt: 'Rangkuman Poster Peta Komprehensif',
      title: 'Rangkuman Materi: Bekal Lengkap Petualang Peta IPAS',
      caption:
        'Kamu sudah mempelajari seluruh bekal materi peta! Pastikan kamu memahami simbol, kompas, dan aturan pembacaan letak sebelum melangkah ke papan petualangan puzzle.',
      highlights: [
        'Review 8 Arah Angin',
        '15 Simbol Peta Pokok',
        'Kaidah Lettering',
        'Siap Main Game Papan Peta',
      ],
    },
    sections: [
      {
        heading: '6 Poin Penting Pelajaran IPAS Kelas IV',
        content: 'Mari ingat kembali rangkuman inti ini:',
        keyPoints: [
          '1. Peta adalah gambaran permukaan bumi pada bidang datar dengan skala diperkecil.',
          '2. Komponen peta meliputi judul, skala, arah mata angin, simbol, legenda, garis astronomis, dan inset.',
          '3. Terdapat 8 arah mata angin dengan acuan utama Utara (atas), Timur (kanan/terbit), Selatan (bawah), Barat (kiri/terbenam).',
          '4. Kotak legenda menjelaskan arti dari setiap simbol agar tidak salah tafsir.',
          '5. Huruf tegak dipakai untuk kenampakan buatan manusia, huruf miring dipakai untuk perairan (sungai, laut).',
          '6. Peta digital bersifat interaktif dan dapat diperbesar untuk melihat detail jalan serta letak geografis.',
        ],
        diagramType: 'quiz',
      },
    ],
    quickCheck: {
      question: 'Sikap apa yang paling utama saat belajar membaca peta dan menyelesaikan tantangan puzzle?',
      options: [
        'Semangat bertumbuh: berani mencoba, teliti melihat legenda, dan belajar dari kesalahan',
        'Ingin terburu-buru selesai tanpa memeriksa simbol',
        'Takut mencoba karena takut salah',
      ],
      correctIndex: 0,
      explanation: 'Luar biasa! Dengan semangat bertumbuh (Growth Mindset), kamu pasti bisa menuntaskan 25 tantangan peta!',
    },
  },
];
