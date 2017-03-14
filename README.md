# Beak

Make sure redis server is running:
```sh
redis-server
```

## app server
```sh
bundle exec rackup config.ru -p 7274
```

## dev server
On `port: 7276`

```sh
cd frontend
yarn install
yarn run develop
```
