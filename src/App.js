import { createContext, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import { authStateChangedListener, createUserDocumentFromAuth } from '../utils/firebase/firebase.utils';
import Navigation from './routes/navigation/navigation.component';
import Home from './routes/home/home.component';
import Authentication from './routes/authentication/authentication.component';
import Shop from './routes/shop/shop.component';
import Checkout from './routes/checkout/checkout.component';




const App = () => {
  
  useEffect(()=>{
    const unsubscribe = authStateChangedListener((user)=>{
        if (user) {
            createUserDocumentFromAuth(user);
        }
        setCurrentUser(user);
    });

    return unsubscribe
},[])

  return (
    <Routes>
      <Route path='/' element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path='shop/*' element={<Shop />} />
        <Route path='auth' element={<Authentication />} />
        <Route path='checkout' element={<Checkout />} />
      </Route>
    </Routes>
  )
}

export default App;
