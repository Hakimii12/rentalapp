"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
const constinerVariant = {
    hidden: {opacity:0},
    visible:{
        opacity:1,
        transition :{
            staggerChildren:0.2
        }
    }
}
const itemsVariants = {
    hidden:{opacity:0,y:20},
    visible:{opacity:1,y:0}
}
function DiscoverSection() {
  return (
   <motion.div
   initial = "hidden"
   whileInView= 'visible'
   viewport={{once:true,amount:0.8}}
   variants={constinerVariant}
   className='py-12 mb-16 bg-white'>
    <div className="max-w-4xl xl:max-w-6xl mx-auto px-6 sm:px-6 lg:px-12 xl:px-16">
        <motion.div
        variants={itemsVariants}
        className='my-12 text-center'>
            <h2 className="text-3xl font-semibold leading-tight text-gray-800">
                Discover
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
                Find Your Dream Rental Property Today!
            </p>
            <p className='mt-2 text-gray-500 max-w-3xl mx-auto'>
                Searching for your dream rental property has never been easier.
                with our user-freindly search feature, you can quickly find the perfect 
                home that meets all your needs. Start your search today and discover your 
                dream rental property!
            </p>
             
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 text-center">
            {
                [
                    {
                        imageSrc:"/landing-icon-wand.png",
                        title:"Search For Properties",
                        description:
                        "Browse through our extensive collection of rental properties in your"
                    },
                    {
                        imageSrc:"/landing-icon-calendar.png",
                        title:"Book Your Rental",
                        description:
                        "Once you've found the perfect rental property,easly book it on online with just a few clicks"
                    },
                    {
                        imageSrc:"/landing-icon-heart.png",
                        title:"Enjoy your New Home",
                        description:
                        "Move into your new rental property and start enjoying your dream home!"
                    },

                ].map((card,index)=>(
                    <motion.div key={index} variants={itemsVariants}>
                        <DiscoverCard {...card}/>

                    </motion.div>
                ))
            }
        </div>

    </div>
   </motion.div>
  )
}
const DiscoverCard = ({
    imageSrc,
    title,
    description
  }:{
    imageSrc:string,
    title:string,
    description:string,
  })=>(
    <div className='px-4 py-12 shadow-lg rounded-lg bg-gray-50 md:h-72'>
        <div className="bg-gray-900 p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto">
            <Image
            src={imageSrc}
            width={30}
            height={30}
            alt={title}
            className="w-full h-full"
            />
        </div>
        <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
        <p className="mt-2 text-base text-gray-500">{description}</p>

        


    </div>
  )

export default DiscoverSection
