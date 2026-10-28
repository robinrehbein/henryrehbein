# Segeltaschen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Einen lokalen deutschsprachigen Einzelstück-Shop mit echtem Medusa-Backend und Testbestellungen liefern.

**Architecture:** Der offizielle Medusa-Starter bildet ein neues Monorepo mit Backend und Next.js-Storefront. PostgreSQL speichert Produkte und Bestellungen dauerhaft; der Shop verwendet Medusas vorhandene Commerce-Abläufe. Individuelle Gestaltung und knappe Inhalte ersetzen die Starter-Demoware.

**Tech Stack:** Medusa 2, Next.js, TypeScript, Node 24 LTS, PostgreSQL; kompatible Paketstände beim Scaffold festhalten und über Lockfile fixieren.

**Spec:** ../specs/2026-10-27-segeltaschen-design.md

## Global Constraints

- Projektziel: /Users/robinrehbein/Code/henryrehbein.
- Zunächst ausschließlich lokale Demo; keine Veröffentlichung, Domain-Einrichtung oder Live-Zahlungen.
- Jede physische Tasche wird als eigenes Produkt mit genau einer kaufbaren Variante und eindeutiger SKU/Unikatnummer angelegt.
- Startbestand 1, Bestandsverwaltung aktiv und keine Nachbestellungen über den verfügbaren Bestand hinaus.
- Keine erfundenen Taschen als echte verfügbare Ware darstellen.
- Keine echten Kunden- oder Zahlungsdaten erforderlich.
- Zugangsdaten werden nicht in Git eingecheckt.
- Bestehende Projekte bleiben unberührt.
- Bei bestehendem Git-Repository vor Quellcodearbeit Status/Branch/Upstream prüfen und git pull --ff-only; bei neuem Repo fehlenden Remote dokumentieren. Vor erstem Build Branch und Commit nennen.

## Review Focus

- Zwei parallele Käufer desselben Unikats: höchstens eine erfolgreiche Bestellung.
- Veralteter Warenkorb nach Bestandsänderung: nachvollziehbare Meldung statt Scheinbestätigung.
- Fehlendes Backend: verständlicher Fehlerzustand ohne erfundene Produktdaten.
- Wiederholte Initialisierung und Neustart: keine duplizierte Tasche und kein zurückgesetzter Verkauf.
- Kleine Bildschirme und Tastatur: erreichbare Navigation, Galerie und Checkout.

## File Structure

- `compose.yaml`, `.env.example`, `.gitignore`, `.node-version`, `README.md`: lokale Laufzeit, Konfiguration und Startanleitung.
- `apps/backend/medusa-config.ts`: Medusa, lokaler Dateispeicher und Testzahlung.
- `apps/backend/src/scripts/seed-segelstueck.ts`: idempotente Demo-Initialisierung.
- `apps/backend/integration-tests/http/unique-inventory.spec.ts`: Bestands- und Bestellintegration mit echter Testdatenbank.
- `apps/storefront/src/lib/data/`: vorhandene Medusa-Anbindung für Produkte, Warenkorb und Bestellungen weiterverwenden.
- `apps/storefront/src/modules/{home,products,cart,checkout,layout}/`: Startseite und Shop-Komponenten im Starter.
- `apps/storefront/src/app/[countryCode]/(main)/archiv/page.tsx`: verkaufte Stücke.
- `apps/storefront/public/images/`: geliefertes Produktfoto; Bildausschnitte bei Bedarf über Darstellung statt erfundene Motive.
- `apps/storefront/src/styles/globals.css`, `DESIGN.md`: eigenes visuelles System und Herkunft der Referenzmuster.
- `docs/superpowers/`: freigegebener Entwurf und dieser Plan.

Die tatsächlichen Dateinamen des frisch generierten offiziellen Starters werden vor Änderungen mit dieser Zuordnung abgeglichen; bestehende gleichwertige Dateien werden verwendet statt parallele Abstraktionen einzuführen.

## Task 1: Reproduzierbarer Backend- und Storefront-Start

**Files:** Root-Konfiguration, `apps/backend/medusa-config.ts`, Scaffold-Paketdateien und Lockfile.

**Interfaces:** Produziert Medusa unter localhost:9000 einschließlich Admin, Storefront unter localhost:8000 und PostgreSQL über einen projektspezifischen Compose-Dienst mit dauerhaftem Volume. Bindungen nur lokal.

- [ ] Schreibzugriff für den neuen Zielordner sowie nötigen Docker-Zugriff über Werkzeugfreigaben anfordern; vorhandenen Zielordner niemals überschreiben.
- [ ] Offizielle CLI-Hilfe und aktuelle Installationsdokumentation lesen; Node 24 projektbezogen verwenden, globales Node nicht ersetzen.
- [ ] Neuen Medusa-Starter mit Next.js erzeugen, Git-Status/Remote feststellen, freigegebenen Entwurf und Plan übernehmen und Ausgangscommit anlegen.
- [ ] Compose mit PostgreSQL, Healthcheck und eigenem Volume erstellen. Lokale Konfiguration und Admin-Zugang außerhalb von Git erzeugen. Keine echten Zahlungsanbieter konfigurieren.
- [ ] Migrationen ausführen und beide Dienste starten; `/health` sowie Storefront müssen erreichbar sein. Backend-Ausfall mit verständlichem Storefront-Zustand prüfen.
- [ ] Lockfile, Konfiguration und dokumentierte Startbefehle committen.

## Task 2: Echtes Unikat und sichere Testbestellung

**Files:** Seed-Skript, Backend-Integrationstest, bestehende Storefront-Datenfunktionen und Checkout-Konfiguration.

**Interfaces:** Seed erzeugt Produkt `segelstueck-001`, SKU `SS-001`, eine Variante, Bestand 1, EUR-Preis als gekennzeichnete Demoangabe, Region Deutschland und Testversand. Ein zweites Seed-Ausführen verändert verkaufte Bestände nicht. Produktdaten kommen ausschließlich aus Medusa. Der Checkout nutzt den dokumentierten manuellen/Testzahlungsanbieter.

- [ ] Aktuelle offizielle APIs für Produktanlage, Bestand, Reservierungen, Cart Completion und Testzahlung prüfen.
- [ ] Integrationstest schreiben: Seed zweimal ausführen ergibt genau ein Produkt; Bestand bleibt korrekt. Test zunächst rot ausführen.
- [ ] Seed implementieren; Foto als mehrere Ansichten derselben Tasche erklären, unbekannte Maße und Recycling-Herkunft auslassen. Test grün ausführen.
- [ ] Mit echter Testdatenbank zwei unabhängig vorbereitete Warenkörbe gleichzeitig abschließen: höchstens einer erfolgreich, Bestand niemals negativ. Separat veralteten Warenkorb und erneuten Kauf eines verkauften Produkts prüfen. Tests vor eventuellen eigenen Anpassungen ausführen; vorhandene Medusa-Schutzmechanismen verwenden.
- [ ] Bestehende Starter-Flows auf Testzahlung und Testversand begrenzen; Hinweis vor Abschluss sowie Bestellbestätigung mit klarer Demo-Kennzeichnung ergänzen.
- [ ] Admin-Text-/Preisänderung im Shop überprüfen; Bestell- und Produktpersistenz nach Neustart prüfen. Commit erstellen.

## Task 3: Eigenständiges Shop-Design und Archiv

**Files:** Storefront-Module, globale Styles, Bildassets, Archivroute, `DESIGN.md`.

**Interfaces:** Produktseiten verwenden Medusa-Produkt-ID und Variant-ID. Verfügbarkeit wird aus serverseitigem Bestand abgeleitet; Variantenmenge ist auf 1 begrenzt. Archiv enthält als verkauft gekennzeichnete Einzelstücke ohne Kaufmöglichkeit.

- [ ] Eigenes Design in `DESIGN.md` dokumentieren: Segelweiß/Schwarz/Blau, Raster, feine Linien, Typografie und Quellen; exakte Freitag-Tokens nicht behaupten.
- [ ] Startseite, Navigation, Produkteraster und Galerie bauen; austauschbarer Arbeitstitel „Segelstück“, deutsche Texte und echte gelieferte Bilder.
- [ ] Leere Produktübersicht, verkauftes Produkt und fehlende Bildansicht mit nachvollziehbaren Zuständen abdecken; synthetische Fixtures nur als Demo kennzeichnen.
- [ ] Produktdetail, Warenkorb, Checkout und Archiv zusammenführen; keine erfundenen Unternehmens-, Material- oder Rechtsangaben.
- [ ] Browserprüfung auf Desktop und schmalem Bildschirm: Tastaturnavigation, Fokus, Galerie, Warenkorb und vollständige Testbestellung. Relevante Probleme beheben.
- [ ] Typecheck und Produktionsbuild nach benanntem Branch/Commit ausführen. Änderungen committen.

## Task 4: Übergabe und Gesamtprüfung

**Files:** `README.md`, `.env.example`, Backend-Integrationstest und Planstatus.

**Interfaces:** Eine Person kann nach Anleitung Dienste starten, Admin öffnen und ein neues Unikat mit Bestand 1 anlegen; lokale Zugangsdaten werden separat und ohne Commit bereitgestellt.

- [ ] README mit Voraussetzungen, Ports, Start/Stopp, Migrationen, Seed-Verhalten und Produktpflege ergänzen. Keine Datenlöschung als normalen Neustart dokumentieren.
- [ ] Sicherheitsrelevante Demo-Grenzen konkret dokumentieren: nur lokal, Testzahlung, keine echten Zahlungs-/Versandvorgänge.
- [ ] Bestandsintegration, Typecheck und Build prüfen; nur nach weiteren Änderungen erneut ausführen.
- [ ] Gesamtdiff gegen Entwurf überprüfen: echte Anbindung, Bildherkunft, Demo-Kennzeichnung, Bestand 1, keine Geheimnisse und keine fremden Änderungen.
- [ ] Lokale Links für Shop/Admin, Projektpfad, verifizierte Prüfungen und verbleibende Einschränkungen übergeben. Bei Infrastrukturblockaden konkrete Ursache und reproduzierbaren Startweg nennen, Erfolg nicht vortäuschen.

## Planning Evidence

- https://docs.medusajs.com/learn/installation – Node-LTS-Voraussetzung; Next.js-Starter Node 24 oder niedriger.
- https://docs.medusajs.com/resources/create-medusa-app – offizieller Monorepo-Starter mit `apps/backend` und optional `apps/storefront`.
- Lokal am 27.10.2026 festgestellt: Node 26.10.0, npm 11.19.1, Docker CLI 29.7.2, kein `psql` im PATH; Docker-Socketzugriff im Sandbox-Kontext verweigert. Zielordner existiert noch nicht.

## Self-Review

Entwurf vollständig zugeordnet: Produktpflege und Bestand Task 2, Gestaltung und Seiten Task 3, lokale Laufzeit Task 1, Dokumentation und Übergabe Task 4. Alle fünf Review-Fälle besitzen explizite Prüfungen. Keine Änderungen an Acca44 und keine Veröffentlichung vorgesehen.
