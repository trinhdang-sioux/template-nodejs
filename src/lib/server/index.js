module.exports = app => {
  let options = app.settings.server

  app.listen(options.port, () => console.log(`App listening on port ${options.port}!`))
}
