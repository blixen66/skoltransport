# 🚌 Skoltransporter - Ruttoptimering

En modern React-applikation för att optimera rutter för skoltransporter med Google Maps API.

## ✨ Funktioner

- **📍 Adresshantering**: Lägg till, ta bort och sortera adresser
- **🗺️ Google Maps Integration**: Optimerad ruttberäkning med Google Maps API
- **📱 Mobiloptimerad**: Touch-vänlig design med DaisyUI
- **💾 Spara rutter**: Spara och ladda rutter i databas
- **🔄 Drag & Drop**: Manuell sortering av adresser
- **📋 Kopiera länkar**: Generera Google Maps-länkar

## 🚀 Kom igång

### Förutsättningar

- Node.js (version 16 eller senare)
- npm eller yarn
- Google Maps API-nyckel

### Installation

1. Klona repositoryt:
```bash
git clone https://github.com/blixen66/skoltransport.git
cd skoltransport
```

2. Installera dependencies:
```bash
npm install
```

3. Skapa en `.env`-fil i root-katalogen:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=din_google_maps_api_nyckel
REACT_APP_API_BASE_URL=http://localhost:8080
```

4. Starta utvecklingsservern:
```bash
npm start
```

Appen kommer att öppnas på [http://localhost:3000](http://localhost:3000).

## 🏗️ Teknisk stack

- **React 18** med TypeScript
- **Tailwind CSS** för styling
- **DaisyUI** för komponenter
- **Heroicons** för ikoner
- **Google Maps JavaScript API** för ruttoptimering
- **Custom hooks** för state management

## 📁 Projektstruktur

```
src/
├── components/          # React-komponenter
│   ├── AddressInput.tsx
│   ├── AddressList.tsx
│   ├── Alert.tsx
│   ├── AlertContainer.tsx
│   ├── LoadingSpinner.tsx
│   └── SavedRoutesList.tsx
├── hooks/              # Custom React hooks
│   ├── useAddresses.ts
│   ├── useAlerts.ts
│   ├── useGoogleMaps.ts
│   └── useSavedRoutes.ts
├── types/              # TypeScript-typer
│   └── index.ts
├── App.tsx             # Huvudkomponent
├── index.tsx           # App-entry point
└── index.css           # Globala stilar
```

## 🎨 Design

Appen använder DaisyUI med ett anpassat tema "skoltransporter" som ger:
- **Primär färg**: Blå (#3b82f6)
- **Sekundär färg**: Lila (#8b5cf6)
- **Success**: Grön (#10b981)
- **Error**: Röd (#ef4444)

## 📱 Responsiv design

- **Mobil**: Kompakt layout med fullbredd knappar
- **Tablet**: Medium layout med auto-bredd knappar
- **Desktop**: Full layout med stora komponenter

## 🔧 API-integration

Appen integrerar med en PHP-backend för att spara och ladda rutter:

- **Spara rutt**: `POST /database.php`
- **Ladda rutter**: `GET /database.php?action=load`
- **Ladda rutt**: `GET /database.php?action=load_route&id={id}`
- **Ta bort rutt**: `POST /database.php` med action=delete

## 🚀 Deployment

### Build för produktion

```bash
npm run build
```

### GitHub Pages

1. Installera gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Lägg till i package.json:
```json
{
  "homepage": "https://blixen66.github.io/skoltransport",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploya:
```bash
npm run deploy
```

## 🤝 Bidrag

1. Forka projektet
2. Skapa en feature branch (`git checkout -b feature/AmazingFeature`)
3. Commita dina ändringar (`git commit -m 'Add some AmazingFeature'`)
4. Pusha till branchen (`git push origin feature/AmazingFeature`)
5. Öppna en Pull Request

## 📄 Licens

Detta projekt är licensierat under MIT-licensen - se [LICENSE](LICENSE) filen för detaljer.

## 👨‍💻 Utvecklare

- **blixen66** - *Initialt arbete* - [GitHub](https://github.com/blixen66)

## 🙏 Tack

- [Google Maps API](https://developers.google.com/maps) för ruttoptimering
- [DaisyUI](https://daisyui.com/) för komponenter
- [Tailwind CSS](https://tailwindcss.com/) för styling
- [Heroicons](https://heroicons.com/) för ikoner