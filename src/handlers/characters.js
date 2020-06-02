const { app, serverless } = require('../header')
const { isAuthenticated }  = require('../middlewares')
const { FailedAuthError, FailedSignUpError } = require('../errors')

app.get('/user/characters', isAuthenticated, (req, res) => {

})

app.get('/user/characters/:id', isAuthenticated, (req, res) => {

})