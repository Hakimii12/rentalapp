import { NAVBAR_HEIGHT } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
function Navbar() {
  return (
    <div 
    className="fixed top-0 left-0 z-50 shadow-xl w-full" style={{height: `${NAVBAR_HEIGHT}`}}
    > 
    <div className='flex justify-between items-center w-full py-3 px-8 bg-gray-900 text-white'>
      <div className='flex items-center gap-4 md:gap-6'>
         <Link
         href = "/"
         className = "cursor-pointer hover:text-gray-400"
         scroll={false}
         >
          <div className='flex items-center gap-3'>
          <Image
          src="/logo.svg"
          width={24}
          height={24}
          alt="Rentful logo"
          className='w-6 h-6'
          />
          <div className='text-xl font-bold'>RENT
             <span className=' text-red-400 font-light hover:text-gray-400'>
                  IFUL
              </span>
          </div>
          </div>
         </Link>
      </div>
      <p className=' text-gray-400 hidden md:block'>Discover your perfect rental apartment with our advanced search and filtering features</p>
      <div className='flex items-center gap-5'>
        <Link href="/signin" >
        <Button variant="outline"
        className='text-white border-white bg-transparent hover:bg-white hover:text-gray-900 rounded-lg'
        >Login</Button>

        </Link>
        <Link href="/signup" >
          <Button variant="outline"
        className='bg-red-500 hover:bg-white hover:text-gray-900 rounded-lg'
        >Sign Up</Button>
        </Link>
      </div>
    </div>
    </div>
  )
}

export default Navbar
