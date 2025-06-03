# WorQ - Coworking Space Management Platform

![WorQ Logo](https://via.placeholder.com/150x50?text=WorQ-Logo) <!-- Sostituisci con il logo reale -->

WorQ è una piattaforma digitale che connette professionisti in cerca di spazi di coworking con gestori che offrono tali servizi. L'applicazione offre un'esperienza completa dalla ricerca alla prenotazione degli spazi, con funzionalità differenziate per clienti e agenzie.

## 🚀 Funzionalità principali

### Per Clienti
- ✅ Registrazione/Login con diversi provider (Google/GitHub) o credenziali
- 🔍 Esplorazione degli spazi di coworking disponibili
- 📅 Prenotazione di postazioni negli orari desiderati
- ✍️ Lasciare recensioni sugli spazi utilizzati
- 🗂 Gestione delle prenotazioni dal proprio profilo

### Per Agenzie
- 🏢 Registrazione come gestore verificato
- ➕ Aggiunta di nuovi spazi di coworking (con foto, servizi, descrizioni)
- ✏️ Modifica/Gestione degli spazi pubblicati
- 👀 Visualizzazione delle prenotazioni ricevute

## 🛠 Tecnologie utilizzate

### Frontend
- **Next.js** - Framework React per rendering ibrido (SSR/SSG)
- **TypeScript** - Tipizzazione statica per codice più robusto
- **PWA** (Progressive Web App) - Esperienza mobile simile a un'app nativa
- **Font Awesome** - Libreria di icone
- **Design Responsive** - Adattabile a tutti i dispositivi

### Backend
- **Next.js API Routes** - Endpoint API integrati
- **Prisma** - ORM moderno per il database
- **SQLite** - Database relazionale embedded (per sviluppo)
- **Auth.js** - Soluzione di autenticazione completa
  - Provider multipli (Google/GitHub + Credenziali)
  - Hashing password con bcrypt

### Strumenti di sviluppo (TO-DO)
- Prisma Studio - Interfaccia visiva per il DB
- Sistema di migrazioni integrato

## 🏗 Architettura (TO-DO)

L'applicazione segue un'architettura monolitica con separazione chiara dei concern:

## 🔐 Autenticazione
Implementato con **Auth.js** (NextAuth) supporta:
- **OAuth:** Google, GitHub
- **Credentials:** Email + Password (con hashing bcrypt)
- **Ruoli:** Differenziazione Client/Agency tramite campo role

**Flusso tipico:**
1) Utente si registra per la prima volta con Google / GitHub.
2) Auth.js verifica credenziali/provider.
3) Se OK,  lo reindirizza all'endpoint /complete-profile dove l'utente può completare il suo profilo scegliendo il proprio ruolo e inserendo i dati mancanti (il form visualizzato è dipendente dalla scelta del ruolo).
4) Viene creata la sessione e l'utente è reindirizzato alla homepage.

## 📱 PWA Implementation (TO-DO)
- **manifest.json:** Definisce nome, tema, icone
- **Service Worker:**
    - Cache strategica per prestazioni offline
    - Background sync per eventuali sync future
- **Installabile** su dispositivi mobile/desktop

## 🛠 Comandi utili

```bash
# Avvia l'applicazione in sviluppo
npm run dev

# Accedi al DB visivamente
npx prisma studio

# Resetta il DB (con seed iniziale)
npx prisma migrate reset

# Genera nuove migrazioni
npx prisma migrate dev --name "descrizione_modifica"
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributori
- **Forconi Leonardo** (mat. 122824)
- **Marsili Davide** (mat. 123284)
- **Medei Chiara** (mat. 123285)

## Licenza 
Distribuito sotto licenza MIT.