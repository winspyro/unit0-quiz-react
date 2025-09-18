# Verifica Interattiva – Unità 0 (Vite + React + Tailwind)

## Avvio in locale
1. **Installa Node.js** (consigliato LTS). Su Windows, se PowerShell blocca gli script: apri PowerShell come amministratore e lancia  
   `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` poi conferma con `S`.

2. Apri un terminale nella cartella del progetto e lancia:

```bash
npm install
npm run dev
```
3. Apri l'URL indicato (tipicamente `http://localhost:5173`).

## Build di produzione
```bash
npm run build
npm run preview
```

## Pubblicazione rapida
- **Netlify**: importa repo Git o usa *Drag & Drop* della cartella `dist/`. Build command: `npm run build`, Publish directory: `dist`.
- **GitHub Pages**: crea una repo, fai push del progetto. Aggiungi un workflow o usa uno strumento come `gh-pages` (opzionale).

Buon lavoro! ✨

---

## Pubblicazione su **GitHub Pages** (workflow automatico)
1. Crea una nuova repository su GitHub (es. `unit0-quiz-react`), **inizialmente vuota**.
2. Esegui il push del codice:
   ```bash
   git init
   git add .
   git commit -m "feat: verifica interattiva unita 0"
   git branch -M main
   git remote add origin https://github.com/<TUO-UTENTE>/<NOME-REPO>.git
   git push -u origin main
   ```
3. Vai su **Settings → Pages** e assicurati che la **Source** sia impostata su "GitHub Actions".
4. Ogni push su `main` attiverà il workflow `.github/workflows/deploy.yml` che:
   - installa le dipendenze,
   - esegue `npm run build`,
   - pubblica la cartella `dist` su GitHub Pages.
5. L'app sarà raggiungibile a un URL del tipo: `https://<TUO-UTENTE>.github.io/<NOME-REPO>/`.

> Nota tecnica: il file `vite.config.js` imposta automaticamente il `base` a `/<NOME-REPO>/` durante il build su GitHub Actions, e a `/` in locale.
