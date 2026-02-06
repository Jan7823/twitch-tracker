# 📥 Download & Upload Anleitung für Letshugotv Twitch Tracker

## 🎯 Was du brauchst

Nach dem Build wird **EINE einzige Datei** erstellt: `dist/index.html`
Diese Datei enthält ALLES (HTML, CSS, JavaScript) - super einfach!

---

## 📁 Schritt 1: Die Datei herunterladen

### Option A: Aus dieser Demo-Umgebung

1. Klicke oben rechts auf den **"Preview"** oder **"Export"** Button
2. Die Seite bietet dir einen Download an
3. Du bekommst die `index.html` Datei

### Option B: Falls du den Code lokal hast

Nach `npm run build` findest du die Datei hier:
```
dein-projekt/
└── dist/
    └── index.html   ← NUR diese Datei brauchst du!
```

---

## 🚀 Schritt 2: GitHub Account erstellen (falls noch nicht vorhanden)

1. Gehe zu **[github.com](https://github.com)**
2. Klicke auf **"Sign up"** (oben rechts)
3. Gib deine E-Mail, ein Passwort und einen Benutzernamen ein
4. Bestätige deine E-Mail-Adresse

---

## 📦 Schritt 3: Neues Repository erstellen

1. Gehe zu **[github.com/new](https://github.com/new)**
   
2. Fülle aus:
   - **Repository name:** `twitch-tracker` (oder wie du willst)
   - **Description:** `Twitch Tracker für Letshugotv` (optional)
   - ✅ Wähle **Public** (muss öffentlich sein für GitHub Pages)
   - ❌ NICHT ankreuzen: "Add a README file"
   
3. Klicke auf **"Create repository"**

---

## 📤 Schritt 4: Dateien hochladen (Drag & Drop)

Auf der neuen Repository-Seite siehst du Optionen. Folge diesen Schritten:

1. Du siehst den Text: **"…or upload an existing file"**
   Klicke auf den blauen Link **"uploading an existing file"**

2. Es öffnet sich eine Upload-Seite:
   ```
   ┌─────────────────────────────────────────┐
   │                                         │
   │   Drag files here to add them, or      │
   │   click "choose your files"            │
   │                                         │
   └─────────────────────────────────────────┘
   ```

3. **Ziehe deine `index.html` Datei** direkt in dieses Feld
   ODER klicke auf "choose your files" und wähle die Datei aus

4. Warte bis der Upload fertig ist (grünes Häkchen erscheint)

5. Unten auf der Seite:
   - Bei "Commit changes" kannst du einfach den Standard-Text lassen
   - Klicke auf den grünen Button **"Commit changes"**

---

## 🌐 Schritt 5: GitHub Pages aktivieren

1. In deinem Repository, klicke oben auf **"Settings"** (Zahnrad-Symbol)
   ```
   Code | Issues | Pull requests | Actions | Projects | Wiki | Security | Insights | ⚙️ Settings
   ```

2. Im linken Menü, scrolle runter und klicke auf **"Pages"**
   ```
   ├── General
   ├── Access
   ├── Code and automation
   │   ├── Actions
   │   ├── ...
   │   └── Pages        ← HIER KLICKEN
   ```

3. Unter **"Build and deployment"**:
   - **Source:** Wähle **"Deploy from a branch"**
   - **Branch:** Wähle **"main"** und daneben **"/ (root)"**
   - Klicke auf **"Save"**

4. **Warte 1-3 Minuten** - GitHub baut deine Seite auf

5. Aktualisiere die Settings-Seite (F5)

6. Oben erscheint jetzt:
   ```
   ┌────────────────────────────────────────────────────────────┐
   │ 🎉 Your site is live at:                                  │
   │    https://DEIN-USERNAME.github.io/twitch-tracker/        │
   └────────────────────────────────────────────────────────────┘
   ```

7. **Klicke auf den Link** - deine Webseite ist online! 🎊

---

## 📝 Schritt 6: API-Keys einrichten (Für echte Daten)

Da wir eine "Single-File" App haben, musst du die Konfiguration VOR dem Build ändern. 

### ⚠️ Wichtig bei reinen Frontend-Apps:
- Jeder kann über F12 (DevTools) deinen Code sehen
- Für private Projekte ist das OK
- Für maximale Sicherheit braucht man ein Backend

### So änderst du die Keys:

Falls du den Quellcode hast und selbst builden möchtest:

1. Öffne `src/config/firebase.ts` und ersetze:
   ```javascript
   const firebaseConfig = {
     apiKey: "DEIN_ECHTER_API_KEY",
     authDomain: "DEIN-PROJEKT.firebaseapp.com",
     databaseURL: "https://DEIN-PROJEKT-default-rtdb.europe-west1.firebasedatabase.app",
     projectId: "DEIN-PROJEKT",
     // ... etc
   };
   ```

2. Öffne `src/config/twitch.ts` und ersetze:
   ```javascript
   export const TWITCH_CONFIG = {
     clientId: "DEINE_ECHTE_CLIENT_ID",
     clientSecret: "DEIN_ECHTES_CLIENT_SECRET",
     channelName: "letshugotv",
   };
   ```

3. Führe `npm run build` aus

4. Lade die neue `dist/index.html` zu GitHub hoch

---

## 🔄 Wie aktualisiere ich die Seite später?

1. Gehe zu deinem Repository auf GitHub
2. Klicke auf die `index.html` Datei
3. Klicke oben rechts auf das **Stift-Symbol** (Edit)
4. Lösche alles und füge den neuen Code ein
5. ODER: Klicke auf "Add file" → "Upload files" und lade die neue Datei hoch
6. Klicke auf **"Commit changes"**
7. Die Seite aktualisiert sich automatisch nach 1-2 Minuten

---

## 🎨 Zusammenfassung

| Was | Wo |
|-----|-----|
| **Deine Webseite** | `https://DEIN-USERNAME.github.io/twitch-tracker/` |
| **Repository** | `https://github.com/DEIN-USERNAME/twitch-tracker` |
| **Einstellungen** | Repository → Settings → Pages |

---

## ❓ Häufige Probleme

### "404 - File not found"
- Warte 2-3 Minuten und aktualisiere
- Prüfe ob die Datei wirklich `index.html` heißt (klein geschrieben!)

### Seite lädt nicht richtig
- Drücke `Strg + Shift + R` (Hard Refresh)
- Prüfe in den DevTools (F12) auf Fehler

### Änderungen werden nicht angezeigt
- GitHub Pages braucht manchmal 5 Minuten zum Aktualisieren
- Lösche Browser-Cache (`Strg + Shift + Entf`)

---

## 🎉 Fertig!

Du hast jetzt einen funktionierenden Twitch-Tracker online!

**gecoded von socken** 💜
