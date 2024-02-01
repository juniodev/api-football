import { type Request, type Response } from 'express'
import { CompetitionsSchema } from '../../schema/competitions'
import { redis } from '../../server'
import { queryValidationAllSports } from '../../validations/football'
import { ZodError } from 'zod'

class FootBallController {
  async index (req: Request, res: Response) {
    try {

      const {
        date,
        sort,
        'no-cache': noCache
      } = await queryValidationAllSports.parseAsync(
        req.query
      )

      if (noCache === undefined) {
        const competitionsCache = await redis.get(
          'competitions/all'
        )

        if (competitionsCache) {

          if (process.env.DEBUG) console.log('Using cache...')

          return res.status(200).json(
            {
              success: true,
              competitions: JSON.parse(competitionsCache)
            }
          ).end()
        }
      }

      const dateStart = new Date(date ?? new Date())
      dateStart.setMinutes(dateStart.getMinutes() - dateStart.getTimezoneOffset())
      dateStart.setHours(0, 0, 0, 0)

      const dateEnd = new Date(date ?? new Date())
      dateEnd.setMinutes(dateEnd.getMinutes() - dateEnd.getTimezoneOffset())
      dateEnd.setDate(dateEnd.getDate() + 1)

      console.log(dateStart)

      const competitions = await CompetitionsSchema.find(
        {
          date: {
            $gte: dateStart,
            $lt: dateEnd
          }
        }
      ).sort(
        {
          date: sort
        }
      ).select(
        [
          '-_id', '-__v',
          '-createdAt', '-updatedAt'
        ]
      ).lean()

      await redis.setEx(
        'competitions/all',
        120,
        JSON.stringify(competitions)
      )

      return res.status(200).json(
        {
          success: true,
          competitions
        }
      ).end()

    } catch (error) {
      if (process.env.DEBUG) console.log(error)
      if (error instanceof ZodError) {
        return res.status(422).json(
          {
            success: false,
            message: error.issues[0].message
          }
        ).end()
      }
      return res.status(500).json(
        {
          message: error
        }
      ).end()
    }
  }
}

export default FootBallController
