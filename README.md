# Pokédex - Dynamiczna Strona Webowa

## Opis projektu

**Pokédex** to interaktywna, responsywna aplikacja webowa (Single Page Application) prezentująca bazę Pokémonów. 
Aplikacja pozwala przeglądać Pokémony, filtrować je, wyszukiwać oraz dodawać ulubionymi. Całość działa bez przeładowania strony, z użyciem czystego JavaScript.

## Główne funkcje

### Wymagania podstawowe (Core)
- Semantyczny **HTML5**
- **CSS Grid + Flexbox** do układu
- Własny CSS (bez Bootstrapa) z wykorzystaniem **CSS Variables** i ciemnego trybu
- Dane oddzielone od HTML – przechowywane w pliku `dane.js` jako tablica obiektów
- Dynamiczne generowanie kart Pokémonów za pomocą `map()` i `innerHTML`

### Funkcjonalności „Na Szóstkę”
1. **Wyszukiwarka w czasie rzeczywistym** – filtruje po nazwie, typie lub numerze Pokédexu
2. **Filtry po typach** – klikalne przyciski wszystkich typów z aktywnym stanem
3. **System ulubionych z LocalStorage** – dodawanie/usuwanie, licznik, pamięć po odświeżeniu
4. **Modal ze szczegółami** – pełne informacje, zdjęcie, opis, statystyki, ewolucja i zdolności

### Dodatkowe funkcje
- Przełącznik **trybu ciemnego/jasnego** (zapis w LocalStorage)
- Efekty hover, animacje i ładne badge typów
- Obsługa form regionalnych (np. Gengar Galar)
- Fallback obrazków z oficjalnego CDN PokeAPI

## Technologie

- **HTML5**, **CSS3**, **Vanilla JavaScript (ES6+)**
- **LocalStorage** do persistencji ulubionych
- **PokeAPI** – tylko jako źródło fallbacku zdjęć (główna baza danych znajduje się w `dane.js`)

## Opisy funkcji w JS

### `aktualizujLicznik()`
Aktualizuje wyświetlaną liczbę ulubionych Pokémonów (licznik przy przycisku ♥).

### `zapiszUlubione()`
Zapisuje aktualną listę ulubionych do `localStorage` i wywołuje `aktualizujLicznik()`. Dzięki temu wybory użytkownika są pamiętane po zamknięciu przeglądarki.

### `toggleUlubiony(id)`
Dodaje lub usuwa Pokémona z listy ulubionych na podstawie jego `id`. Jeśli już jest na liście — usuwa go, jeśli nie — dodaje. Następnie zapisuje zmiany i odświeża siatkę kart.

### `budujBadge(typ)`
Zwraca HTML-owy element `<span>` z nazwą typu Pokémona (np. „grass", „fire") ostylowany odpowiednią klasą CSS (pastelowy kolor tła i tekstu).

### `budujKarte(pokemon)`
Buduje i zwraca kompletny HTML-owy kod karty dla jednego Pokémona — zawiera zdjęcie, numer, nazwę, typy (badge), skrócony opis, przycisk Szczegóły i przycisk ulubionych.

### `renderujPokemony()`
Główna funkcja renderująca. Filtruje listę Pokémonów według aktywnych typów i wpisanej frazy, a następnie wstawia wynikowe karty do siatki (`#siatka`). Jeśli nic nie pasuje — wyświetla komunikat o braku wyników.

### `otworzModal(id)`
Otwiera okno modalne ze szczegółami Pokémona o podanym `id` — wyświetla pełny opis, wzrost, wagę, linię ewolucyjną i zdolności. Blokuje scrollowanie strony w tle.

### `zamknijModal()`
Zamyka modal i przywraca scrollowanie strony. Wywoływana przez przycisk ✕, kliknięcie tła modalu lub naciśnięcie klawisza `Escape`.

### `budujFiltrTypow()`
Pobiera wszystkie unikalne typy z danych Pokémonów, sortuje je alfabetycznie i generuje przyciski filtrów z odpowiednimi klasami CSS dla każdego typu.

### `toggleTyp(typ)`
Włącza lub wyłącza filtr dla danego typu. Dodaje/usuwa klasę `aktywny` z przycisku i odświeża siatkę kart.

# Wykorzystanie PokeAPI
Pliki zdjęciowe pokemonów są pobieranie z repozytorium na GitHubie PokeAPI.
