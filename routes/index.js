module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render('index', { title: 'Audiosite' });
  })
  app.use('/cart', require('./cart'))
  // app.use('/signin', require('./signin'))
  // app.use('/signout', require('./signout'))
  // app.use('/posts', require('./posts'))
  // app.use('/comments', require('./comments'))

  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404')
    }
  })
}

