# couchfb

Put facebook name data into your own searchable couchdb. This is super-simple. I'm just putting it on github to share with a friend.

## setup

`npm install` to download dependencies.

## configuration

It's stored in `config.json`, and it's just a basic cradle config object. Mine looks like this:

```json
{
	"host":"https://konsumer.cloudant.com",
	"port": 443,
	"database": "facebook",
	"secure": true,
	"auth": {
		"username": "<SECRET>",
		"password": "<SECRET>"
	}
}
```

## run it

`node index.js`

