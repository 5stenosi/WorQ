# WorQ - Coworking Space Management Platform

<table>
  <tr>
    <td width="110" valign="middle" align="center">
      <img src="https://i.imgur.com/42ZkNWN.png" alt="WorQ Logo" style="aspect-ratio:1/1; width:100px; height:100px; object-fit:contain; border-radius:8px;" />
    </td>
    <td>
      WorQ è una piattaforma digitale che connette professionisti in cerca di spazi di coworking con gestori che offrono tali servizi. L'applicazione offre un'esperienza completa dalla ricerca alla prenotazione degli spazi, con funzionalità differenziate per clienti e agenzie.
    </td>
  </tr>
</table>

## 🚀 Funzionalità principali

- ✅ Registrazione/Login con diversi provider (Google/GitHub) o credenziali
- 🔍 Esplorazione degli spazi di coworking disponibili
- 🗺️ Consultazione spazi nella mappa

### Per Clienti

- 📅 Prenotazione di postazioni nei giorni desiderati
- ✍🏻 Lasciare recensioni sugli spazi utilizzati
- 🗂 Gestione delle prenotazioni dal proprio profilo

### Per Agenzie
- 🏢 Registrazione come azienda verificata
- ➕ Aggiunta di nuovi spazi di coworking (con foto, servizi, descrizioni)
- ✏️ Modifica/Gestione degli spazi pubblicati

## 🛠 Tecnologie utilizzate
- **Next.js** - Framework React per rendering ibrido
- **TypeScript** - Tipizzazione statica per codice più robusto

### Frontend
- **Font Awesome** - Libreria di icone
- **Design Responsive** - Adattabile a tutti i dispositivi
- **Tailwind** - Framework CSS
- **Tailwind Rombo** - Libreria di animazioni
- **Toastify** - Libreria di notifiche

### Backend
- **Next.js API Routes** - Endpoint API integrati
- **Nominatim API** - Integrazione per geocodifica e ricerca indirizzi/spazi tramite OpenStreetMap
- **Prisma** - ORM moderno per il database
- **SQLite** - Database relazionale embedded (per sviluppo)
- **Auth.js** - Soluzione di autenticazione completa
  - Provider multipli (Google/GitHub + Credenziali)
  - Hashing password con bcrypt

## 🏗️ Architettura 

L'applicazione è organizzata secondo una struttura modulare e scalabile basata su Next.js (App Router), Prisma come ORM, e include supporto PWA. Di seguito una panoramica dei principali folder e file:
- **/prisma/:** contiene la definizione dello schema del database e uno script di seeding iniziale
- **/public/:** include risorse statiche accessibili pubblicamente, come icone, immagini e file PWA (es. manifest.json, offline.html).
- **/src/app/:** struttura principale dell’app basata su App Router. Contiene:
  - **api/:** route backend/API handler (es. auth, bookings, spaces, reviews, forgot-password, ecc.).
  - **login/, register/, profile/, reset-password/:** route frontend dell’interfaccia utente.
  - **layout.tsx:** layout generale dell’app (navbar, struttura della pagina).
  - **page.tsx:** pagina principale (homepage).
  - **globals.css:** file globale di stile.
- **/src/components/:** componenti riutilizzabili dell’interfaccia (es. form, card, modali, ecc.).
- **/src/lib/:** contiene utility e funzioni condivise (ad esempio prisma.ts per il client Prisma, mail.ts per l'invio delle email e zod.ts per la validazione degli input).
- **/src/types/:** definizioni TypeScript condivise, ad esempio interfacce dei dati o tipi personalizzati.
- **/src/auth.ts:** configurazione dell'autenticazione (Auth.js).
- **/src/middleware.ts:** middleware applicativi per la protezione di route o gestione sessione lato server.
- **.env:** file di variabili ambiente per configurazioni sensibili (es. DB URL, chiavi API).

## 🔐 Autenticazione
Implementata con **Auth.js** (NextAuth) supporta:
- **OAuth:** Google, GitHub
- **Credentials:** Email + Password (con hashing bcrypt)
- **Ruoli:** Differenziazione Client/Agency tramite campo role

**🔑 Flusso tipico Autenticazione con OAuth:**
1) Utente si registra per la prima volta con Google / GitHub.
2) Auth.js verifica credenziali/provider.
3) Se OK,  lo reindirizza all'endpoint /complete-profile dove l'utente può completare il suo profilo scegliendo il proprio ruolo e inserendo i dati mancanti (il form visualizzato è dipendente dalla scelta del ruolo).
4) Viene creata la sessione e l'utente è reindirizzato alla homepage.

## 📱 PWA Implementation
- **manifest.json:** Definisce nome, icone, modalità di visualizzazione, permettendo agli utenti di aggiungere il sito alla schermata home con un'icona dedicata.
- **Service Worker:**
    - Caching strategico di risorse statiche e dinamiche per caricamento rapido delle pagine e prestazioni offline
    - In assenza di connessione e quando una risorsa non è in cache, viene mostrata una pagina offline personalizzata
- **Installabile** su dispositivi mobile e desktop

## 🛠️ Comandi utili

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

Apri [http://localhost:3000](http://localhost:3000) con il tuo browser per vedere i risultati.

## 🫱🏼‍🫲🏼 Contributori
- **Forconi Leonardo** (mat. 122824)
- **Marsili Davide** (mat. 123284)
- **Medei Chiara** (mat. 123285)

## Licenza 
Distribuito sotto licenza MIT.