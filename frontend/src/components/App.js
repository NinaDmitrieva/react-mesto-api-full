
import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { api } from './../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ConfirmPopupOpen from './ConfirmPopup';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import * as auth from './../utils/auth'


export default function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [renderLoading, setRenderLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTooltip, setIsInfoTooltip] = useState(false);
  const [card, setCard] = useState({});
  const [deletedPopup, setDeletedPopup] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const history = useHistory();

  function handleTokenCheck() {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      auth.getUserData(jwt)
          .then((res) => {
            if(res)
            setLoggedIn(true);
            setEmail(res.data.email);
            history.push('/');
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
  
  useEffect(() => {
    handleTokenCheck();
  }, []);

  // useEffect(() => {
  //   if (loggedIn) {
  //     api.getUserInfo()
  //       .then((data) => {
  //         setCurrentUser(data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //     api.getInitialCards()
  //       .then((cards) => {
  //         setCards(cards)
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       }); 
  //   }
  // }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards);
        })
        .catch((err) => console.log(`Ошибка ${err}`));
    }else {
    return;
  }
  }, [loggedIn]);

  function handleLoginSubmit(email, password) {
    auth.authorization(email, password)
          .then((res) => {
            if(res) {
              localStorage.setItem('jwt', res.token)
              setEmail(email);
              setLoggedIn(true);
              history.replace({ pathname: "/" });
            }
          })
          .catch((err) => {
            console.log(err);
          })
  }

  const handleRegisterSubmit = (email, password) => {
    auth.registration(email, password)
        .then((res) => {
          if(res) {
          setIsInfoTooltip(true);
          setLoggedIn(true)
          history.push("/signin");
        }})
        .catch((err) => {
        console.log(err);
      })
      .catch(() => {
        setIsInfoTooltip(true);
        setLoggedIn(false)
      })
  }

  function handleConfirmClick(card) {
    setConfirmPopupOpen(true);
    setDeletedPopup(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLike(card._id, !isLiked).
      then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.lig(err)
      })
  };

  function handleCardDelete(card) {
    setRenderLoading(true)
    api.deleteCard(card._id).
      then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id))
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setRenderLoading(false)
      })
  };

  function handleChangeUser(user) {
    setRenderLoading(true)
    api.setUserInfo(user.name, user.about).
      then((userData) => {
        setCurrentUser({
          ...currentUser,
          name: userData.name,
          about: userData.about
        });
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setRenderLoading(false)
      })
  };

  function handleUpdateAvatar(data) {
    setRenderLoading(true)
    api.setAvatarInfo(data).
      then((data) => {
        setCurrentUser({
          ...currentUser,
          avatar: data.avatar
        });
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setRenderLoading(false)
      })
  };

  function handleAddNewCard(card) {
    setRenderLoading(true)
    api.addNewCard(card.name, card.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setRenderLoading(false)
      })
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleCardClick(card) {
    setCard(card);
  };

  function handleSetIsInfoTooltip() {
    setIsInfoTooltip(false);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setConfirmPopupOpen(false)
    setCard({})
    setDeletedPopup({})
    handleSetIsInfoTooltip(true)

  };

  function exitUser() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push("/signin");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <div className="page">
          <Header 
          email={email} 
          loggedIn={loggedIn}
          exitUser={exitUser} 
          />

          <Switch>

          <ProtectedRoute 
            exact path="/"
            loggedIn={loggedIn} 
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatarClick={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleConfirmClick}
            cards={cards}
            />
          <Route path="/signup"> 
            <Register 
                onRegister={handleRegisterSubmit}
            />
          </Route>
           
          <Route path="/signin"> 
            <Login
                onLogin={handleLoginSubmit}
            />
          </Route>

          <Footer />

        </Switch>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleChangeUser}
            renderLoading={renderLoading}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddNewCard}
            renderLoading={renderLoading}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            renderLoading={renderLoading}
          />

          <ConfirmPopupOpen
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            onCardDelete={handleCardDelete}
            card={deletedPopup}
            renderLoading={renderLoading}
          />

          <ImagePopup
            card={card}
            onClose={closeAllPopups}
          />

          <InfoTooltip 
            onClose={closeAllPopups}
            isOpen={isInfoTooltip}
            loggedIn={loggedIn}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}