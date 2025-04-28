import React from 'react'

function layout({children}:{children:React.ReactNode}) {
  return (
    <div className='px-5 py-5 bg-indigo-100  '>
        {children}
    </div>
  )
}

export default layout