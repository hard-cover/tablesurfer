var database = require('./db');

module.exports = {
  user: {
    get: function (req, res) {
      database.Users.findAll().then(function (users) {
        res.json(users);
      })
    },
    post: function (req, res) {
      database.Users.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName
      }).then(function (message) {
        console.log(message);
        res.sendStatus(201);
      });
    }
  },
  meals: {
    get: function (req, res) {
      database.Meals.findAll({include: [database.Users, database.Restaurants]})
        .then(function (meals) {
          res.json(meals);
        })
    },
    post: function (req, res) {
      database.Users.findOrCreate({where: {firstName: req.body.firstName, lastName: req.body.lastName}})
        .then(function (user) {
          database.Restaurants.findOrCreate({where: {name: req.body.restaurant}})
            .then(function (restaurant) {
              database.Meals.create({
                date: req.body.date,
                time: req.body.time,
                description: req.body.description,
                //user.id and restaurant.id are not working as they are expected to--what is up with sequelize?
                UserId: user[0].dataValues.id,
                RestaurantId: restaurant[0].dataValues.id
              }).then(function (message) {
                res.sendStatus(201);
              });
            })
        });
    }
  },
  restaurants: {},
  genre: {}  
}
