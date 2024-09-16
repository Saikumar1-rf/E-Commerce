import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Forgotpass from './Forgotpass';
import RegisterForm from './RegisterForm';




function App() {

  
  return (
    <div className="App">
    {/* <BrowserRouter> */}
    <Routes>
   
   <Route path='/' element={<Login/>}></Route>
   <Route path='/login'element={<Login/>}></Route>
   <Route path='/' element={<Login/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
   <Route path='/forgotpass' element={<Forgotpass/>}></Route>
   <Route path='/register' element={<RegisterForm/>}></Route>
   </Routes>
   {/* </BrowserRouter>  */}
     {/* <Forgotpass/> 
   <Login/> */}
    </div>
  );
}

export default App;
