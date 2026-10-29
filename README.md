# Segelstück – Demo-Shop für Taschen aus Segelstoff

Deutschsprachiger Shop für handgemachte Einzelstücke. Medusa 2 als Backend und
Verwaltung, Next.js als Shop-Oberfläche, PostgreSQL als Datenbank. „Segelstück“ ist ein
Arbeitstitel.

> **Nur Demo.** Testzahlung und Testversand, keine echten Zahlungen, kein Versand,
> keine E-Mails. Rechtstexte (Impressum, AGB, Datenschutz) fehlen bewusst und folgen vor
> einem echten Verkauf. Läuft der Shop öffentlich (siehe Coolify), gehören Impressum und
> Datenschutzerklärung trotzdem dazu.

## Voraussetzungen

- Node 24 (Projekt ist per `mise.toml` und `.node-version` auf 24.18.0 festgelegt)
- npm
- Docker (für PostgreSQL)

## Einrichten (einmalig)

```bash
npm run setup
```

Das Skript startet PostgreSQL, legt die lokalen `.env`-Dateien mit zufälligen Schlüsseln an,
führt die Migrationen aus, legt die Beispieltasche an, trägt den Publishable Key in die
Storefront ein und erstellt einen Admin-Zugang. Die Zugangsdaten stehen danach in
`.local/admin-zugang.txt` (nicht in Git). Das Skript kann gefahrlos erneut laufen: bestehende
Konfiguration, Produkte, Bestellungen und der Admin bleiben erhalten.

## Starten und Stoppen

```bash
docker compose up -d     # Datenbank (läuft nach einem Neustart des Rechners ggf. nicht)
npm run dev              # Backend und Shop zusammen
```

| Dienst | Adresse |
| --- | --- |
| Shop | http://localhost:8000 |
| Medusa-Verwaltung (Admin) | http://localhost:9000/app |
| PostgreSQL | localhost:55433 (nur lokal) |

Stoppen: `Strg+C` im Terminal, danach optional `docker compose stop`. Die Daten liegen im
Docker-Volume `segelstueck_segelstueck-pgdata` und bleiben bei Neustarts erhalten.
`docker compose down -v` löscht dieses Volume und damit alle Produkte und Bestellungen;
das ist kein normaler Neustart.

## Eine neue Tasche einstellen (Anleitung für die Verwaltung)

Jede physische Tasche ist ein eigenes Produkt mit genau einer Variante und Bestand 1.

1. http://localhost:9000/app öffnen und mit den Daten aus `.local/admin-zugang.txt` anmelden.
2. **Products → Create** wählen.
3. **Details:** Titel (z. B. „Segeltasche 002“), Beschreibung, Bilder hochladen.
   Der Handle (z. B. `segeltasche-002`) wird Teil der Adresse im Shop.
4. **Varianten:** Option z. B. „Ausführung“ mit dem Wert „Unikat“ anlegen, genau eine Variante.
   Bei der Variante:
   - **SKU** = Unikatnummer, z. B. `SS-002` (erscheint im Shop als „Nr. SS-002“)
   - **Manage inventory** an
   - **Allow backorders** aus
   - Preis in EUR
5. **Organisieren:** Verkaufskanal „Segelstueck Shop“ auswählen.
6. Status **Published** und speichern.
7. **Inventory** öffnen, die neue SKU wählen und am Standort „Werkstatt“ den Bestand auf **1**
   setzen. Ohne Bestand erscheint die Tasche als verkauft im Archiv.
8. Optional unter **Attributes**: Breite, Höhe, Tiefe in **cm** und Material. Unter
   **Metadata** kann `pflege` (Pflegehinweis) und `unikat_nr` stehen. Fehlende Angaben zeigt der
   Shop als „Angabe folgt“.

Nach dem Speichern ist die Tasche sofort im Shop sichtbar. Nach einer Bestellung ist die
Tasche reserviert: Im Admin unter **Inventory** steht dann „Stocked 1, Reserved 1“ (verfügbar 0).
Erst nach dem Versand (Fulfillment) sinkt der Lagerbestand auf 0. Im Shop gilt die Tasche
sofort als verkauft, wandert ins Archiv und kann nicht erneut bestellt werden.
**Achtung:** Wird die Bestellung im Admin storniert, wird die Reservierung frei und die Tasche
ist wieder kaufbar.

**Beispieltasche:** `segelstueck-001` zeigt echte Fotos einer Tasche, Preis und Text sind aber Platzhalter.
Preis und Text im Admin ersetzen oder das Produkt löschen. Ein gelöschtes
Beispielprodukt legt `npm run setup` nicht erneut an. Die Kennzeichnung „Beispiel“ und
„Demo-Preis“ hängt am Metadatum `beispiel: true`; für echte Taschen dieses Feld weglassen.

## Wie der Einzelstück-Schutz funktioniert

- Bestand 1, keine Nachbestellungen (`allow_backorder: false`).
- Der Warenkorb reserviert nichts. Erst der Bestellabschluss reserviert den Bestand; Medusa
  sperrt dabei pro Bestandsartikel, sodass von zwei gleichzeitigen Käufen nur einer gelingt.
- Shop, Warenkorb und Kasse lesen den Bestand immer frisch aus Medusa. Ist eine Tasche
  inzwischen verkauft, zeigt der Warenkorb einen Hinweis und sperrt die Kasse.
- Die Schutzmechanismen sind in der lokalen Einzelprozess-Demo getestet. Für einen Betrieb mit
  mehreren Backend-Instanzen braucht Medusa ein gemeinsames Locking (z. B. Redis); das gehört
  zum späteren Live-Schritt.

## Auf Coolify betreiben

`docker-compose.prod.yaml` startet alles in einem Stack: PostgreSQL, Medusa-Backend mit
Admin und den Shop. Die Images werden aus diesem Repository gebaut.

1. In Coolify: **+ New → Application → (Public/Private) Repository** wählen, Branch angeben,
   Build Pack **Docker Compose**, Compose-Pfad `/docker-compose.prod.yaml`.
2. Domains pro Service eintragen. Die Portangabe sagt Coolify, wohin es weiterleitet:
   - `storefront`: `https://by-rehbein.robinrehbein.de:8000`
   - `backend`: `https://api.by-rehbein.robinrehbein.de:9000`
3. Umgebungsvariablen prüfen (Coolify zeigt sie nach dem Einlesen an):
   - `SHOP_URL` und `API_URL` stehen standardmäßig auf den beiden Domains oben. Bei anderen
     Domains beide anpassen, ohne Port.
   - `ADMIN_EMAIL` ist die Admin-Anmeldung, Standard `admin@by-rehbein.robinrehbein.de`.
   - `SERVICE_PASSWORD_ADMIN` erzeugt Coolify beim ersten Deploy; das ist das Admin-Passwort.
     Datenbankpasswort und Schlüssel (`SERVICE_PASSWORD_POSTGRES`, `SERVICE_HEX_64_*`)
     erzeugt Coolify ebenfalls.
   - `SEED_EXAMPLE_BAG=false`, wenn die Beispieltasche nicht angelegt werden soll.
4. **Deploy.** Beim ersten Start migriert das Backend die Datenbank, legt Grundeinrichtung,
   Beispieltasche und Admin an. Danach holt sich der Shop seinen Publishable Key vom Backend
   und baut sich; das dauert beim ersten Start einige Minuten.
5. Admin unter `https://api.by-rehbein.robinrehbein.de/app`, Shop unter
   `https://by-rehbein.robinrehbein.de`.

Gut zu wissen:

- Der Admin wird nur beim allerersten Start angelegt. Ein später in Coolify geändertes
  `SERVICE_PASSWORD_ADMIN` ändert das Passwort nicht mehr; das geht im Admin selbst.
- Hochgeladene Fotos liegen im Volume `uploads`, die Datenbank im Volume `pgdata`. Beide
  überleben Redeploys; ein Löschen der Volumes löscht Taschen, Bestellungen und Fotos.
- Der Shop baut sich beim Start, weil der Publishable Key erst nach der Migration existiert.
  Ein Neustart ohne geänderte Konfiguration startet sofort.
- Ohne Redis nutzt Medusa In-Memory-Dienste. Für eine einzelne Instanz reicht das; Medusa
  meldet dazu eine Warnung im Log.

## Tests und Prüfungen

```bash
npm run backend:test                      # Integrationstests (Bestand, Parallelkauf, Seed)
cd apps/backend && npm run lint           # Medusa-Lint
cd apps/storefront && npx tsc --noEmit    # Typecheck Shop
cd apps/storefront && npm run build       # Produktionsbuild Shop
```

Die Integrationstests brauchen die laufende Datenbank aus `docker compose` und legen eigene
Testdatenbanken an (`apps/backend/.env.test`, erzeugt aus `.env.test.template`).

## Projektaufbau

| Pfad | Inhalt |
| --- | --- |
| `apps/backend` | Medusa-Backend und Admin |
| `apps/backend/src/migration-scripts/initial-data-seed.ts` | Grundeinrichtung: Region Deutschland, EUR, Testzahlung, Testversand, Lager „Werkstatt“ |
| `apps/backend/src/migration-scripts/remove-invented-region-policies.ts` | Entfernt unbestätigte Rückgabe- und Versandangaben des Starters |
| `apps/backend/src/scripts/seed-segelstueck.ts` | Beispieltasche (idempotent) |
| `apps/backend/integration-tests/http/unique-inventory.spec.ts` | Einzelstück-Tests |
| `apps/storefront` | Next.js-Shop |
| `apps/storefront/src/lib/data/bags.ts` | Taschen- und Bestandsabfragen ohne Cache |
| `apps/storefront/src/modules/segel` | Shop-eigene Bausteine |
| `DESIGN.md` | Gestaltungssystem |
| `docs/superpowers/` | Entwurf und Umsetzungsplan |

## Bekannte Grenzen

- Kundenkonten aus dem Starter sind vorhanden, aber nicht verlinkt und nicht übersetzt.
- Einige unveränderte Starter-Dateien melden Lint-Fehler (`npm run lint` in `apps/storefront`).
- Regionen werden in der Storefront zwischengespeichert. Nach Änderungen an Regionen im Admin
  den Shop neu starten.
- Live-Betrieb (Zahlungsanbieter, Versand, Rechtstexte, E-Mails, Hosting) ist ein eigener Schritt.
