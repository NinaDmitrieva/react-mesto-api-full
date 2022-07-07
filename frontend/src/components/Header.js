import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './../images/Vector.svg'; 

export default function Header({ loggedIn, email, exitUser}) {
 
  const location = useLocation();
  
    return (
     <header className="header">
        <img className="header__logo" alt="Логотип" src={Logo} />

        {loggedIn ?

        <div className='header__menu'>
          <p className='header__user-email'>{email}</p> 
            <Link to="signin" onClick={exitUser} className='header__user-exit'>Выйти</Link>
        </div>

         :
            ( (location.pathname === '/sign-in') ? 
            (<Link to="/signup" className='header__user-exit'>Регистрация</Link>) : 
            (<Link to="/signin" className='header__user-exit'>Войти</Link>))
        }

    </header>
    );
  }
  