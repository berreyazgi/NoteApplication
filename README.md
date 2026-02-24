# Samsung Notes Style Student Hub

Bu proje, öğrencilerin notlarını, ders programlarını ve günlük görevlerini tek bir yerden yönetebileceği, **Samsung Notes** tasarım dilinden ilham alan, modern ve responsive bir web uygulamasıdır.

> **Canlı Uygulama Linki:** (https://github.com/berreyazgi/NoteApplication) ---

## Özellikler

* **Dinamik Dashboard:** Takvim, To-Do List ve Sticky Notes bileşenlerinden oluşan, tüm ekranı kaplayan ferah ana sayfa.
* **Akıllı Klasörleme:** Notları kategorize etmek için tek seviyeli, hızlı erişilebilir klasör yapısı.
* **Samsung Style Tasarım:** Geniş kartlar, yuvarlatılmış köşeler (`rounded-3xl`) ve minimalist arayüz.
* **Full Responsive:** Mobil, tablet ve masaüstü cihazlar için optimize edilmiş `grid` yapısı.
* **CRUD İşlemleri:** Klasör ve not oluşturma, düzenleme ve silme yetenekleri.
* **Sürükle-Bırak Hazırlığı:** `@dnd-kit` altyapısı ile notları klasörlere taşıma desteği.

## Kullanılan Teknolojiler

* **Framework:** [React 19](https://www.google.com/search?q=https://react.dev/)
* **Build Tool:** [Vite](https://www.google.com/search?q=https://vitejs.dev/)
* **Styling:** [Tailwind CSS v4](https://www.google.com/search?q=https://tailwindcss.com/)
* **Icons:** [Lucide React](https://www.google.com/search?q=https://lucide.dev/)
* **Language:** [TypeScript](https://www.google.com/search?q=https://www.typescriptlang.org/)

---

## Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için şu adımları izleyin:

1. **Depoyu Klonlayın:**
```bash
git clone https://github.com/kullanici-adiniz/todolist.git

```


2. **Bağımlılıkları Yükleyin:**
```bash
npm install

```


3. **Geliştirme Sunucusunu Başlatın:**
```bash
npm run dev

```


Tarayıcıda `http://localhost:5173` adresine giderek uygulamayı görebilirsiniz.

---

## Proje Yapısı

```text
src/
├── components/     # UI Bileşenleri (Widgetlar, Kartlar)
├── types/          # TypeScript Interface tanımları
├── App.tsx         # Ana uygulama mantığı ve Layout
├── index.css       # Tailwind v4 importları ve global stiller
└── main.tsx        # React giriş noktası

```
