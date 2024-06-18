import React from 'react'
import EmployeeSidebar from './EmployeeSidebar'
import ChatPage from './ChatPage'

export const Empdashbord = () => {
  return (
    <div className='flex gap-2 items-center w-full'>
        <EmployeeSidebar/>
        <ChatPage className="w-full"/>

    </div>
  )
}
