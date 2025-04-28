import React from 'react'

import HomeBg from '@/public/home-bg.svg'

function layout({children}:{children:React.ReactNode}) {
  return (
    <div className='px-10 py-5 min-h-screen relative bg-gradient-to-r  from-yellow-200 via-orange-200 to-red-200'>
    {/* <div className='px-10 py-5 min-h-screen relative bg-gradient-to-br from-purple-400/80  via-pink-500/20 to-red-500/20'> */}
    <div
      className='absolute inset-0'
      style={{
        backgroundImage: `url(${HomeBg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.1, 
        zIndex: 0,
      }}
    />
    <div className='relative z-10'> 
      {children}
     
    </div>
  </div>
  )
}

export default layout