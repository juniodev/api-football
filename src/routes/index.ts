import { Router } from 'express'
import { FootBallRouter } from './Football'

const routes = Router()

routes.use('/api/v1/', FootBallRouter)

export { routes }
