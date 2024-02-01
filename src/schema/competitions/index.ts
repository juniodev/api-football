import { type Document, model, Schema } from 'mongoose'

const ODDSchema = new Schema<{
  home: string
  draw: string
  away: string
}>({
  home: {
    type: String,
    required: true
  },
  draw: {
    type: String,
    required: true
  },
  away: {
    type: String,
    required: true
  }
}, { _id: false })

const PercentageSchema = new Schema<{
  home: string
  draw: string
  away: string
}>({
  home: {
    type: String,
    required: false
  },
  draw: {
    type: String,
    required: false
  },
  away: {
    type: String,
    required: false
  }
}, { _id: false })

const HistorySchema = new Schema<{
  home: Array<{
    home: string
    away: string
    date: string
    result: string
  }>
  away: Array<{
    home: string
    away: string
    date: string
    result: string
  }>
}>({
  home: [{
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => {
        let id = ''
        for (let i = 0; i < 10; i++) {
          id += chars[
            Math.floor(Math.random() * [...chars].length)
          ]
        }
        return id
      }
    },
    home: {
      type: String,
      required: true
    },
    away: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    result: {
      type: String,
      required: true
    }
  }],
  away: [{
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => {
        let id = ''
        for (let i = 0; i < 10; i++) {
          id += chars[
            Math.floor(Math.random() * [...chars].length)
          ]
        }
        return id
      }
    },
    home: {
      type: String,
      required: true
    },
    away: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    result: {
      type: String,
      required: true
    }
  }]
}, { _id: false })

const CompetitionResult = new Schema<{
  home: string
  away: string
}>(
  {
    away: {
      type: String,
      required: false,
      default: '-'
    },
    home: {
      type: String,
      required: false,
      default: '-'
    }
  }, { _id: false }
)

interface ICompetitions extends Document {
  id: string
  home: string
  away: string
  result: {
    home: string
    away: string
  }
  competition: string
  stadium: string
  date: Date
  status: 'pending' | 'live' | 'finished' | 'canceled' | 'postponed' | 'suspended'
  odds: {
    home: string
    draw: string
    away: string
  }
  percentages: {
    home: string
    draw: string
    away: string
  }
  history: {
    home: Array<{
      id: string
      home: string
      away: string
      result: string
      date: string
    }>
    away: Array<{
      id: string
      home: string
      away: string
      result: string
      date: string
    }>
  }
  complete_informations: boolean
}

const chars = 'ABCxyzDEIJKLghiMNjkPQWtuXYZabcSTUdelOfmRVnoFGHpqrsvw'

const schema = new Schema<ICompetitions>(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => {
        let id = ''
        for (let i = 0; i < 10; i++) {
          id += chars[
            Math.floor(Math.random() * [...chars].length)
          ]
        }
        return id
      }
    },
    home: {
      type: String,
      index: true,
      required: true
    },
    away: {
      type: String,
      index: true,
      required: true
    },
    result: CompetitionResult,
    competition: {
      type: String,
      index: true,
      required: true
    },
    stadium: {
      type: String,
      required: false
    },
    date: {
      type: Date,
      index: true,
      required: true
    },
    status: {
      type: String,
      enum: [
        'pending', 'live', 'finished',
        'canceled', 'postponed', 'suspended'
      ],
      default: 'pending'
    },
    odds: ODDSchema,
    percentages: PercentageSchema,
    history: HistorySchema,
    complete_informations: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const CompetitionsSchema = model('Competitions', schema)

export { type ICompetitions, CompetitionsSchema }
