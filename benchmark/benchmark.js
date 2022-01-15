const siege = require('siege');
siege()
.concurrent(1)
.get('https://localhost:5000/api/books')
.attack()