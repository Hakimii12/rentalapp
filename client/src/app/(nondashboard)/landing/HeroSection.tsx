"use client"
import Image from 'next/image'
import React from 'react'
import { motion } from "framer-motion"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
function HeroSection() {
  return (
    <div className='relative h-screen'>
      <Image
      src="/landing-splash.jpg"
      alt="Rentful Rental Platform Hero Section"
      fill
      className='object-cover object-center'
      priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-60">
       <motion.div 
       initial={{opacity:0,y:20}}
       animate={{opacity:1,y:0}}
       transition={{duration:0.8}}
       className="absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full"
       >
        <div className='max-w-4xl mx-auto px-16 sm:px-12'>
            <h1 className="text-5xl font-bold text-white mb-4">Start your rental journey to finding the perfect to call home
            </h1>
            <p className="text-xl text-white mb-8">Explore our wide range of rental properties tailored to fit your lifestyle and needs!</p>
        </div>
        <div className="flex justify-center">
            <Input
            type='text'
            value="search query"
            onChange={()=>{}}
            placeholder='Search by city, neighborhood or address'
            className='w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12 '
            />
            <Button
            onClick={()=>{}}
            className='bg-red-400 text-white rounded-l-none rounded-r-xl hover:bg-red-500 h-12'
            >Search</Button>
        </div>
       </motion.div>
      </div>
    </div>
  )
}

export default HeroSection
