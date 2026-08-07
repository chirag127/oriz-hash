# PWABuilder packaging — oriz Hash

- Live URL: https://hash.oriz.in
- Android package id: `in.oriz.hash`
- Signing SHA-256: `0C:82:DB:11:57:7E:21:8D:62:1E:54:DF:3B:33:D1:29:6E:77:56:80:36:22:C1:99:36:DF:03:D3:6F:0D:30:36`

## Steps

PWABuilder.com -> enter URL `https://hash.oriz.in` -> Package For Stores -> Android (use existing signing key, package `in.oriz.hash`) / Windows / iOS.

## Notes

- `public/.well-known/assetlinks.json` already carries the above SHA-256 for Android TWA verification. Confirm live 200 at https://hash.oriz.in/.well-known/assetlinks.json before submitting.
- Manifest served at https://hash.oriz.in/manifest.webmanifest; service worker `sw.js` auto-registers (registerType `autoUpdate`).
- Icons: 192/256/384/512 PNG (`purpose: any`) + 512 maskable + SVG, under `/icons/`.
- Screenshots: 1 wide (desktop) + 1 mobile under `/screenshots/`, referenced in the manifest (Play + PWABuilder require >=1).
