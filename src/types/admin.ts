export interface Admin {
  _id?: string
  username: string
  email: string
  role: 'ADMIN'
  area: string
  firstName?: string
  lastName?: string
  gender?: string
  phone?: string
  dateOfBirth?: string
  address?: string
  profilePic?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateAdminData {
  username: string
  email: string
  password: string
  role: string
  area: string
  firstName?: string
  lastName?: string
  gender?: string
  phone?: string
  dateOfBirth?: string
  address?: string
  profilePic?: string[]
}

export interface UpdateAdminData {
  _id?: string
  username?: string
  email?: string
  password?: string
  area?: string
  firstName?: string
  lastName?: string
  gender?: string
  phone?: string
  dateOfBirth?: string
  address?: string
  profilePic?: string[]
}
