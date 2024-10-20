import { i18n } from '../../i18n-config'
import { z } from 'zod'

import { addNewBoardSchema } from './validations'

export type Locale = (typeof i18n)['locales'][number]
export type AddNewBoardSchema = z.infer<typeof addNewBoardSchema>
