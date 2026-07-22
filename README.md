# Polgárőr App

Ez egy React + Vite alapú webalkalmazás polgárőrök számára. A projekt célja, hogy segítse a járőrök, koordinátorok és vezetők közötti kommunikációt és feladatkezelést. Az alkalmazás a Google Firebase szolgáltatásait (Authentication, Firestore) használja a valós idejű adatkezeléshez.

## Funkciók
- Felhasználói bejelentkezés különböző szerepkörökkel (járőr, koordinátor, vezető).
- Valós idejű térképes nézet a `react-leaflet` és OpenStreetMap segítségével, ahol a diszpécserek látják az egységek pozícióját.
- Küldetéskezelés, logolás és felhasználó-adminisztráció.
- Interaktív térkép a `react-leaflet` és OpenStreetMap segítségével.
- Valós idejű adatbázis és authentikáció a Firebase segítségével.
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
- A felhasználók, küldetések és egyéb adatok a Firebase Firestore adatbázisában tárolódnak és valós időben frissülnek.
- A bejelentkezést a Firebase Authentication kezeli.
- A térkép OpenStreetMap-et használ `react-leaflet`-tel.

## Minta fiókok
- `leader@polgaror.hu` / `leader123` (vezér-1)
- `koord@polgaror.hu` / `koord123` (koordinátor)
- `patrol@polgaror.hu` / `patrol123` (járőr)

## További fejlesztés
- Hangértesítések beépítése új küldetés és üzenet esetére.
- Párbeszéd- vagy chat-felület küldetésekhez.
- Koordinátor-oldalon küldetés- és üzenetkezelés.
