# Segeltaschen – Entwurf für den Demo-Shop

Stand: 27.10.2026. Zur Freigabe; noch keine Implementierung.

## Ziel und bestätigte Richtung

Ein kleiner Hersteller handgemachter Taschen aus Segelstoff soll seine Arbeit mit einem eigenständigen Shop vorstellen und den späteren Verkauf erproben können. Alle Taschen sind Einzelstücke. Der Nutzer hat Medusa als Backend gewählt und Freitag als gestalterische Referenz genannt. Das bereitgestellte Foto zeigt verschiedene Ansichten einer hellen Tasche mit blauen Zeichen und Innenfächern.

## Ansätze und Entscheidung

Besprochen wurden eine reine klickbare Demo mit simulierter Verwaltung, ein Shop mit echtem Medusa-Backend und ein Shop mit Vendure. Die reine Demo wäre schneller, würde aber die tatsächliche Produktpflege nicht erproben. Beide Backend-Optionen ermöglichen die gewünschte Trennung zwischen individueller Shop-Oberfläche und Verwaltung. Der Nutzer hat Medusa gewählt; eine grundsätzliche Überlegenheit gegenüber Vendure wird nicht behauptet. Acca44 wurde laut Nutzer mit Vendure gebaut, ist aber kein Teil dieses neuen Projekts.

## Vorgeschlagener Umfang der ersten Version

Lokal laufender deutschsprachiger Demo-Shop mit echtem Medusa-Backend, dauerhafter Datenbank und Medusa-Verwaltung. Next.js und TypeScript für die Shop-Oberfläche, PostgreSQL für Medusa; genaue kompatible Versionen werden vor der Umsetzung anhand der offiziellen Dokumentation bestimmt. Dies sind Vorschläge des Bearbeiters, keine bereits bestätigten Technologiepräferenzen des Nutzers.

Projektziel: /Users/robinrehbein/Code/henryrehbein. Der endgültige Markenname ist offen; „Segelstück“ dient ausschließlich als austauschbarer Arbeitstitel. Bestehende Projekte bleiben unberührt. Vor Arbeiten an einem vorhandenen Repository werden Branch, Upstream und Arbeitsbaum geprüft und der vorgesehene Branch per git pull --ff-only aktualisiert. Bei einem neuen Repository ohne Remote wird dieser Zustand ausdrücklich dokumentiert. Schreibrechte außerhalb des aktuellen Arbeitsbereichs müssen über den vorgesehenen Werkzeugmechanismus eingeholt werden.

## Gestaltung

Eigenständige Interpretation der Referenz: strenges Produktraster, sichtbare feine Trennlinien, sachliche Produktkennzeichnungen, starke Typografie und großzügige Produktbilder. Vorgeschlagene Farben sind Segelweiß, Schwarz und ein Akzentblau aus dem bereitgestellten Foto. Keine Übernahme von Freitag-Logo, Markenname, Texten oder Produktbildern.

Die offizielle Referenz https://freitag.ch/de_CH/products/bags wurde am 27.10.2026 im Browser angesehen. Das Raster und die sachliche Beschriftung waren sichtbar; die Aufnahme enthielt einen Cookie-Dialog. Exakte Schriftarten, CSS-Werte, Mobilansicht und Interaktionen wurden noch nicht untersucht. Eine spätere DESIGN.md trennt beobachtete Referenzmuster von eigenen Gestaltungsentscheidungen.

## Seiten und Abläufe

1. Startseite mit großem Taschenbild, kurzer Aussage zu handgemachten Unikaten, direktem Einstieg in verfügbare Taschen und einem knappen Abschnitt über Material und Herstellung.
2. Shop mit verfügbaren Einzelstücken, Produktnummer, Name und Preis. Einfacher Filter nach Verfügbarkeit; weitere Filter nur bei ausreichend echten Daten.
3. Detailseite mit Galerie, Unikatnummer, Preis, Verfügbarkeit, Beschreibung sowie Feldern für Maße, Material und Pflege. Unbekannte Angaben werden als Beispieldaten gekennzeichnet oder ausgelassen.
4. Warenkorb mit maximal einem Exemplar je Unikat und verständlichen Meldungen bei inzwischen fehlendem Bestand.
5. Demo-Checkout mit Testzahlung, Testversand und anschließender Bestellbestätigung. Vor dem Abschluss ist deutlich erkennbar, dass keine echte Zahlung und kein Versand stattfinden. Keine echten Kunden- oder Zahlungsdaten erforderlich.
6. Archiv verkaufter Stücke: Produkte bleiben sichtbar, sind eindeutig als verkauft gekennzeichnet und nicht mehr bestellbar. Dies ist ein vorgeschlagener Bestandteil der ersten Version.

## Einzelstücke und Bestand

Jede physische Tasche wird als eigenes Produkt mit genau einer kaufbaren Variante und eindeutiger SKU/Unikatnummer angelegt. Startbestand 1, Bestandsverwaltung aktiv und keine Nachbestellungen über den verfügbaren Bestand hinaus. Die Bestandsprüfung und Bestellung laufen über Medusa. Ein Warenkorbeintrag allein wird nicht als dauerhafte Reservierung versprochen. Zwei parallele Kaufversuche dürfen nicht zu zwei erfolgreichen Bestellungen desselben Stücks führen. Der konkrete Reservierungs- und Testzahlungsablauf wird vor Umsetzung mit der ausgewählten Medusa-Version abgeglichen.

## Beispielseite im Backend

Die echte Medusa-Verwaltung ist erreichbar und erhält ein vollständig ausgefülltes Beispielprodukt. Dort können Name, Beschreibung, Bilder, Preis, Unikatnummer und Bestand gepflegt werden. Eine kurze Anleitung erklärt, wie der Bruder eine weitere Tasche mit Bestand 1 einstellt. Keine separate, selbst entwickelte Admin-Oberfläche, sofern das vorhandene Medusa-Admin den Ablauf abdeckt.

## Bilder und Beispieldaten

Das hochgeladene Bild enthält mehrere Ansichten derselben Tasche, nicht mehrere belegte Produkte. Die Ansichten dürfen für die Produktgalerie zugeschnitten werden. Keine erfundenen Taschen als echte verfügbare Ware darstellen. Ein echtes Foto-Beispielprodukt genügt. Zusätzliche synthetische Datensätze für Bestands- und Archivtests werden ausdrücklich als Demo gekennzeichnet. Preise, Maße, Herkunft des Segelstoffs und Herstellerangaben sind bislang nicht bestätigt. Insbesondere wird nicht behauptet, dass der Stoff gebraucht oder recycelt ist.

## Betrieb und Grenzen

Zunächst ausschließlich lokale Demo; keine Veröffentlichung, Domain-Einrichtung oder Live-Zahlungen. Ein dokumentierter Startablauf und lokale Konfigurationsbeispiele gehören zur Lieferung. Zugangsdaten werden nicht in Git eingecheckt. Ein späterer Live-Betrieb mit echten Zahlungsanbietern, Versand, rechtlichen Angaben und E-Mails ist ein eigener Schritt. Die Demo enthält keine erfundenen rechtlichen Unternehmensangaben und keine unbelegten Nachhaltigkeitsversprechen.

## Prüfkriterien

Shop und Verwaltung starten nach dokumentiertem Ablauf. Das Beispielprodukt wird aus Medusa geladen. Eine Preis- oder Textänderung im Admin erscheint im Shop. Warenkorb und Demo-Bestellung funktionieren; ein verkauftes Einzelstück kann nicht erneut bestellt werden. Der Parallelkauf desselben Stücks wird sinnvoll geprüft. Desktop und schmaler Mobilbildschirm sind bedienbar, Tastaturbedienung und lesbare Kontraste werden geprüft. Ein Neustart erhält Produkte und Testbestellungen.

## Dem Bearbeiter überlassene Entscheidungen

Kompatible Paketversionen, genaue Komponentenstruktur, responsive Breakpoints, geeignete frei nutzbare Schrift, Zuschnitte des gelieferten Fotos und austauschbare Beispieltexte. Falls die lokale Umgebung notwendige Infrastruktur nicht bereitstellt, wird die konkrete Einschränkung benannt und ein reproduzierbarer Startweg vorbereitet, statt ein simuliertes Backend als echt auszugeben.

## Freigabe

Dieser Entwurf schlägt den noch offenen Umfang vor. Nach Nutzerfreigabe folgen Implementierungsplan und Umsetzung. Das Dokument wird beim Anlegen des neuen Projekt-Repositorys übernommen und versioniert.
