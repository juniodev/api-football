import { Router } from 'express'
import FootBallController from '../controllers/football'

const router = Router()

const controller = new FootBallController()

router.get('/competitions/all', controller.index)

export { router as FootBallRouter }
