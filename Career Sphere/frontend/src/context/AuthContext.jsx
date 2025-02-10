import React from 'react'
import { createContext } from 'react'
import { Children } from 'react'
export const authDataContext=createContext()

function AuthContext({children}) {
const serverUrl="http://localhost:8000"
    let value={
        serverUrl
    }
  return (
    <div>
    <authDataContext.Provider value={value}>
    {children}
    </authDataContext.Provider>
    </div>
  )
}

export default AuthContext
