import React from "react";
import { Link } from "react-router-dom";
import Loginerror from './../images/Loginerror.png'; 
import Loginok from './../images/Loginok.png'


export default function InfoTooltip({ onClose, isOpen, isCompleted} ) {

    return (
            <section className={`popup popup__registration-form ${isOpen? 'popup_activ' : ''}`}>
                <button className="popup__close-icon popup__close"
                    type="button"
                     onClick={onClose}
                    >
                </button>
           
                <div className="popup__registration-box">

          {isCompleted ?
                <>
                  <img className="popup__registration-img" alt="результат регистрации, либо Loginok, Login" src={Loginok}/>
                  <h3 className="popup__text">Вы успешно зарегистрировались!</h3> 
               </>

               :
                <> 
                  <img className="popup__registration-img" alt="результат регистрации, либо Loginok, Login" src={Loginerror} />
                  <h3 className="popup__text">Что-то пошло не так!
                  <Link to="signup" className="popup__text-link">Попробуйте ещё раз!</Link>
                  </h3>
                </>
                }
                
                </div>
                
             
        </section>
    )
}