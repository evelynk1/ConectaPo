import { createContext, useState } from 'react'

export const UserContext = createContext()

export function UserProvider({ children }) {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token')
  })

  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)

    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}