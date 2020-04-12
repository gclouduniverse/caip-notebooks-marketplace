# Development

## Build Latest Version

```bash
npm run build
```

## Get Config

```bash
gcloud beta secrets versions access "latest" \
    --secret "firebase-config" \
    --project "caip-notebooks-marketplace-dev" > ./src/common/constants/keys.ts
```

## Local Serving

To start server locally just run:

```bash
firebase serve
```

You also might need to clean cache first:

```bash
rm -rf ./.firebase
```

## Deploy To Dev

```bash
firebase use dev
gcloud beta secrets versions access "latest" \
    --secret "firebase-config" \
    --project "caip-notebooks-marketplace-dev" > ./src/common/constants/keys.ts
npm install
npm run build
firebase deploy
```
