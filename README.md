# RT09RW04 · Candisari Wonotingal

Aplikasi komunitas warga berbasis PWA.

## Cara Deploy ke Netlify

1. Buka https://app.netlify.com/drop
2. Drag folder ini ke area drop
3. Tunggu ~15 detik → dapat URL seperti `rt09rw04.netlify.app`
4. Selesai!

## Struktur File

- `index.html` — Aplikasi utama
- `manifest.json` — PWA manifest
- `sw.js` — Service Worker
- `icon-192.png` — Ikon PWA (perlu dibuat)
- `icon-512.png` — Ikon PWA (perlu dibuat)

## Cara Buat Ikon

1. Buka https://favicon.io/favicon-generator/
2. Text: `RT`
3. Background: `#6366f1`
4. Font Color: `#ffffff`
5. Font: Bold, size besar
6. Download → dapat `android-chrome-192x192.png` dan `android-chrome-512x512.png`
7. Rename jadi `icon-192.png` dan `icon-512.png`
8. Letakkan di folder ini

## Cara Install PWA di HP

### Android
1. Buka URL di Chrome
2. Tap menu ⋮ → "Install app" / "Tambahkan ke Home Screen"
3. Ikon muncul di home screen

### iOS
1. Buka URL di Safari
2. Tap ikon Share → "Add to Home Screen"
3. Tap Add

## Setup Firebase

Sudah tertanam di `index.html`. Yang perlu:
1. Firebase Console → Authentication → aktifkan Google Sign-In
2. Firebase Console → Firestore → deploy rules

Rules Firestore: