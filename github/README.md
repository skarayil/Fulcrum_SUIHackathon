Harika bir proje yapısı. Geliştirdiğin **FULCRUM** projesinin README dosyasını, teknik terimleri koruyarak ve açıklamaları anlaşılır bir Türkçeye çevirerek aşağıda sunuyorum.

Bunu projenin kök dizinindeki `README.md` dosyasına yapıştırabilirsin.

-----

# FULCRUM - Blokzincir Ödül Dağıtım Platformu

Hackathon ve yarışma ödüllerinin adil, şeffaf ve güvenli dağıtımı için Sui blokzinciri üzerine inşa edilmiş merkeziyetsiz bir uygulama (dApp). FULCRUM, ödüllerin ekip üyeleri arasında eşit olarak dağıtılmasını sağlar ve blokzincir tabanlı yönetişim yoluyla haksız uygulamaları önler.

## 📋 İçindekiler

  - [Genel Bakış](https://www.google.com/search?q=%23genel-bak%C4%B1%C5%9F)
  - [Özellikler](https://www.google.com/search?q=%23%C3%B6zellikler)
  - [Teknoloji Yığını](https://www.google.com/search?q=%23teknoloji-y%C4%B1%C4%9F%C4%B1n%C4%B1)
  - [Proje Yapısı](https://www.google.com/search?q=%23proje-yap%C4%B1s%C4%B1)
  - [Kurulum](https://www.google.com/search?q=%23kurulum)
  - [Yapılandırma](https://www.google.com/search?q=%23yap%C4%B1land%C4%B1rma)
  - [Kullanım](https://www.google.com/search?q=%23kullan%C4%B1m)
  - [Mimari](https://www.google.com/search?q=%23mimari)
  - [Dosya Yapısı & Dokümantasyon](https://www.google.com/search?q=%23dosya-yap%C4%B1s%C4%B1--dok%C3%BCmantasyon)
  - [Akıllı Sözleşme](https://www.google.com/search?q=%23ak%C4%B1ll%C4%B1-s%C3%B6zle%C5%9Fme)
  - [Geliştirme](https://www.google.com/search?q=%23geli%C5%9Ftirme)

-----

## 🎯 Genel Bakış

FULCRUM, hackathonlarda ve yarışmalarda ödül dağıtımının adil ve şeffaf olmasını sağlayan Sui blokzincir tabanlı bir platformdur. Sistem, ekip üyelerini şu yollarla korur:

  - **Bireysel ödül alımını engelleme**: Takım liderleri ödülü tek başına alamaz.
  - **Eşit dağıtım**: Tüm üyeler otomatik olarak eşit pay alır.
  - **Demokratik yönetim**: Haksızlık yapan üyeler oylama yoluyla çıkarılabilir.
  - **Tam şeffaflık**: Tüm işlemler zincir üzerinde (on-chain) kaydedilir.

Platform üç ana kullanıcı rolü üzerinde çalışır:

  - **Geliştirici (Developer)**: Kullanıcılara rol atayabilen yöneticiler.
  - **Sponsor**: Yarışmalar oluşturan, ekipleri organize eden ve ödülleri dağıtan organizasyonlar.
  - **Yarışmacı (Contestant)**: Ekiplere katılan ve yarışmalarda rekabet eden katılımcılar.

-----

## ✨ Özellikler

### Sponsorlar İçin

  - Özelleştirilebilir kurallar ve ödül havuzları ile yarışmalar oluşturma
  - Yarışmacıları, belirlenmiş liderleri olan ekipler halinde organize etme
  - Kazanan ekiplere ödülleri otomatik olarak dağıtma
  - Yarışma havuzu detaylarını ve ekip bilgilerini görüntüleme

### Yarışmacılar İçin

  - Ekip bilgilerini ve üye detaylarını görüntüleme
  - Ekip oylamasına katılma (gelecek özellik)
  - Dağıtımdan sonra ödülleri talep etme (gelecek özellik)

### Geliştiriciler İçin

  - Kullanıcılara Sponsor veya Yarışmacı rolleri atama
  - Platform yeteneklerini yönetme

### Platform Özellikleri

  - Rol tabanlı erişim kontrolü (RBAC)
  - Cüzdan tabanlı kimlik doğrulama
  - Gerçek zamanlı blokzincir veri sorgulama
  - Duyarlı (responsive) karanlık temalı arayüz
  - Akıcı sayfa geçişleri

-----

## 🛠 Teknoloji Yığını

### Önyüz (Frontend)

  - **React 18.3** - Arayüz kütüphanesi
  - **TypeScript 5.9** - Tip güvenli geliştirme
  - **Vite 7.1** - Derleme aracı ve geliştirme sunucusu
  - **React Router DOM 7.9** - İstemci tarafı yönlendirme
  - **Tailwind CSS 3.4** - Utility-first CSS çatısı
  - **Radix UI Themes 3.2** - Erişilebilir UI bileşenleri
  - **Lucide React 0.555** - İkon kütüphanesi

### Blokzincir Entegrasyonu

  - **@mysten/dapp-kit 0.19.9** - Sui cüzdan bağlantısı ve istemcisi
  - **@mysten/sui 1.45.0** - Sui blokzincir SDK'sı
  - **@tanstack/react-query 5.87** - Veri çekme ve önbellekleme

### Akıllı Sözleşme

  - **Sui Move** - Akıllı sözleşme dili
  - **Move Edition 2024** - En güncel Move dili özellikleri

### Geliştirme Araçları

  - **ESLint** - Kod denetimi
  - **Prettier** - Kod biçimlendirme
  - **TypeScript** - Statik tip kontrolü
  - **PostCSS & Autoprefixer** - CSS işleme

-----

## 📁 Proje Yapısı

```
kedy/
├── blockedy/                   # Akıllı sözleşme dizini
│   ├── Move.toml               # Move paket yapılandırması
│   ├── Move.lock               # Bağımlılık kilit dosyası
│   ├── sources/
│   │   └── blockedy.move       # Ana Move akıllı sözleşmesi
│   └── tests/
│       └── blockedy_tests.move # Sözleşme birim testleri
│
├── src/                        # Önyüz kaynak kodu
│   ├── pages/                  # Sayfa (Route) bileşenleri
│   ├── components/             # Yeniden kullanılabilir UI bileşenleri
│   ├── hooks/                  # Özel React hook'ları
│   ├── config/                 # Yapılandırma dosyaları
│   ├── App.tsx                 # Yönlendirmeli ana uygulama
│   ├── main.tsx                # Uygulama giriş noktası
│   ├── index.css               # Global stiller
│   └── vite-env.d.ts           # TypeScript tanımları
│
├── dist/                       # Üretim (build) çıktısı
├── node_modules/               # Bağımlılıklar
├── index.html                  # HTML giriş noktası
├── package.json                # Node.js bağımlılıkları
├── vite.config.mts             # Vite yapılandırması
├── tailwind.config.js          # Tailwind CSS yapılandırması
├── tsconfig.json               # TypeScript yapılandırması
└── README.md                   # Bu dosya
```

-----

## 🚀 Kurulum

### Ön Koşullar

  - **Node.js** 18+ ve npm
  - **Sui CLI** - Akıllı sözleşmeleri dağıtmak (deploy) için
  - Sui uyumlu bir cüzdan (örn. Sui Wallet, Ethos Wallet)

### Kurulum Adımları

1.  **Depoyu klonlayın**

    ```bash
    git clone <repository-url>
    cd kedy
    ```

2.  **Bağımlılıkları yükleyin**

    ```bash
    npm install
    ```

3.  **Akıllı sözleşmeyi yapılandırın**

      - Move sözleşmesini yayınlayın (bkz. [Akıllı Sözleşme](https://www.google.com/search?q=%23ak%C4%B1ll%C4%B1-s%C3%B6zle%C5%9Fme) bölümü)
      - `src/config/constants.ts` dosyasını kendi Paket ID ve Yetenek (Capability) ID'lerinizle güncelleyin.

4.  **Geliştirme sunucusunu başlatın**

    ```bash
    npm run dev
    ```

5.  **Üretim için derleyin**

    ```bash
    npm run build
    ```

-----

## ⚙️ Yapılandırma

### Akıllı Sözleşme Yapılandırması

Sözleşme adreslerinizi ayarlamak için `src/config/constants.ts` dosyasını düzenleyin:

```typescript
export const PACKAGE_ID = "0x...";             // Yayınlanan paket ID'niz
export const DEVELOPER_CAP_ID = "0x...";       // Geliştirici yetenek (capability) ID'si
export const CONTESTANT_REGISTRY_ID = "0x..."; // Yarışmacı kayıt defteri ID'si
```

### Ağ Yapılandırması

Varsayılan ağ `src/config/networkConfig.ts` dosyasında `testnet` olarak ayarlanmıştır. Bunu `src/main.tsx` dosyasından değiştirebilirsiniz:

```typescript
<SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
```

-----

## 📖 Kullanım

### Son Kullanıcılar İçin

1.  **Cüzdan Bağlayın**: Sağ üst köşedeki "Connect Wallet" butonuna tıklayın.
2.  **Kayıt Olun**: Açılış sayfasındaki kayıt formunu doldurun.
      - Rolünüzü seçin: Sponsor veya Yarışmacı.
      - Formu gönderin ve cüzdanınızdaki işlemi onaylayın.
3.  **Panele Erişin**: Gezinme menüsünden rolünüze özel panele (dashboard) gidin.

### Geliştiriciler İçin

1.  **Sözleşmeyi Yayınlayın**: Move sözleşmesini Sui testnet'e deploy edin.
2.  **Sabitleri Güncelleyin**: `constants.ts` içindeki Paket ID ve Yetenek ID'lerini ayarlayın.
3.  **Rol Atayın**: Kullanıcılara rol atamak için Geliştirici Panelini (Developer Dashboard) kullanın.

-----

## 🏗 Mimari

### Uygulama Akışı

```
Kullanıcı → Cüzdan Bağlantısı → Rol Tespiti → Korumalı Rota → Dashboard
```

1.  **Cüzdan Bağlantısı**: Kullanıcı Sui cüzdanını bağlar.
2.  **Rol Tespiti**: Sistem, cüzdanda yetenek NFT'lerini (SponsorCap, ContestantCap) kontrol eder.
3.  **Erişim Kontrolü**: Korumalı rotalar, sayfayı oluşturmadan önce kullanıcı rolünü doğrular.
4.  **Panel Erişimi**: Kullanıcı role özgü özelliklere erişir.

### Veri Akışı

```
Frontend (React)
    ↓
@mysten/dapp-kit (Cüzdan & İstemci)
    ↓
Sui RPC Node
    ↓
Akıllı Sözleşme (Move)
    ↓
Sui Blokzinciri
```

### Durum Yönetimi (State Management)

  - **React Query**: Sunucu durumunu (blokzincir verileri) yönetir.
  - **React State**: Yerel UI durumunu yönetir.
  - **Wallet State**: @mysten/dapp-kit tarafından yönetilir.

### Kimlik Doğrulama & Yetkilendirme

  - **Kimlik Doğrulama**: @mysten/dapp-kit aracılığıyla cüzdan bağlantısı.
  - **Yetkilendirme**: Yetenek NFT'leri aracılığıyla rol tabanlı erişim kontrolü.
      - Geliştirici: DeveloperCap NFT
      - Sponsor: SponsorCap NFT
      - Yarışmacı: ContestantCap NFT

-----

## 📄 Dosya Yapısı & Dokümantasyon

### Kök Dizin Dosyaları

#### `package.json`

Proje bağımlılıklarını, scriptleri ve meta verileri tanımlar.

**Scriptler:**

  - `npm run dev` - Geliştirme sunucusunu başlatır
  - `npm run build` - Üretim için derler
  - `npm run lint` - ESLint çalıştırır
  - `npm run preview` - Üretim derlemesini önizler

#### `vite.config.mts`

Vite derleme aracı yapılandırması. React eklentisini ve derleme seçeneklerini ayarlar.

#### `tsconfig.json`

TypeScript derleyici yapılandırması. Katı modu (strict mode) ve modern ES özelliklerini etkinleştirir.

#### `tailwind.config.js`

Tailwind CSS yapılandırması. Özel renkleri, yazı tiplerini ve tema ayarlarını tanımlar.

#### `index.html`

HTML giriş noktası. Kök div ve script içe aktarmalarını içerir.

### Akıllı Sözleşme (`blockedy/`)

#### `blockedy/Move.toml`

Move paket yapılandırması:

  - Paket adı: `blockedy`
  - Sürüm: `2024` (en son Move özellikleri)
  - Bağımlılıklar: Sui framework

#### `blockedy/sources/blockedy.move`

Şunları uygulayan ana akıllı sözleşme:

  - **Veri Yapıları**: Yarışma (Competition), Takım (Team), Oy (Vote), Yetenek NFT'leri.
  - **Fonksiyonlar**:
      - Rol atama (Geliştirici fonksiyonu)
      - Kendi kendine kayıt (Sponsor/Yarışmacı)
      - Yarışma oluşturma
      - Takım oluşturma ve yönetimi
      - Ödül dağıtımı
      - Oylama sistemi (gelecek)

**Ana Struct'lar:**

  - `DeveloperCap`: Yönetici yeteneği.
  - `SponsorCap`: Adres içeren Sponsor yeteneği.
  - `ContestantCap`: Adres içeren Yarışmacı yeteneği.
  - `Competition`: Kurallar, ödül havuzu ve takımları içeren yarışma verisi.
  - `Team`: Üyeler ve lideri içeren takım verisi.
  - `ContestantRegistry`: Tüm yarışmacıları izleyen küresel kayıt defteri.

### Önyüz Kaynağı (`src/`)

#### `src/main.tsx`

Uygulama giriş noktası. Şunları kurar:

  - React kökü
  - Tema sağlayıcı (Radix UI karanlık tema)
  - Sorgu istemcisi (React Query)
  - Sui istemci sağlayıcısı (blokzincir bağlantısı)
  - Cüzdan sağlayıcısı (cüzdan entegrasyonu)
  - Uygulama bileşeni

**Ana Sağlayıcılar:**

```typescript
<Theme> → <QueryClientProvider> → <SuiClientProvider> → <WalletProvider> → <App>
```

#### `src/App.tsx`

Yönlendirme mantığına sahip ana uygulama bileşeni.

**Sorumluluklar:**

  - Tüm uygulama rotalarını tanımlar
  - Gezinme menüsünü uygular
  - Cüzdan bağlantı arayüzünü yönetir
  - Rol tabanlı gezinme filtrelemesini yönetir
  - Cüzdan güvenlik uyarılarını gizler

**Rotalar:**

  - `/` - Açılış sayfası (herkese açık)
  - `/developer-dashboard` - Geliştirici paneli (korumalı)
  - `/new-sponsor-dashboard` - Sponsor paneli (korumalı)
  - `/contestant` - Yarışmacı paneli (korumalı)
  - `/view-pool` - Havuz görüntüleme (korumalı, sadece sponsor)

#### Yapılandırma Dosyaları (`src/config/`)

##### `src/config/constants.ts`

Şunları içeren merkezi yapılandırma dosyası:

  - `PACKAGE_ID`: Yayınlanan Move paket ID'si
  - `MODULE_NAME`: Move modül adı ("competition")
  - `DEVELOPER_CAP_ID`: Geliştirici yetenek nesne ID'si
  - `CONTESTANT_REGISTRY_ID`: Yarışmacı kayıt defteri nesne ID'si
  - `EXPLORER_URL`: İşlem linkleri için Sui explorer URL'si
  - `NETWORK`: Aktif ağ (testnet/devnet/mainnet)

##### `src/config/networkConfig.ts`

Farklı ortamlar için Sui ağ yapılandırması.

**Ağlar:**

  - `devnet`: Geliştirme ağı
  - `testnet`: Test ağı (varsayılan)
  - `mainnet`: Canlı ağ

#### Sayfa Bileşenleri (`src/pages/`)

##### `src/pages/LandingPage.tsx`

Kayıt işlevselliğine sahip pazarlama/açılış sayfası.

**Kayıt Akışı:**

1.  Kullanıcı formu doldurur (isim, e-posta, rol).
2.  "Register" butonuna tıklar.
3.  Cüzdan onayı penceresi açılır.
4.  Kullanıcı işlemi onaylar.
5.  Yetenek NFT'si cüzdana basılır (mint edilir).
6.  Kullanıcı artık role özel panele erişebilir.

##### `src/pages/NewSponsorDashboard.tsx`

Yarışma yönetimi için ana sponsor paneli.

**Üç Ana Sekme:**

1.  **Create Competition (Yarışma Oluştur)**: Kuralları ve ödül miktarını girer, ödül havuzunu kilitler.
2.  **Create Teams (Takım Oluştur)**: Havuzdan takımları otomatik oluşturur veya manuel ayarlar, zincir üzerine kaydeder.
3.  **Distribute Prizes (Ödül Dağıt)**: Kazanan takıma ödülleri eşit paylaştırarak dağıtır.

##### `src/pages/ContestantDashboard.tsx`

Yarışmacıların takım bilgilerini görmesi için panel.

  - Yarışma ID'sini girerek takımı otomatik bulur.
  - Takım üyelerini ve lideri gösterir.
  - Verileri `localStorage`'da saklar.

##### `src/pages/ViewPool.tsx`

Yarışma havuzu detaylarını ve takım bilgilerini görüntüler.

#### Özel Hook'lar (`src/hooks/`)

##### `src/hooks/useUserRole.ts`

Cüzdan yeteneklerini kontrol ederek kullanıcı rolünü belirler.

**Mantık:**

1.  Cüzdandaki sahip olunan nesneleri (objects) getirir.
2.  Nesne türlerinde yetenek NFT'lerini arar (`DeveloperCap`, `SponsorCap`, `ContestantCap`).
3.  Bulunan rolü döndürür.

-----

## 🔐 Akıllı Sözleşme

### Dağıtım (Deployment)

1.  **Sözleşme dizinine gidin**

    ```bash
    cd blockedy
    ```

2.  **Sözleşmeyi derleyin (Build)**

    ```bash
    sui move build
    ```

3.  **Testleri çalıştırın**

    ```bash
    sui move test
    ```

4.  **Testnet'te yayınlayın**

    ```bash
    sui client publish --gas-budget 100000000
    ```

5.  **Çıktıyı kaydedin:**

      - Package ID → `constants.ts` dosyasını güncelleyin.
      - DeveloperCap ID → `constants.ts` dosyasını güncelleyin.
      - ContestantRegistry ID → `constants.ts` dosyasını güncelleyin.

### Sözleşme Fonksiyonları

#### Geliştirici Fonksiyonları

  - `assign_role()`: Sponsor veya Yarışmacı rolü atar (eski yöntem, kendi kendine kayıt tercih edilir).

#### Kendi Kendine Kayıt Fonksiyonları

  - `create_sponsor()`: Kullanıcı sponsor olarak kaydolur, SponsorCap alır.
  - `create_contestant()`: Kullanıcı yarışmacı olarak kaydolur, ContestantCap alır, kayıt defterine eklenir.

#### Sponsor Fonksiyonları

  - `create_competition()`: Yeni yarışma oluşturur, ödül havuzunu kilitler.
  - `create_teams()`: Üyeler ve liderlerle takımları oluşturur.
  - `distribute_prizes()`: Kazanan takım üyelerine ödülleri dağıtır.

-----

## 🔧 Geliştirme

### Yeni Sayfa Ekleme

1.  `src/pages/` içinde bileşen oluşturun.
2.  `src/App.tsx` içinde rota (route) ekleyin.
3.  Gerekirse gezinme (navigation) öğesi ekleyin.
4.  Gerekliyse korumalı rota (protected route) uygulayın.

### Stil Yönergeleri

  - Tailwind CSS sınıflarını kullanın.
  - Karanlık tema renk şemasını takip edin (siyah, mavi, camgöbeği).
  - Butonlar için gradyan sınıfları kullanın: `bg-gradient-to-r from-blue-500 to-cyan-600`.

-----

## 🐛 Sorun Giderme

### Yaygın Sorunlar

**Cüzdan bağlanmıyor:**

  - Sui Wallet eklentisinin yüklü olduğundan emin olun.
  - Ağın testnet olarak ayarlandığından emin olun.
  - Sayfayı yenilemeyi deneyin.

**Rol tespit edilemiyor:**

  - Açılış sayfası üzerinden kayıt olduğunuzu doğrulayın.
  - Explorer'da cüzdanınızda yetenek NFT'sinin olup olmadığını kontrol edin.
  - Doğru ağda (testnet) olduğunuzdan emin olun.

**İşlem hataları:**

  - Cüzdanınızda gas ücreti için yeterli SUI olup olmadığını kontrol edin.
  - `constants.ts` içindeki sözleşme adreslerini doğrulayın.

-----

## 📝 Lisans

Bu proje açık kaynaktır. Detaylar için lisans dosyasına bakın.

-----

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz\! Lütfen mevcut kod stiline uyun ve inceleme için pull request gönderin.

-----

**Sui Blokzinciri üzerinde ❤️ ile inşa edilmiştir.**
