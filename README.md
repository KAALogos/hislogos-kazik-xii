# HiSLogos — Uczeń / Operacja: znak zapytania

Interaktywna strona dla ucznia oparta na autorskim teście działu XII **Europa w XVII i XVIII wieku**, skanie rozwiązań ucznia, kluczu HiSLogos oraz 16 znakach zapytania zaznaczonych przez ucznia.

## Co zawiera

- 6 modułów dydaktycznych (władza, chronologia, kultura, mapa, krytyka źródeł, misja końcowa);
- 34 działające ćwiczenia: jednokrotny wybór, prawda/fałsz, chronologia z przesuwaniem, dopasowania, klasyfikacja źródeł i pytania otwarte z samooceną;
- komentarz do oryginalnego wyniku **17/25**, 16 pytajników, 10 poprawnych mimo pytajnika, 6 błędnych z pytajnikiem oraz 2 błędnych bez pytajnika;
- informację zwrotną, ponowne próby, zapisywanie postępów w przeglądarce (`localStorage`), eksport i import postępów do/z JSON, dwa motywy, wersję mobilną;
- rzeczywiste ilustracje z materiałów źródłowych; lokalnie osadzone, przycięte reprodukcje ze skanu jako zabezpieczenie offline oraz próba załadowania dokładniejszych oryginałów z Wikimedia Commons.

## GitHub Pages — publikacja

1. Utwórz repozytorium na GitHub, np. `hislogos-xii-europa`.
2. Wgraj **całą zawartość tego katalogu** do katalogu głównego repozytorium: `index.html`, `style.css`, `content.js`, `app.js` i folder `assets`.
3. W repozytorium przejdź do **Settings → Pages → Build and deployment → Deploy from a branch**; wybierz `main` i `/ (root)`, a następnie zapisz.
4. Po opublikowaniu strona będzie dostępna pod adresem `https://<login>.github.io/hislogos-xii-europa/` (jeśli tak nazwiesz repozytorium).

**Nie potrzeba Node.js, instalacji, kont użytkowników, kluczy API ani backendu.** Stronę można również otworzyć lokalnie przez dwukrotne kliknięcie `index.html`.

## Ważne: zapis wyników

Stan ćwiczeń zapisuje się **lokalnie w przeglądarce i urządzeniu**. GitHub Pages sam nie zapisuje wyników na koncie ani nie synchronizuje ich między telefonem a komputerem. Przycisk „Eksportuj postępy” pobiera JSON, który można zachować, przeanalizować lub wczytać na drugim urządzeniu przyciskiem „Wczytaj postępy”. Strona nie zbiera danych osobowych i nie wysyła odpowiedzi na serwer. Fonty Google są opcjonalne; bez nich działa krój zastępczy. Pełnokolorowe obrazy wymagają połączenia sieciowego; kopie ze skanu są zawarte w repozytorium.

## Zakres i weryfikacja

- Test ucznia: 25 odpowiedzi.

W wyjaśnieniach świadomie zachowano różnicę między normą prawa a praktyką społeczną, obrazem a źródłem do rekonstrukcji ustroju oraz datą sporządzenia mapy a datą przedstawianej sytuacji. To nie jest przedruk konkursu MKO ani jego oficjalny klucz.

## Licencje ilustracji

- **Wersal, Galeria Zwierciadlana** — RyanMcK (fot. 2006), public domain: https://commons.wikimedia.org/wiki/File:Versailleshallofmirrors.jpg
- **Europa po pokoju westfalskim (1648)** — Reginald Lane Poole, *Historical Atlas of Modern Europe*, 1896–1902, public domain: https://commons.wikimedia.org/wiki/File:Europe_after_the_Peace_of_Westphalia,_1648.jpg
- **Koronacja Wilhelma III i Marii II (1689)** — druk historyczny, Houghton Library, Harvard University, sygn. **EB65 A100 B675b v.3**, public domain: https://commons.wikimedia.org/wiki/File:Houghton_EB65_A100_B675b_v.3_-_Crowning_of_William_and_Mary,_1689.jpg
- **Bill of Rights (1689)** — historyczny akt: https://www.legislation.gov.uk/aep/WillandMarSess2/1/2

W katalogu `assets` znajdują się wycinki tych autentycznych ilustracji, wydzielone ze skanu arkusza ucznia. Nie są to wygenerowane ilustracje ani autorskie schematy udające materiał historyczny.

Teksty i kod aplikacji przygotowano na potrzeby niekomercyjnego treningu HiSLogos. Można je dowolnie adaptować w projekcie edukacyjnym.

## Pojedynczy plik HTML

Osobno przygotowano wersję `HiSLogos_XII_INTERAKTYWNY.html`: samodzielny dokument zawierający HTML, CSS, JavaScript i awaryjne kopie trzech rzeczywistych ilustracji. Wystarczy zmienić jego nazwę na `index.html` i wgrać do repozytorium (zamiast zestawu kilku plików). Wersja samodzielna również korzysta opcjonalnie z dokładniejszych oryginałów w Wikimedia Commons, gdy jest dostępna sieć.
