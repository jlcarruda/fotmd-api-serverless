
module.exports.isAuthenticated = (req, res, next) => {
  console.log(req.headers)
  next()
}