# 🍣 Sushi Blended Express Frontend

## 🇨🇿 Čeština

🇨🇿 Popis projektu
SushiMax.cz
SushiMax.cz je moderní webová aplikace pro online objednávky restaurace SushiMax v České republice.
Projekt byl kompletně navržen a vyvinut s důrazem na výkon, bezpečnost, jednoduchou správu a budoucí rozšiřitelnost. Zákazníkům umožňuje pohodlně objednávat jídlo online, zatímco všechny objednávky jsou automaticky synchronizovány se systémem Poster POS prostřednictvím Poster API.
Použité technologie

Frontend
Next.js
React
TypeScript
Tailwind CSS
Axios
Backend
Node.js
Express.js
TypeScript
REST API
Poster API Integration
Nodemailer
Infrastructure
Ubuntu Server
Hetzner Cloud
Nginx (Reverse Proxy)
PM2
Git & GitHub
Let's Encrypt SSL

Hlavní vlastnosti
Moderní responzivní uživatelské rozhraní
Integrace s Poster API
Online objednávkový systém
Správa produktů, kategorií a modifikátorů
Automatické zpracování objednávek
Připravená podpora Poster Webhooks
E-mailová oznámení zákazníkům
SEO optimalizace
Bezpečný provoz s HTTPS
Vysoký výkon díky serveru Hetzner
Projekt využívá architekturu Frontend + Backend, kde frontend komunikuje výhradně přes REST API backendu. Celá aplikace je provozována na vlastním serveru Hetzner a spravována pomocí PM2.
Cílem projektu je vytvořit moderní, rychlou, bezpečnou a dlouhodobě udržitelnou platformu pro online objednávky restaurace SushiMax.

Moderní frontend aplikace pro online objednávání sushi postavená pomocí **Next.js**, **TypeScript** a **Zustand**. Aplikace umožňuje prohlížení menu, správu košíku, autentizaci uživatelů a vytvoření objednávky.

### 🚀 Funkce

- Registrace / přihlášení uživatelů
- JWT autentizace
- Obnovení session pomocí refresh token
- Zobrazení menu a detail produktu
- Produktové modální okno (intercepting routes)
- Nákupní košík
- Checkout formulář
- Odesílání objednávky na backend API
- Email notifikace přes backend
- Dark / Light theme
- Responzivní design
- SEO metadata

### ⚙️ Instalace

```bash
git clone https://github.com/SerhiiYemets/sushi-blended-express-frontend.git
cd sushi-blended-express-frontend
npm install
Environment variables

Vytvoř .env.local:
NEXT_PUBLIC_API_URL=https://sushi-blended-express.onrender.com

Spuštění
npm run dev
Produkce

Frontend deploy:
https://sushi-blended-express-frontend.vercel.app

🇬🇧 English

SushiMax.cz
SushiMax.cz is a modern online food ordering platform developed for the SushiMax restaurant in the Czech Republic.
The project was designed and built with a strong focus on performance, security, maintainability, and long-term scalability. Customers can easily place online orders, while all orders are automatically synchronized with the Poster POS system through the Poster API.
Technologies Used

Frontend
Next.js
React
TypeScript
Tailwind CSS
Axios
Backend
Node.js
Express.js
TypeScript
REST API
Poster API Integration
Nodemailer
Infrastructure
Ubuntu Server
Hetzner Cloud
Nginx (Reverse Proxy)
PM2
Git & GitHub
Let's Encrypt SSL
Key Features
Modern responsive user interface
Poster API integration
Online ordering system
Product, category, and modifier management
Automated order processing
Poster Webhooks support
Customer email notifications
SEO optimization
Secure HTTPS deployment
High-performance hosting on Hetzner

The application follows a Frontend + Backend architecture, where the frontend communicates exclusively through the backend REST API. The entire infrastructure is hosted on a dedicated Hetzner server and managed using PM2.
The goal of the project is to provide a fast, secure, reliable, and scalable online ordering platform that can be maintained and expanded for many years.

Modern frontend application for online sushi ordering built with Next.js, TypeScript, and Zustand. The app supports menu browsing, shopping cart management, user authentication, and checkout flow.

🚀 Features
User registration / login
JWT authentication
Session refresh via refresh token
Menu browsing and product details
Product modal routing (intercepting routes)
Shopping cart
Checkout form
Order submission to backend API
Email notifications via backend
Dark / Light theme
Responsive design
SEO metadata

⚙️ Installation
git clone https://github.com/SerhiiYemets/sushi-blended-express-frontend.git
cd sushi-blended-express-frontend
npm install
Environment variables

Create .env.local:
NEXT_PUBLIC_API_URL=https://sushi-blended-express.onrender.com

Run locally
npm run dev
Production

Frontend deployment:
https://sushi-blended-express-frontend.vercel.app