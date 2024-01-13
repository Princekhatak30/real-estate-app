import React, { useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import { useNavigate, useParams} from 'react-router-dom'

export default function UpdateLIsting() {
const {currentUser} = useSelector(state=>state.user)
const navigate = useNavigate()
const params = useParams()

const [files, setFiles]= useState([])
const [ formData, setFormData]= useState({
    imagesUrls : [],
    name: '',
    description:'',
    address:'',
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:50,
    discountedPrice:0,
    offer:false,
    parking:false,
    furnished:false,
})

const [imageUploadError, setImageUploadError]= useState(false)
const [uploading, setUploading]= useState(false)
const [ error, setError]= useState(false)
const [loading, setLoading]= useState(false)

   
useEffect(()=>{
const fetchListing = async ()=>{
const listingId = params.listingId
const res = await fetch(`/api/get/${listingId}`)
const data = await res.json()
if(data.success === false){
    return;
}
 // Ensure that data is an array with at least one element
 if (Array.isArray(data.data) && data.data.length > 0) {
    // Extract the first element from the array
    const listingData = data.data[0];

    // Parse imagesUrls from string to array
    const parsedData = {
      ...listingData,
      imagesUrls: listingData.imagesUrls ? JSON.parse(listingData.imagesUrls) : [],
    };
    setFormData(parsedData);
  } else {
    console.error('Invalid data structure received');
  }
}
fetchListing()
},[])

const handleImageSubmit = ()=>{
    if(files.length > 0 && files.length + formData.imagesUrls.length < 7){
        setUploading(true)
        setImageUploadError(false)
const promises = []
for(let i = 0; i < files.length; i++){
    promises.push(storeImage(files[i]));

}
Promise.all(promises).then((urls)=>{
    setFormData({...formData, imagesUrls: formData.imagesUrls.concat(urls)})
    setImageUploadError(false)
    setUploading(false)

}).catch((err)=>{
    setImageUploadError('Image upload faile (2 mb max for image)')
    setUploading(false)

})
   }else {
    setImageUploadError('You can only upload 6 images per listing')
   }
}
const storeImage = async (file)=>{
    return new Promise((resolve, reject)=>{
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress = 
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            },
            (error)=>{
                reject(error)
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    resolve(downloadURL)
                })
            }

        )
    })
}

const handleRemoveImage = (index)=>{
   setFormData({
        ...formData,
        imagesUrls: formData.imagesUrls.filter((_, i)=> i !== index)
    })
}

const hadleChange = (e) =>{
if(e.target.id === 'sale' || e.target.id === 'rent' ){
    setFormData({
        ...formData,
        type:e.target.id
    })
}

if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
    setFormData({
        ...formData,
        [e.target.id]:e.target.checked
    })
}

if(e.target.type === 'number' || e.target.type === 'text'  || e.target.type === 'textarea' ){
    setFormData({
        ...formData,
        [e.target.id]:  e.target.value
    })
}
}
const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
       if (formData.imagesUrls.length < 1)
       return setError('You must upload atleast one image');
    if(+formData.regularPrice < +formData.discountedPrice) 
    return setError('Discounted price must be lower than regular price')
        setLoading(true)
        setError(false)
        const convertedFormData = {
            ...formData,
            regularPrice: parseFloat(formData.regularPrice),
            discountedPrice: parseFloat(formData.discountedPrice),
          };
        const res= await fetch(`/api/updateListing/${params.listingId}`,{
            method: 'PUT',
            headers: {
                'content-type':'application/json',
            },
        body:JSON.stringify({...convertedFormData,
        userRef: currentUser.data.user.userid
        })
        });
const data = await res.json()
setLoading(false);
if(data.success === false){
    setError(data.message)
    setLoading(false)
}

navigate(`/listing/${data.data.listingId}`)

    } catch (error) {
       setError(error.message)
       setLoading(false) 
    }
}

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update a Lisiting</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4' >
<div className='flex flex-col gap-4  flex-1'>
    <input
    
     type="text"
     placeholder='Name'
      className='border p-3 rounded-lg'
       id='name'
        maxLength="62" 
        minLength="10" 
        required

        onChange={hadleChange}
        value={formData.name}
        />
    <textarea type="text" 
    placeholder='Description' 
    className='border p-3 rounded-lg'
     id='description' 
      required 
      onChange={hadleChange}
        value={formData.description}
      />
    <input type="text" 
    placeholder='Address'
     className='border p-3 rounded-lg'
      id='address'  
      required
      onChange={hadleChange}
        value={formData.address}
       />
    <div className='flex gap-6 flex-wrap'>
        <div className='flex gap-2'>
            <input type="checkbox" id='sale' className='w-5'
            onChange={hadleChange}
            checked={formData.type === 'sale'}
            />
            <span>Sell</span>
        </div>
        <div className='flex gap-2'>
            <input type="checkbox" id='rent' className='w-5'
             onChange={hadleChange}
             checked={formData.type === 'rent'}
            />
            <span>Rent</span>
        </div>
        <div className='flex gap-2'>
            <input type="checkbox" id='parking' className='w-5'
             onChange={hadleChange}
             checked={formData.parking}
            />
            <span>Parking spot</span>
        </div>
        <div className='flex gap-2'>
            <input type="checkbox" id='furnished' className='w-5' 
             onChange={hadleChange}
             checked={formData.furnished}
            />
            <span>Furnished</span>
        </div>
        <div className='flex gap-2'>
            <input type="checkbox" id='offer' className='w-5'
             onChange={hadleChange}
             checked={formData.offer}
            />
            <span>Offer</span>
        </div>
    </div>
    <div className="flex flex-wrap gap-6">
        <div className=" flex items-center gap-2">
            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bedrooms' min='1' max='10'
              value={formData.bedrooms}
             onChange={hadleChange}
             checked={formData.bedrooms}
            />
            <p>Beds</p>
        </div>
        <div className=" flex items-center gap-2">
            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bathrooms' min='1' max='10'
              value={formData.bathrooms}
             onChange={hadleChange}
             checked={formData.bathrooms}
            />
            <p>Baths</p>
        </div>
        <div className=" flex items-center gap-2">
            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='regularPrice' min='50' max='10000000'
              value={formData.regularPrice} 
             onChange={hadleChange}
             checked={formData.regularPrice}
            />
            <div v className="flex flex-col items-center">
            <p>Regular price</p>
<span className='text-xs'>($ / month)</span>
            </div>
        </div>
        {formData.offer && (


        <div className=" flex items-center gap-2">
            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='discountedPrice' min='0' max='10000000'
              value={formData.discountedPrice}
             onChange={hadleChange}
             checked={formData.discountedPrice}
            />
            <div className="flex flex-col items-center">
            <p>Discounted price</p>
            <span className='text-xs'>($ / month)</span>

            </div>
        </div>
        )}
    </div>
</div>
<div className="flex flex-col flex-1 gap-4 ">
    <p className='font-semibold'>Images:
    <span className='font-normal text-gray-600  ml-2'>The first image will be the cover  (max 6)</span>
    </p>
    <div className="flex gap-4">
        <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border-gray-300 rounded w-full' type="file" id='images' accept='images/*' multiple />

        <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uplading...':'Upload'}</button>
    </div>
    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
    {
          formData.imagesUrls && formData.imagesUrls.length > 0 && formData.imagesUrls.map((url,  index)=>(
            <div className="flex justify-between p-3 border items-center">

                <img key={url} src={url} alt="listing image" className='w-40 left-40 object-cover rounded-lg' />
                <button type='button' onClick={ ()=>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75' >Delete</button>
            </div>
        ))
    }

<button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Updating...': 'Update listing'}</button>
{error && <p className='text-red-700 text-sm'>{error}</p> }
</div>
      </form>
    </main>
  )
}
