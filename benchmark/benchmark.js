const siege = require('siege');
 siege()
.on(3000)
.for(400) .times
.get('/api/books')
.attack()
