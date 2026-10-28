# DESIGN.md – Segelstück

Gestaltungssystem der Storefront. Trennt beobachtete Referenzmuster von eigenen Entscheidungen.

## Referenz (beobachtet)

Quelle: https://freitag.ch/de_CH/products/bags, angesehen am 27.10.2026 (laut Entwurf).
Beobachtet wurden nur zwei Muster: ein strenges Produktraster und sachliche Produktbeschriftungen.
Schriften, CSS-Werte, Abstände, Mobilansicht und Interaktionen der Referenz wurden nicht untersucht
und werden hier nicht behauptet. Logo, Name, Texte und Bilder der Referenz werden nicht verwendet.

## Eigene Entscheidungen

**Farben** (Tokens in `apps/storefront/tailwind.config.js` und `src/styles/globals.css`)

| Token | Wert | Einsatz |
| --- | --- | --- |
| `segel` | `#F3F0E8` | Seitenhintergrund („Segelweiß“) |
| `papier` | `#FBFAF6` | Flächen, Formularfelder, Hinweiskästen |
| `ink` | `#111111` | Text, Linien, Primärbutton |
| `ink-soft` | `#4A4A45` | Sekundärtext (Kontrast auf `segel` ca. 8:1) |
| `blau` | `#1F4FA3` | Akzent: „Verfügbar“, Demo-Hinweise, Hover, Fokus |

Das Blau ist eine eigene Annäherung an die blauen Zeichen auf dem im Entwurf beschriebenen Foto.
Die Medusa-UI-Variablen (`--fg-base`, `--bg-base` usw.) werden auf diese Tokens umgebogen,
damit auch unveränderte Starter-Komponenten passen.

**Typografie:** Archivo (Google Fonts, SIL OFL) für Text und Überschriften; Überschriften in
Versalien, sehr fett, enge Laufweite. IBM Plex Mono (SIL OFL) für Kennzeichnungen wie
„Nr. SS-001“, „Verfügbar“, „Verkauft“.

**Raster und Linien:** 1-px-Linien in `ink` statt Schatten. Produktraster 1/2/3 Spalten
(Breakpoints `xsmall` 512 px, `small` 1024 px). Linien entstehen über Zellränder, damit
unvollständige Reihen hell bleiben. Keine abgerundeten Ecken.

**Komponenten:** `.label` (Mono, Versalien), `.display` (Überschriften), `.btn-primary`
(schwarz, Hover blau), `.btn-secondary` (Rahmen, Hover invertiert). Fokus: 3 px blauer Rahmen.

**Zustände:** Verfügbar = blaues Etikett. Verkauft = schwarzes Etikett, Bild in Graustufen,
Preis durchgestrichen, kein Kaufbutton. Beispielprodukt = umrandetes Etikett „Beispiel“.
Fehlende Angaben erscheinen kursiv als „Angabe folgt“, nie als erfundener Wert.

## Austauschbar

„Segelstück“ ist ein Arbeitstitel. Name in `src/lib/util/site.ts`, Navigation, Footer und
Metadaten (`src/app/layout.tsx`) ersetzen.
