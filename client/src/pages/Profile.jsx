import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { deleteUserFailure, deleteUserStart, deleteuserSuccess, signoutUserFailure, signoutUserStart, signoutuserSuccess, updateUserStart, updateUserSuccess, updateUserfailure } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
export default function Profile() {
  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector((state) => state.user)

  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingError, setShowLisitingError] = useState(false)
  const [userLisitngs, setuserListings] = useState([])
  const dispatch = useDispatch()

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 3 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }

  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
      },

      (error) => {
        setFileUploadError(true)
      },
      () => {

        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL })
          })
      }
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser.data.user.userid}`, {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserfailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)

    } catch (error) {
      dispatch(updateUserfailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser.data.user.userid}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteuserSuccess(data))

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart())
      const res = await fetch(`api/auth/signout`);
      const data = await res.json()
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message))
      }
      dispatch(signoutuserSuccess(data))
    } catch (error) {
      dispatch(signoutUserFailure(error.message))
    }
  }

  const handleShowLisiting = async () => {
    try {
      setShowLisitingError(false)
      const res = await fetch(`/api/getListing/${currentUser.data.user.userid}`);
      const data = await res.json()
      if (data.success === false) {
        setShowLisitingError(true);
        return
      }
      setuserListings(data)
    } catch (error) {
      setShowLisitingError(true)
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/deleteListing/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json()
      if (data.success === false) {
        return
      }
      setuserListings((prev) => {
        if (prev && prev.data && Array.isArray(prev.data)) {
          const updatedData = prev.data.filter((listing) => listing.listingId !== listingId);
          return { ...prev, data: updatedData };
        } else {
          console.log('Previous State is not as expected:', prev);
          return prev; // Return the previous state unchanged
        }
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.data.user.avatar} alt="profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm  self-center'>
          {fileUploadError ?
            (<span className='text-red-700'>Error Image Upload (Image must be less then 2 mb )</span>) :
            filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>
                {`Uploading ${filePerc}%`}
              </span>)
              :
              filePerc === 100 ? (
                <span className='text-green-700'>
                  Image successfully uploaded!
                </span>
              ) : (""
              )}
        </p>
        <input defaultValue={currentUser.data.user.username
        } type="text" placeholder='username'
          className='border p-3 rounded-lg'
          id='username' onChange={handleChange}
        />
        <input defaultValue={currentUser.data.user.email} type="email" placeholder='email'
          className='border p-3 rounded-lg'
          id='email' onChange={handleChange}
        />
        <input type="password" placeholder='password'
          className='border p-3 rounded-lg'
          id='password' onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading' : 'Update'}</button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign  Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "User is updated successfully!" : ''}</p>
      <button onClick={handleShowLisiting} className='text-green-700 w-full'>Show Lisitng</button>
      <p className='text-red-700 mt-5'>{showListingError ? 'Error showing listing' : ''}</p>
      {userLisitngs.data && userLisitngs.data.length > 0 &&
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userLisitngs.data.map((listing) => {

            const imagesUrlsArray = JSON.parse(listing.imagesUrls);
            return (
              <div key={listing.listingId} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                <Link to={`/listing/${listing.listingId}`}>
                  <img src={imagesUrlsArray[0]} alt="listing cover" className='h-16 w-16  object-contain ' />
                </Link>
                <Link className='flex-1 text-slate-700 font-semibold  hover:underline truncate' to={`/listing/${listing.listingId}`}>
                  <p >{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button onClick={() => handleListingDelete(listing.listingId)} className='text-red-700 uppercase'>Delete</button>
                  <Link to={`/update-lisitng/${listing.listingId}`}>
                    <button className='text-green-700 uppercase'>Edit</button>

                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      }

    </div>
  )
}
