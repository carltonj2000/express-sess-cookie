# Express Sessions And Cookie Example

The code in this repository is base on the
[Understanding Authentication in Node.js - Sessions and Cookies - Web Development Concepts Explained](https://youtu.be/TDe7DRYK8vU)
video.

## Mongo

Start up the mongo server as admin and then add a user.

```bash
mongo -u root -p mongo1Pw9 --authenticationDatabase admin
use your_new_database
db.createUser({ user: 'new_username', pwd: 'new_password',
    roles: [ { role: 'readWrite', db: 'your_new_database' } ]
})
```

## Reference

- [How To Use EJS to Template Your Node Application](https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application)
