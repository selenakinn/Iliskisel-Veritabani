const Accounts = require('./accounts-model')

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body

  if (!name || budget === undefined) {
    return res.status(400).json({
      message: 'name and budget are required',
    })
  }

  const trimmedName = name.trim()

  if (trimmedName.length < 3 || trimmedName.length > 100) {
    return res.status(400).json({
      message: 'name of account must be between 3 and 100',
    })
  }

  if (
    budget === null ||
    budget === '' ||
    isNaN(Number(budget))
  ) {
    return res.status(400).json({
      message: 'budget must be a number',
    })
  }

  if (Number(budget) < 0 || Number(budget) > 1000000) {
    return res.status(400).json({
      message: 'budget of account is too large or too small',
    })
  }

  // Bütün kontroller geçtikten sonra değiştir
  req.body.name = trimmedName
  req.body.budget = Number(budget)

  next()
}
exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Accounts.getById(req.params.id)

    if (!account) {
      return res.status(404).json({
        message: 'account not found',
      })
    }

    res.locals.account = account

    next()
  } catch (err) {
    next(err)
  }
}
exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const accounts = await Accounts.getAll()

    const exists = accounts.find(
      acc =>
        acc.name.trim().toLowerCase() ===
        req.body.name.trim().toLowerCase()
    )

    if (exists && exists.id !== Number(req.params.id)) {
      return res.status(400).json({
        message: 'that name is taken',
      })
    }

    next()
  } catch (err) {
    next(err)
  }
}