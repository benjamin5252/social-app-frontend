import { ReactNode } from "react"

export interface UserObj {
  name: string,
  username: string,
  id: number,
  profilePic: string
}

export interface msgObj {
  reply: string,
  message: string,
  from: number,
  to: number,
  sendAt: number
}

export interface ContextProviderProps {
  children: ReactNode
}
