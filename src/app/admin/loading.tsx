import { Loader2 } from 'lucide-react'
import React from 'react'

const AdminLoading = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
        <Loader2 className='size-24 animate-spin'/>
    </div>
  )
}

export default AdminLoading