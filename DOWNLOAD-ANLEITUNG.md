# 🎮 Letshugotv Twitch Tracker - Download & Upload Anleitung

## 📥 WELCHE DATEI BRAUCHST DU?

**NUR EINE einzige Datei:** `index.html`

Diese Datei enthält ALLES:
- ✅ Das komplette Design (CSS)
- ✅ Alle Funktionen (JavaScript)
- ✅ Alle Diagramme und Grafiken
- ✅ Die komplette Webseite

---

## 🔽 SCHRITT 1: Datei herunterladen

### In dieser Demo-Umgebung:

1. Klicke oben rechts auf **"Preview"** oder **"Open in new tab"**
2. Wenn die Seite geladen ist, drücke **STRG + S** (Windows) oder **CMD + S** (Mac)
3. Speichere die Datei als **`index.html`** auf deinem Computer
4. Wähle als Speicherort z.B. deinen **Desktop** oder **Downloads-Ordner**

### Alternative (falls STRG+S nicht funktioniert):
1. Rechtsklick auf die Seite
2. Wähle **"Seite speichern unter..."** oder **"Save page as..."**
3. Speichere als `index.html`

---

## 🌐 SCHRITT 2: GitHub Account erstellen (falls noch nicht vorhanden)

1. Öffne **[github.com](https://github.com)** in deinem Browser
2. Klicke oben rechts auf **"Sign up"**
3. Gib deine **E-Mail-Adresse** ein
4. Erstelle ein **Passwort**
5. Wähle einen **Benutzernamen** (z.B. `letshugotv-tracker`)
6. Bestätige deine E-Mail-Adresse

---

## 📦 SCHRITT 3: Repository (Projekt) erstellen

1. Gehe zu **[github.com/new](https://github.com/new)** (oder klicke auf das **+** oben rechts → "New repository")

2. Fülle das Formular aus:
   - **Repository name:** `twitch-tracker`
   - **Description:** `Twitch Tracker für Letshugotv` (optional)
   - ✅ Wähle **"Public"** (wichtig für GitHub Pages!)
   - ❌ **NICHT ankreuzen:** "Add a README file"
   - ❌ **NICHT ankreuzen:** "Add .gitignore"
   - ❌ **NICHT ankreuzen:** "Choose a license"

3. Klicke auf den grünen Button **"Create repository"**

---

## 📤 SCHRITT 4: Datei hochladen

Nach dem Erstellen des Repositories siehst du eine Seite mit verschiedenen Optionen.

1. Suche den Text **"uploading an existing file"** und klicke darauf
   
   (Oder der direkte Link: `github.com/DEIN-USERNAME/twitch-tracker/upload/main`)

2. Es öffnet sich eine Upload-Seite mit einem großen Bereich

3. **Drag & Drop:** Ziehe deine `index.html` Datei vom Desktop in diesen Bereich
   
   ODER klicke auf **"choose your files"** und wähle die Datei aus

4. Warte bis der Upload fertig ist (grüner Haken erscheint)

5. Scrolle nach unten und klicke auf den grünen Button **"Commit changes"**

---

## ⚙️ SCHRITT 5: GitHub Pages aktivieren

1. Klicke oben auf **"Settings"** (das Zahnrad-Symbol)

2. Scrolle im linken Menü nach unten und klicke auf **"Pages"**

3. Bei **"Source"** siehst du ein Dropdown-Menü

4. Klicke auf das Dropdown und wähle **"main"** (oder "master")

5. Lass den Ordner auf **"/ (root)"** stehen

6. Klicke auf **"Save"**

7. **⏳ Warte 1-2 Minuten**

8. Lade die Seite neu (F5)

9. Oben erscheint jetzt eine grüne Box mit deiner URL! 🎉

---

## 🎊 FERTIG!

Deine Webseite ist jetzt live unter:

```
https://DEIN-USERNAME.github.io/twitch-tracker/
```

**Beispiel:** Wenn dein GitHub-Username `gamer123` ist:
```
https://gamer123.github.io/twitch-tracker/
```

---

## 🔧 ECHTE DATEN AKTIVIEREN (Optional - Fortgeschritten)

Die Webseite zeigt erstmal **Demo-Daten**. Um echte Twitch-Daten zu sehen:

### Twitch API einrichten:

1. Gehe zu **[dev.twitch.tv](https://dev.twitch.tv)**
2. Logge dich mit deinem Twitch-Account ein
3. Klicke auf **"Your Console"** → **"Applications"** → **"Register Your Application"**
4. Fülle aus:
   - **Name:** `Letshugotv Tracker`
   - **OAuth Redirect URLs:** `http://localhost`
   - **Category:** `Website Integration`
5. Klicke **"Create"**
6. Du erhältst eine **Client ID** und kannst ein **Client Secret** generieren

### Firebase einrichten:

1. Gehe zu **[console.firebase.google.com](https://console.firebase.google.com)**
2. Klicke auf **"Projekt erstellen"**
3. Nenne es `twitch-tracker`
4. Gehe zu **"Build"** → **"Realtime Database"**
5. Klicke **"Datenbank erstellen"** → Wähle einen Standort → **"Im Testmodus starten"**

### Keys in die Webseite einfügen:

⚠️ **WICHTIG:** Bei einer reinen Frontend-Lösung sind API-Keys im Code sichtbar!

Für eine sichere Lösung brauchst du ein Backend (z.B. Firebase Functions).

---

## ❓ HÄUFIGE PROBLEME

### "Seite lädt nicht"
- Warte 2-3 Minuten nach dem Aktivieren von GitHub Pages
- Leere deinen Browser-Cache (STRG + SHIFT + R)

### "404 Not Found"
- Stelle sicher, dass deine Datei genau `index.html` heißt (nicht `index.html.txt`)
- Prüfe ob GitHub Pages auf "main" eingestellt ist

### "Nur weißer Hintergrund"
- Öffne die Browser-Konsole (F12) und schaue nach Fehlern
- Stelle sicher, dass die komplette Datei hochgeladen wurde

---

## 📞 SUPPORT

Bei Fragen kannst du auf GitHub ein "Issue" erstellen oder im Twitch-Chat von Letshugotv nachfragen!

---

**gecoded von socken** 🧦
