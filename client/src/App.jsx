import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import About from "./pages/About"
import Header from './components/Header';
import PrivetRoute from './components/PrivetRoute'
import CreateListing from './pages/CreateListing';
import UpdateLIsting from './pages/UpdateLIsting';
import Listing from './pages/Listing';
import Search from './pages/Search';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/search" element={<Search />} />

          <Route element={<PrivetRoute />} >

            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/update-lisitng/:listingId" element={<UpdateLIsting />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}
