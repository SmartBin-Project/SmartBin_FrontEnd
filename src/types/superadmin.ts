export interface SuperAdmin {
  username: string
  email: string
  role: 'SUPERADMIN' | 'ADMIN'
  area: string
  profilePic?: string
  password?: string
  firstName?: string
  lastName?: string
  gender?: string
  phone?: string
  dateOfBirth?: string
  address?: string
}
