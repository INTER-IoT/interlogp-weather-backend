### Fetch VPF data

This command populates utils/data folder. Use it the first time or when it needs to be refreshed.
`npm run fetch-data <baseurl> <token>`

for example:

`npm run fetch-data https://62.43.227.68:8244 01bf8712-4d6d-37da-8779-6cc7be9b7f9f`

### Init DB

`npm run init-db <mongourl> <datapath>`

for example:

`npm run init-db mongodb://localhost:27017/environment utils/data`