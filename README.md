<div align="center">

# ⚖️ FULCRUM — Merkeziyetsiz Hackathon & Yarışma Platformu

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&pause=1000&color=6366F1&center=true&vCenter=true&width=700&lines=Sui+Blockchain+Üzerinde+Şeffaf+Ödül+Dağıtımı;Akıllı+Kontrat+%7C+Cüzdan+Entegrasyonu;React+%2B+Move+ile+Tam+Merkeziyetsiz+dApp!" alt="Typing SVG" />

<br/>

[![Move](https://img.shields.io/badge/Move-Smart%20Contract-4F46E5?style=for-the-badge&logo=sui&logoColor=white)](https://docs.sui.io/concepts/sui-move-concepts)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Sui](https://img.shields.io/badge/Sui-Blockchain-6FBCF0?style=for-the-badge&logo=sui&logoColor=white)](https://sui.io)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-Themes-8B5CF6?style=for-the-badge&logo=radixui&logoColor=white)](https://www.radix-ui.com)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](https://github.com/skarayil)

<br/>

> **Şeffaf, adil ve tam merkeziyetsiz bir hackathon yarışma platformu.**
> Sui blockchain üzerinde akıllı kontratlarla yönetilen sponsor kaydı, takım oluşturma, jüri oylaması ve otomatik ödül dağıtımı.
> Herhangi bir arka uç veya veritabanı gerektirmez — tüm veriler doğrudan zincir üzerinde saklanır.

<br/>

### 🌐 [Canlı Demo → fulcrum-demo.vercel.app](https://skarayil.github.io/Fulcrum_SUIHackathon/)

<br/>

[✨ Özellikler](#-özellikler) • [🚀 Kurulum](#-kurulum-ve-çalıştırma) • [📁 Proje Yapısı](#-proje-yapısı) • [🔐 Güvenlik](#-güvenlik) • [👩‍💻 Geliştirici](#-geliştirici)

</div>

---

## ✨ Özellikler

<table>
  <tr>
    <td align="center">🔗</td>
    <td><strong>Tam Merkeziyetsiz Mimari</strong></td>
    <td>Arka uç ya da veritabanı yok — tüm veriler Sui blockchain üzerinde saklanır ve dinamik olarak sorgulanır</td>
  </tr>
  <tr>
    <td align="center">🏆</td>
    <td><strong>Otomatik Ödül Dağıtımı</strong></td>
    <td>Yarışma oluşturulduğunda özel <code>REWARD</code> token'ları akıllı kontrat ile basılır; kazananlar arasında eşit bölünür</td>
  </tr>
  <tr>
    <td align="center">👥</td>
    <td><strong>Sponsor & Yarışmacı Rolleri</strong></td>
    <td>Ayrı gösterge panelleriyle sponsor ve yarışmacı kayıt, takım oluşturma ve yönetim akışları</td>
  </tr>
  <tr>
    <td align="center">🗳️</td>
    <td><strong>Jüri Oylama Sistemi</strong></td>
    <td>Akıllı kontrat üzerinde şeffaf ve değiştirilemez jüri oylaması — sonuçlar zincirden sorgulanır</td>
  </tr>
  <tr>
    <td align="center">💰</td>
    <td><strong>Özel REWARD Token</strong></td>
    <td>Move ile yazılmış özel coin; yarışma başına basılır ve kazananlara Programmable Transaction Block ile aktarılır</td>
  </tr>
  <tr>
    <td align="center">🔒</td>
    <td><strong>Cüzdan Entegrasyonu</strong></td>
    <td><code>@mysten/dapp-kit</code> ile Sui uyumlu cüzdanlar desteklenir; tüm işlemler imzalı PTB ile gerçekleşir</td>
  </tr>
  <tr>
    <td align="center">🎨</td>
    <td><strong>Şık Arayüz</strong></td>
    <td>Radix UI Themes tabanlı temiz ve modern tasarım; React + Vite ile hızlı geliştirme deneyimi</td>
  </tr>
  <tr>
    <td align="center">🌐</td>
    <td><strong>Localnet & Testnet Desteği</strong></td>
    <td>Hem yerel Sui ağı hem de Sui Testnet üzerinde tek komutla çalışır; ortam <code>.env</code> ile yönetilir</td>
  </tr>
</table>

---

## 🚀 Kurulum ve Çalıştırma

### 1 — Repoyu Klonla

```bash
git clone https://github.com/skarayil/fulcrum.git
cd fulcrum
```

### 2 — Yerel Sui Ağını Başlat *(Opsiyonel)*

Testnet yerine yerel ağda test etmek istiyorsan:

```bash
# Yeni terminalde yerel ağı başlat (arka planda çalışır)
sui-test-validator

# Sui CLI'yi localnet'e yönlendir
sui client new-env --alias localnet --rpc http://127.0.0.1:9000
sui client switch --env localnet

# Test SUI token'ı al
sui client faucet
```

### 3 — Akıllı Kontratı Derle & Yayınla

```bash
cd blockchain

# Derleme hatası kontrolü
sui move build

# Ağa yayınla
sui client publish --gas-budget 100000000
```

Yayın çıktısındaki `objectChanges` alanından şu ID'leri kopyala:

| Nesne | Nereden Bulunur |
|-------|-----------------|
| **Package ID** | `"type": "published"` kaydı |
| **ContestantRegistry ID** | `competition::ContestantRegistry` shared nesnesi |
| **RewardRegistry ID** | `reward::RewardRegistry` shared nesnesi |
| **UpgradeCap ID** | `0x2::package::UpgradeCap` nesnesi |
| **DeveloperCap ID** | `competition::DeveloperCap` nesnesi |

### 4 — Ortam Değişkenlerini Ayarla

```bash
cd frontend
cp .env.example .env
```

`.env` dosyasını bir önceki adımda aldığın ID'lerle doldur:

```env
VITE_NETWORK=localnet             # veya testnet

VITE_PACKAGE_ID=0x...
VITE_REGISTRY_ID=0x...
VITE_REWARD_REGISTRY_ID=0x...
VITE_DEVELOPER_CAP_ID=0x...
VITE_UPGRADE_CAP_ID=0x...
VITE_DEVELOPER_ADDRESS=0x...
```

### 5 — Frontend'i Başlat

```bash
npm install
npm run dev
```

Tarayıcında `http://localhost:5173` adresini aç.

> **Not:** Node.js `>=18` ve Sui CLI yüklü olmalıdır. Testnet kullanıyorsan cüzdanın yerleşik faucet'ini kullanabilirsin.

---

## 📁 Proje Yapısı

```
fulcrum/
├── blockchain/             ← Move akıllı kontratları
│   ├── sources/
│   │   ├── competition.move    ← Yarışma, rol ve takım mantığı
│   │   └── reward.move         ← REWARD coin basımı ve dağıtımı
│   └── Move.toml
│
└── frontend/               ← React + Vite arayüzü
    ├── src/
    │   ├── components/         ← UI bileşenleri
    │   ├── pages/              ← Sponsor & Yarışmacı panelleri
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

---

## 🌐 Akıllı Kontrat Uç Noktaları

| İşlev | Modül | Açıklama |
|-------|-------|----------|
| `register_contestant` | `competition` | Yarışmacı kaydı |
| `register_sponsor` | `competition` | Sponsor kaydı |
| `create_competition` | `competition` | Yarışma oluşturma + REWARD basımı |
| `create_team` | `competition` | Kayıtlı yarışmacılardan takım oluşturma |
| `vote` | `competition` | Jüri oyu kullanma |
| `distribute_prize` | `reward` | Ödülü kazanan takıma eşit dağıtma |
| `mint_reward` | `reward` | Özel REWARD token basımı |

---

## 🔐 Güvenlik

- **Değiştirilemez Kayıtlar:** Tüm yarışma verileri, oylar ve ödül işlemleri Sui blockchain üzerinde kalıcı olarak saklanır
- **Rol Tabanlı Erişim:** `DeveloperCap` ve `SponsorCap` ile yalnızca yetkili adresler kritik işlemleri gerçekleştirebilir
- **Şeffaf Ödül Dağıtımı:** Ödül miktarı yarışma oluşturulduğunda kilitlenir; kazananlar arasında kontrat tarafından otomatik bölünür
- **İmzalı İşlemler:** Tüm kullanıcı eylemleri Programmable Transaction Block (PTB) ile cüzdan imzası gerektirir

---

## 🎮 Test Akışı

1. **Cüzdan Bağla** — Sağ üstteki bağlan butonuna tıkla; ağın `.env`'deki `VITE_NETWORK` ile eşleştiğinden emin ol.
2. **Token Al** — Testnet'te cüzdanın yerleşik faucet'ini, Localnet'te `sui client faucet` komutunu kullan.
3. **Yarışmacı Akışı:**
   - *Contestant Dashboard*'a git ve yarışmacı olarak kayıt ol.
4. **Sponsor Akışı:**
   - *Sponsor Dashboard*'a git ve sponsor olarak kayıt ol.
   - Yarışma oluştur — kural ve ödül miktarını belirle; kontrat REWARD token'larını otomatik basar ve kilitler.
   - Kayıtlı yarışmacıların adresleriyle takımlar oluştur.
   - Ödülü dağıt — UI takım üyelerini otomatik çeker ve REWARD coin'lerini eşit böler.

---

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| Move (Sui) | Akıllı kontrat geliştirme |
| React + Vite | Arayüz geliştirme |
| @mysten/dapp-kit | Cüzdan bağlantısı ve PTB yönetimi |
| @mysten/sui SDK | Blockchain sorgulama ve işlem gönderme |
| Radix UI Themes | UI bileşen kütüphanesi |
| Sui Localnet / Testnet | Geliştirme ve test ortamı |

---

## 📝 Lisans

Bu yazılım **[Sude Naz Karayıldırım](https://github.com/skarayil)** tarafından geliştirilmiştir.
Tüm fikri ve hukuki hakları saklıdır. © 2026

---

<div align="center">

## 👩‍💻 Created by Sude Naz Karayıldırım

[![GitHub](https://img.shields.io/badge/GitHub-skarayil-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/skarayil)
[![42 Profile](https://img.shields.io/badge/42%20Profile-skarayil-black?style=flat-square&logo=42&logoColor=white)](https://profile.intra.42.fr/users/skarayil)

**⭐ Eğer bu proje işinize yaradıysa, repo'ya star vermeyi unutmayın!**

<sub>© 2026 Sude Naz Karayıldırım • FULCRUM — Merkeziyetsiz Hackathon Platformu • github.com/skarayil</sub>

</div>
