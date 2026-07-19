# Polgárőr App

Ez egy React + Vite alapú webalkalmazás polgárőrök számára. A projekt célja, hogy segítse a járőrök, koordinátorok és vezetők közötti kommunikációt és feladatkezelést. Az alkalmazás helyi tárolást (`localStorage`) használ a felhasználói adatok mentésére és egy interaktív térképet jelenít meg az OpenStreetMap segítségével.

## Funkciók
- Felhasználói bejelentkezés különböző szerepkörökkel (járőr, koordinátor, vezér).
- Interaktív térkép a `react-leaflet` és OpenStreetMap segítségével.
- Helyi adatkezelés, nincs szükség külső adatbázisra vagy szerverre.
- Reszponzív dizájn, amely mobilon és asztali gépen is használható.

## Telepítés
1. Telepítsd a Node.js-t (ajánlott: 18.x vagy újabb).
2. Nyisd meg a projekt gyökérkönyvtárát (`paopsz`) egy terminálban.
3. Futtasd:
   ```bash
   npm install
   npm run dev
   ```

## Működés
- A felhasználók adatai a `localStorage`-ban tárolódnak.
- Nincs szükség külső szerverre vagy Firebase-re az alapműködéshez.
- A térkép OpenStreetMap-et használ `react-leaflet`-tel.
- A bejelentkezés és a felhasználói szerepkörök helyben vannak kezelve.

## Minta fiókok
- `leader@polgaror.hu` / `leader123` (vezér-1)
- `koord@polgaror.hu` / `koord123` (koordinátor)
- `patrol@polgaror.hu` / `patrol123` (járőr)

## További fejlesztés
- Hangértesítések beépítése új küldetés és üzenet esetére.
- Párbeszéd- vagy chat-felület küldetésekhez.
- Koordinátor-oldalon küldetés- és üzenetkezelés.
