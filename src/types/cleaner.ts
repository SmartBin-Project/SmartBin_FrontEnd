export interface Cleaner {
  _id?: string
  name: string
  telegramChatId: string
  area: string
  pictureCleaner: string[]
  acceptCount: number
  rejectCount: number
}
