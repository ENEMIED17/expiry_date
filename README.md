# 🍫 Vending Watch

**Vending Watch** è un’applicazione SaaS che aiuta a monitorare le **scadenze dei prodotti nei distributori automatici**, evitando sprechi e segnalando in tempo reale agli operatori quali prodotti stanno per scadere.

## 🚀 Funzionalità principali

- 📍 **Mappa dinamica dei distributori**: ogni distributore è visualizzato su mappa con un colore che cambia in base alle scadenze imminenti.  
- 📷 **Scansione prodotti**: l’operatore può scansionare il prodotto con la fotocamera, inserire la data di scadenza e associarlo al distributore.  
- 🗂️ **Gestione prodotti**: possibilità di inserire manualmente informazioni come nome, descrizione e immagini del prodotto.  
- 🔔 **Alert intelligenti**: notifiche e avvisi automatici quando un prodotto sta per scadere.  
- 🔎 **Filtri di ricerca avanzati**: l’operatore può cercare per distributore, prodotto o data di scadenza.  
- ☁️ **Backend centralizzato**: gestione dati su server, integrato con autenticazione e database.  

## 🛠️ Tecnologie utilizzate

- **Frontend**: React + TailwindCSS  
- **Backend**: Node.js / Express  
- **Database**: PostgreSQL (ex Supabase → ora sostituito con backend dedicato)  
- **Autenticazione**: JWT-based auth  
- **Mappa interattiva**: Leaflet.js  

## 📦 Installazione

Clona il repository:  

```bash
git clone https://github.com/tuo-utente/vending-watch.git
cd vending-watch
```

Installa le dipendenze:  

```bash
npm install
```

Avvia l’ambiente di sviluppo:  

```bash
npm run dev
```

## ⚙️ Configurazione

Crea un file `.env` nella root del progetto con le seguenti variabili:  

```env
DATABASE_URL=postgres://user:password@host:5432/vendingwatch
JWT_SECRET=tuo_segreto
PORT=3000
```

## 🗺️ Workflow tipico

1. L’operatore accede all’app e seleziona il distributore dalla mappa.  
2. Scansiona i prodotti inserendo la data di scadenza.  
3. I dati vengono salvati nel backend e sincronizzati.  
4. La mappa mostra in tempo reale i distributori con prodotti in scadenza.  
5. Gli alert notificano l’operatore quando è necessario intervenire.  

## 📌 Roadmap

- [ ] Dashboard avanzata con statistiche di scadenze.  
- [ ] Report PDF esportabili per l’azienda.  
- [ ] Integrazione con API IoT dei distributori.  
- [ ] Notifiche push mobile.  

---