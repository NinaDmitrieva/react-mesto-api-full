import React from 'react';
import PopupWithForm from './PopupWithForm';
import {CurrentUserContext}  from '../contexts/CurrentUserContext';

export default function EditProfilePopup({isOpen, onClose, onUpdateUser, renderLoading}) {

  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser,  isOpen]); 

  function handleSubmit(e) {
    e.preventDefault();
     onUpdateUser({
      name,
      about: description,
    });
  };

  function changeName(e) {
    setName(e.target.value);
  };

  function changeDescription(e) {
  setDescription(e.target.value);
  };

    return (
        <PopupWithForm 
        title='Редактировать профиль' 
        name='_profile' 
        btnText={renderLoading? 'Сохранение...' : 'Сохранить'}
        isOpen={isOpen} 
        onClose={onClose}
        onSubmit={handleSubmit}
      >
          <input className="popup__style popup__name input"
                  placeholder='Имя'
                  type="text"
                  name="name"
                  minLength="2"  
                  maxLength="40" 
                  id="name"
                  required
                  value={name || ''}
                  onChange={changeName}
          />
          <span id="name-card-error" className="error"></span>
          <input className="popup__style popup__work input" 
                  placeholder="Профессиональная деятельность"   
                  type="text" 
                  name="job"             
                  minLength="2" 
                  maxLength="200"
                  id="about"
                  required
                  value={description || ''}
                  onChange={changeDescription}
          />
          <span id="work-error" className="error"></span>
      </PopupWithForm>
    )
}