# 🍽️ Rembayung - Masakan Melayu Autentik

> Restoran Masakan Melayu di Kuala Lumpur | "Masakan Kampung, Citarasa Semua"

![Rembayung Preview](assets/icons/star.png)

## 📋 Tentang Projek

**Rembayung** adalah sistem tempahan restoran lengkap yang dibina dengan HTML, CSS, dan JavaScript. Projek ini menyediakan pengalaman pengguna yang premium dengan rekabentuk estetik dan fungsi yang lengkap.

## ✨ Ciri-ciri

### 🏠 Laman Utama (`index.html`)
- Hero section dengan animasi
- Bahagian tentang kami
- Menu hidangan dengan kad premium
- Galeri foto interaktif
- Lokasi & maklumat hubungi
- Footer dengan pautan sosial

### 📝 Sistem Tempahan (`booking.html`)
- Borang tempahan lengkap dengan validasi
- Simpan data ke localStorage
- Modal pengesahan tempahan
- Maklumat penting untuk pelanggan

### 👤 Konsol Admin (`admin.html`)
- Log masuk selamat
- Dashboard dengan statistik
- Senarai tempahan dengan penapis
- Sahkan/Batalkan tempahan
- Eksport ke CSV

## 🚀 Cara Guna

### Pelayar Tempatan
1. Muat turun atau klon repositori ini
2. Buka `index.html` dalam pelayar web

### Kredentials Admin
- **Nama Pengguna:** `admin`
- **Kata Laluan:** `12345678`

## 📱 Responsive Design

Laman web ini responsif sepenuhnya dan berfungsi dengan baik pada:
- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1024px)
- 📲 Mobile (480px - 768px)
- 📲 Mobile kecil (< 480px)

## 🗂️ Struktur Projek

```
Rembayung/
├── index.html          # Laman utama
├── booking.html        # Borang tempahan
├── admin.html          # Konsol admin
├── css/
│   └── style.css       # Stylesheet utama
├── js/
│   ├── main.js         # JavaScript utama
│   ├── booking.js      # Logik tempahan
│   ├── admin.js        # Logik admin
│   └── security.js     # Keselamatan
└── assets/
    └── icons/          # Ikon premium
```

## 💾 Penyimpanan Data

Data disimpan dalam **localStorage** pelayar:
- `rembayung_bookings` - Senarai tempahan
- `rembayung_admin_logged_in` - Status log masuk admin

> **Nota:** Data akan hilang jika cache pelayar dibersihkan.

## 🛠️ Teknologi

- HTML5
- CSS3 (dengan CSS Variables & Flexbox/Grid)
- Vanilla JavaScript (ES6+)
- Google Fonts (Cinzel, Lora, Cormorant Garamond)

## 📄 Lesen

© 2026 Rembayung. Hak Cipta Terpelihara.

---

**Dibuat dengan  untuk projek pengajian**
