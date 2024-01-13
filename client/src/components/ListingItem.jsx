import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

export default function ListingItem({ listing }) {


    const imagesUrls = JSON.parse(listing.imagesUrls)
    const listings = { ...listing, imagesUrls: imagesUrls }
    

    return (
        <div className='bg-white flex shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
            <Link to={`/listing/${listings.listingId}`}>
                <img src={listings.imagesUrls[0]} alt="listing cover" className=' h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transitions-scale duration-300'
                />
                <div className="p-3 flex flex-col gap-2 w-full">
                    <p className='text-lg font-semibold text-slate-700 truncate'>{listings.name}</p>
                    <div className=" flex items-center gap-1">
                        <MdLocationOn className='h-4 w-4  text-green-700' />
                        <p className='text-sm text-gray-600 truncate w-full'>{listings.address}</p>
                    </div>
                    <p className='text-sm text-gray-600 line-clamp-2'>{listings.description}</p>
                    <p className='text-slate-500  mt-2 font-semibold'>
                        ${' '}
                        {listings.offer ? listings.discountedPrice.toLocaleString('en-US') : listings.regularPrice.toLocaleString('en-US')}
                        {listings.type === 'rent' && ' / month'}
                    </p>
                    <div className="text-slate-700 flex gap-4">
                        <div className="font-bold text-xs">
                            {listings.bedrooms > 1 ? `${listings.bedrooms} beds` : `${listings.bedrooms} bed`}
                        </div>
                        <div className="font-bold text-xs">
                            {listings.bathrooms > 1 ? `${listings.bathrooms } beds` : `${listings.bathrooms } bed`}
                        </div>
                    </div>
                </div>
            </Link>

        </div>
    )
}
