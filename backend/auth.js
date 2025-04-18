import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Token no proporcionat' })

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(403).json({ error: 'Token invàlid' })
  }
}

export function onlyRole(rol) {
  return (req, res, next) => {
    if (req.user?.rol === rol) next()
    else res.status(403).json({ error: 'Accés denegat' })
  }
}
