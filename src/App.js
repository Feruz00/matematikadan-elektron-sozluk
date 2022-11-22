
import {BrowserRouter as Router, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import Home from './components/dashboard/Home';
// import Home from './components/dashboard/Home';
// import Forgot from './components/forgot/Forgot';
import Login from './components/login/Login';
import Main from './components/mainpage/Main';
import Update from './components/update/Update';
// import Settings from './components/settings/Settings';
import { AuthProvider, Auth } from './context';

function App() {
  return (
    <>
    <Router>
    
      <AuthProvider>
        <Routes>
          <Route 
            path='/'
            element={
              <ProtectedRoute access={false} >
                <Main />
              </ProtectedRoute>
            }
          />

          <Route 
            path='/login'
            element={
              <ProtectedRoute access={false} >
                <Login/>
              </ProtectedRoute>
            }
          />
          
          <Route 
            path='/admin'
            element={
              <ProtectedRoute access={true} >
                <Home />
              </ProtectedRoute>
            }
          />
          <Route 
            path='/admin/:id'
            element={
              <ProtectedRoute access={true} >
                <Update />
              </ProtectedRoute>
            }
          />

          
        </Routes>
        
      </AuthProvider>
      
    </Router>
    </>
  );
}

const ProtectedRoute = ({ children,access}) => {
  const {user} = Auth()
  
  if(access && !user) {
    return <Navigate to='/login' replace />;
  }
  if(!access && user){
    return <Navigate to='/admin' replace />
  }
  // if(!user) return <Navigate to='/login' replace />
  return children;
};

export default App;
