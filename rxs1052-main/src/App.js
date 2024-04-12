import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chest from './components/Exercise/Chest/Chest';
import Back from './components/Exercise/Back/Back';
import Arm from './components/Exercise/Arms/Arms';
import Shoulder from './components/Exercise/Shoulder/Shoulder';
import Legs from './components/Exercise/Legs/Legs';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Account from './pages/Account/Account';
import Progress from './pages/Progress/Progress';
import Friends from './pages/Friends/Friend';
import Feed from './pages/Feed/Feed';
import { UserProvider } from './context/AuthContext';

function App() {
  return (

    
    
    <div className="App">
    <BrowserRouter>
       
        <UserProvider>
        
          <Routes>
                <Route path="/Feed" element={<Feed />} />   
                <Route path="/Friends" element={<Friends />} />
                <Route path="/Progress" element={<Progress />} />
                <Route path="/Account" element={<Account />} />
                <Route path="/Register" element={<Register />} />
          
                <Route path="/" element={<Login />} />
                <Route path="/Chest" element={<Chest />} />
                <Route path="/Back" element={<Back />} />
                <Route path="/Arms" element={<Arm />} />
                <Route path="/Shoulder" element={<Shoulder />} />
                <Route path="/Legs" element={<Legs />} />
          </Routes>
         </UserProvider>
        </BrowserRouter>
    </div>
   
    

   
  
      
 

  )
}



export default App;
