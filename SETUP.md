# Podłączenie panelu (Sanity) — jednorazowo

Treść strony (prace + teksty) siedzi w Sanity, a panel do jej edycji jest
częścią tej samej strony, pod adresem `/studio`. Dopóki nie ustawisz zmiennych
środowiskowych, strona nie ma skąd wziąć treści — galeria jest pusta,
a `/studio` pokazuje komunikat, czego brakuje.

## 1. Załóż projekt w Sanity

1. Wejdź na [sanity.io/manage](https://www.sanity.io/manage), zaloguj się, **Create new project**.
2. Nazwa: `sanka`, dataset: `production` (publiczny).
3. Skopiuj **Project ID**.

## 2. Lokalnie

```bash
cp .env.local.example .env.local
```

Wklej `Project ID` do `NEXT_PUBLIC_SANITY_PROJECT_ID`.

```bash
pnpm dev   # http://localhost:3000/studio
```

Prace dodaje się w `/studio` — **Prace → Dodaj**. Każda potrzebuje zdjęcia,
tytułu i prawdziwych wymiarów w centymetrach.

## 3. Dopisz adres do CORS

Panel loguje się do Sanity z przeglądarki, więc każdy adres, spod którego go
otwierasz, musi być na liście dozwolonych. W `sanity.io/manage → API → CORS
origins → Add CORS origin` dodaj `http://localhost:3000` z zaznaczonym
**Allow credentials**. Bez tego `/studio` wisi na kręciołku i nic się nie ładuje.

## 4. Vercel

W ustawieniach projektu → **Environment Variables** dodaj dla wszystkich środowisk:

| Zmienna | Wartość |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project ID z kroku 1 |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |

Potem redeploy. Panel będzie pod `https://twoja-domena/studio` — dopisz ten
adres do CORS tak samo jak `http://localhost:3000` w kroku 3.

## 5. Dostęp dla artystki

`sanity.io/manage → Members → Invite` na jej adres e-mail, rola **Editor**.
Loguje się na `/studio` tym samym mailem — nie potrzebuje GitHuba ani Vercela.

Rola **Editor** pozwala edytować treść, ale nie zmienia struktury pól ani
ustawień projektu, więc nie da się nic zepsuć klikaniem.

## Jak to działa

- `sanity/schemaTypes/` — pola, które widzi artystka. Chcesz nowe pole
  (np. „sprzedane”, „rok powstania”)? Dodajesz je tutaj i jest w panelu.
- `sanity/structure.ts` — panel ma świadomie tylko dwie pozycje: *Prace*
  i *Tekst na stronie*. Brak przycisku „nowy dokument”, brak wyboru typów.
- `lib/content.ts` — pobiera treść i zamienia ją na to, czego oczekują
  komponenty. `REVALIDATE_SECONDS = 60`, czyli zmiana po publikacji jest
  widoczna na stronie do minuty, bez deployu.
- Zdjęcia idą na CDN Sanity i są pobierane w rozmiarze, w jakim faktycznie
  się wyświetlają (`sanity/lib/image.ts`) — artystka może wrzucać pliki
  prosto z aparatu, strona i tak zostanie lekka.
