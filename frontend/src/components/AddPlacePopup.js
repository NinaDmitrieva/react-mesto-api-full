import React from 'react';
import PopupWithForm from './PopupWithForm';

export default function AddPlacePopup({isOpen, onClose, onAddPlace, renderLoading}) {

  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  React.useEffect(() => {
    setName('');
    setLink('');
  }, [isOpen]); 

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace (name, link);
  };

  function changeName(e) {
   setName(e.target.value);
  };

  function changeLink(e) {
   setLink(e.target.value);
  };

  return(
    <PopupWithForm 
    title='Новое место' 
    name='foto' 
    btnText={renderLoading? 'Загружаю картинку....' :'Создать' }
    isOpen={isOpen} 
    onClose={onClose}
    onSubmit={handleSubmit}
  >
      <input className="popup__style popup__cards input" 
          type="text" 
          id="name-place"
          name="name"  
          placeholder="Название" 
          minLength="2" 
          maxLength="30" 
          required
          value={name || ''}
          onChange={changeName}
      />
      <span id="name-place-error" className="error"></span>
      <input className="popup__style popup__place input" 
          type="url" 
          name="link"  
          id="place-url"
          placeholder="Ссылка на картинку" 
          required
          value={link || ''}
          onChange={changeLink}
      />
      <span id="place-url-error" className="error"></span>
  </PopupWithForm>
  )
}