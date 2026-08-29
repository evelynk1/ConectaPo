/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react'
export const UserContext = createContext()
export function UserProvider({ children }) {

  const [user, setUser] = useState(() => {
    try { //se agrega un try catch para manejar errores al parsear el JSON del usuario guardado en localStorage
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch (error) {
      console.error("Error leyendo el usuario", error)
      localStorage.removeItem('user')
      return null
    }
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