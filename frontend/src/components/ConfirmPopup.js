import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function ConfirmPopupOpen({isOpen, onClose, onCardDelete, card, renderLoading}) {

  function handleSubmit(e) {
    e.preventDefault();
    onCardDelete(card)
  };

  return(

    <PopupWithForm 

          title='Вы уверены?' 
          name='confirm' 
          btnText={renderLoading? 'Удаляю...' :'Да'} 
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
        >  
    </PopupWithForm>
  )
}