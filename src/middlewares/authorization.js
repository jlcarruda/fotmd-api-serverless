
module.exports.isAuthenticated = (req, res, next) => {
  console.log(req.headers)
  req.auth = {}
  next()
}