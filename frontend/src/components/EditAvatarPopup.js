import React from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup({isOpen, onClose, onUpdateAvatar, renderLoading}) {

  const avatarRef = React.useRef('');

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
    avatar: avatarRef.current.value
    });
  };

  React.useEffect(() => {
     avatarRef.current.value = '';
    }, [isOpen]);

  return (
    <PopupWithForm 
      title='Обновить аватар' 
      name='update'
      btnText={renderLoading? 'Сохраняю....' : 'Сохранить'}  
      isOpen={isOpen} 
      onClose={onClose}
      onSubmit={handleSubmit}
    >

     <span id="name-place-error-one" className="error"></span>
       <input className="popup__style popup__place input" 
               type="url" 
               name="avatar"
               id="avatar-id"
               placeholder="Ссылка на картинку" 
               required
               ref={avatarRef}
       />

     <span id="place-url-error-two" className="error"></span>
  </PopupWithForm>
  )
}