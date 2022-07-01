
import { useState, useEffect } from 'react';
import { Route,Routes, useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

   const [state, setState] = useState({
    isEditProfilePopupOpen: false,
    isAddPlacePopupOpen: false,
    isEditAvatarPopupOpen: false,
    isConfirmPopupOpen: false,
    renderLoading: false,
    email: '',
    loggedIn: false,
    isInfoTooltip: false,
    card: {},
    deletedPopup:{},
    currentUser:{},
    cards: []
  });

  function handleTokenCheck() {
    const jwt = localStorage.getItem('jwt')

    if (jwt) {
      auth.getUserData(jwt)
        .then((res) => {
          if (res)
            setState({
              ...state, loggedIn: true,
              email: res.data.email
            })
          navigate('/');
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  useEffect(() => {
    handleTokenCheck();
  }, []);

  useEffect(()=> {
    state.loggedIn &&
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
       
       setState({
                ...state, currentUser: userData,
               cards: cardsData
        })
      })
      .catch((err)=>{
        console.log(err);
      });
  }, [state.loggedIn])

  function handleLoginSubmit(email, password) {
    auth.authorization(email, password)
      .then((res) => {
        if (res) {
          localStorage.setItem('jwt', res.token)
          setState({
            ...state, email: email,
            loggedIn: true
          })
          navigate("/");
        }
      })
      .catch(() => {
        setState({
          ...state, loggedIn: false,
          isInfoTooltip: true
        })
      })
  }

  const handleRegisterSubmit = (email, password) => {
    auth.register(email, password)
      .then((res) => {
        if (res) {
          setState({
            ...state, loggedIn: true,
            isInfoTooltip: true
          })
          navigate("/sign-in");
        }
      })
      .catch(() => {
        setState({
          ...state, loggedIn: false,
          isInfoTooltip: true
        })
      })
  }

  function handleConfirmClick(card) {
    setState({
      ...state, isConfirmPopupOpen: true,
      deletedPopup: card
    })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === state.currentUser._id);
    api.changeLike(card._id, !isLiked).
      then((newCard) => {
        //setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        setState({
          ...state, cards: (state) => state.map((c) => c._id === card._id ? newCard : c)
        })
      })
    
      .catch((err) => {
        console.log(err)
      })
  };

  function handleCardDelete(card) { 
        setState({
      ...state, renderLoading: true
    })
    api.deleteCard(card._id).
      then(() => {
        //setCards((state) => state.filter((c) => c._id !== card._id))
        setState({
          ...state, cards: (state) => state.filter((c) => c._id !== card._id)
        })
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      setState({
          ...state, renderLoading: false
      })
      })
  };

  function handleChangeUser(user) {
    setState({
      ...state, renderLoading: true
    })
    api.setUserInfo(user.name, user.about).
      then((userData) => {
        setState({
          ...state, currentUser:
          {
            name: userData.name,
            about: userData.about
          }
        })
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      setState({
          ...state, renderLoading: false
      })
      })
  };

  function handleUpdateAvatar(data) {
    setState({
      ...state, renderLoading: true
    })
    api.setAvatarInfo(data).
      then((data) => {
       setState({
          ...state, currentUser:
           {avatar: data.avatar }
       })
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      setState({
          ...state, renderLoading: false
      })
      })
  };

  function handleAddNewCard(card) {
    setState({
      ...state, renderLoading: true
    })
    api.addNewCard(card.name, card.link)
      .then((newCard) => {
        const addNewCard = [newCard, ...state.cards];
        setState({
          ...state,
          cards: addNewCard,
        })
        closeAllPopups()
      }) 
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setState({
          ...state, renderLoading: false
        })
      })
  };

  function handleEditProfileClick() {
    setState({
      ...state, isEditProfilePopupOpen: true
    })
  };

  function handleAddPlaceClick() {
    setState({
      ...state, isAddPlacePopupOpen: true
    })
  };

  function handleEditAvatarClick() {
    setState({
      ...state, isEditAvatarPopupOpen: true
    })
  };

  function handleCardClick(card) {
    setState({
      ...state, card: card
    }) 
  };

  function handleSetIsInfoTooltip() {
    setState({
      ...state, isInfoTooltip: true
    }) 
  }


  function closeAllPopups() {
    setState({
      ...state, card: {},
      deletedPopup: {},
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isConfirmPopupOpen: false,
      
    })
  };

  function exitUser() {
    localStorage.removeItem('jwt');
    setState({
      ...state, loggedIn: false

    })
  }

  return (
    <CurrentUserContext.Provider value={state.currentUser}>
      <div className="root">
        <div className="page">
          <Header
            email={state.email}
            loggedIn={state.loggedIn}
            exitUser={exitUser}
          /> 

          <Routes>

            <Route path="*" element={
              <ProtectedRoute loggedIn={state.loggedIn}> 
                <Main
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatarClick={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleConfirmClick}
                  cards={state.cards}
                />
                <Footer />

              </ProtectedRoute>
            }/>

            <Route path="/sign-up" element={
              <Register onRegister={handleRegisterSubmit}/> }>
            </Route>

            <Route path="/sign-in" element={
             <Login onLogin={handleLoginSubmit}/> }>
            </Route>

          </Routes>

          <EditProfilePopup
            isOpen={state.isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleChangeUser}
            renderLoading={state.renderLoading}
          />

          <AddPlacePopup
            isOpen={state.isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddNewCard}
            renderLoading={state.renderLoading}
          />

          <EditAvatarPopup
            isOpen={state.isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            renderLoading={state.renderLoading}
          />

          <ConfirmPopupOpen
            isOpen={state.isConfirmPopupOpen}
            onClose={closeAllPopups}
            onCardDelete={handleCardDelete}
            card={state.deletedPopup}
            renderLoading={state.renderLoading}
          />

          <ImagePopup
            card={state.card}
            onClose={closeAllPopups}
          />

          <InfoTooltip
            onClose={handleSetIsInfoTooltip}
            isOpen={state.isInfoTooltip}
            loggedIn={state.loggedIn}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

/*тут вобще без комментариев */

// import { useState, useEffect } from 'react';
// import { Route, Routes, useNavigate } from 'react-router-dom';

// import Header from './Header';
// import Footer from './Footer';
// import Main from './Main';
// import ImagePopup from './ImagePopup';
// import EditProfilePopup from './EditProfilePopup';
// import EditAvatarPopup from './EditAvatarPopup';
// import AddPlacePopup from './AddPlacePopup';
// import { api } from './../utils/Api';
// import { CurrentUserContext } from '../contexts/CurrentUserContext';
// import ConfirmPopupOpen from './ConfirmPopup';
// import Register from './Register';
// import Login from './Login';
// import ProtectedRoute from './ProtectedRoute';
// import InfoTooltip from './InfoTooltip';
// import * as auth from './../utils/auth'

// export default function App() {

//   const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
//   const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
//   const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
//   const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
//   const [renderLoading, setRenderLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [isInfoTooltip, setIsInfoTooltip] = useState(false);
//   const navigate = useNavigate();
//   const [card, setCard] = useState({});
//   const [deletedPopup, setDeletedPopup] = useState({});
//   const [currentUser, setCurrentUser] = useState({});
//   const [cards, setCards] = useState([]);

//   function handleTokenCheck() {
//     const jwt = localStorage.getItem('jwt');

//     if (jwt) {
//       auth.getUserData(jwt)
//         .then((res) => {
//           if (res)
//             setLoggedIn(true);
//           setEmail(res.data.email);
//           navigate('/');
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     }
//   }

//   useEffect(() => {
//     handleTokenCheck();
//   }, []);

//   useEffect(() => {
//     if (loggedIn)
//       api.getUserInfo()
//         .then((data) => {
//           setCurrentUser(data);
//           console.log(data)
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     api.getInitialCards()
//       .then((cards) => {
//         setCards(cards)
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   function handleLoginSubmit(email, password) {
//     auth.authorization(email, password)
//       .then((res) => {
//         if (res) {
//           localStorage.setItem('jwt', res.token)
//           setEmail(email);
//           setLoggedIn(true);
//           navigate('/');
//         }
//       })
//       .catch(() => {
//         setIsInfoTooltip(true);
//         setLoggedIn(false)
//       })
//   }

//   const handleRegisterSubmit = (email, password) => {
//     auth.register(email, password)
//       .then((res) => {
//         if (res) {
//           setIsInfoTooltip(true);
//           setLoggedIn(true)
//           navigate("/sign-in");
//         }
//       })
//       .catch(() => {
//         setIsInfoTooltip(true);
//         setLoggedIn(false)
//       })
//   }

//   function handleConfirmClick(card) {
//     setConfirmPopupOpen(true);
//     setDeletedPopup(card);
//   }

//   function handleCardLike(card) {
//     const isLiked = card.likes.some(i => i._id === currentUser._id);
//     api.changeLike(card._id, !isLiked).
//       then((newCard) => {
//         setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//   };

//   function handleCardDelete(card) {
//     setRenderLoading(true)
//     api.deleteCard(card._id).
//       then(() => {
//         setCards((state) => state.filter((c) => c._id !== card._id))
//         closeAllPopups()
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//       .finally(() => {
//         setRenderLoading(false)
//       })
//   };

//   function handleChangeUser(user) {
//     setRenderLoading(true)
//     api.setUserInfo(user.name, user.about).
//       then((userData) => {
//         console.log(userData)
//         setCurrentUser({
//           ...currentUser,
//           name: userData.name,
//           about: userData.about
//         });
//         closeAllPopups()
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//       .finally(() => {
//         setRenderLoading(false)
//       })
//   };

//   function handleUpdateAvatar(data) {
//     setRenderLoading(true)
//     api.setAvatarInfo(data).
//       then((data) => {
//         setCurrentUser({
//           ...currentUser,
//           avatar: data.avatar
//         });
//         closeAllPopups()
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//       .finally(() => {
//         setRenderLoading(false)
//       })
//   };

//   function handleAddNewCard(card) {
//     setRenderLoading(true)
//     api.addNewCard(card.name, card.link)
//       .then((newCard) => {
//         setCards([newCard, ...cards]);
//         closeAllPopups()
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//       .finally(() => {
//         setRenderLoading(false)
//       })
//   };

//   function handleEditProfileClick() {
//     setIsEditProfilePopupOpen(true);
//   };

//   function handleAddPlaceClick() {
//     setIsAddPlacePopupOpen(true);
//   };

//   function handleEditAvatarClick() {
//     setIsEditAvatarPopupOpen(true);
//   };

//   function handleCardClick(card) {
//     setCard(card);
//   };

//   function handleSetIsInfoTooltip() {
//     setIsInfoTooltip(false);
//   }

//   function closeAllPopups() {
//     setIsEditProfilePopupOpen(false)
//     setIsAddPlacePopupOpen(false)
//     setIsEditAvatarPopupOpen(false)
//     setConfirmPopupOpen(false)
//     setCard({})
//     setDeletedPopup({})
//     handleSetIsInfoTooltip(true)

//   };

//   function exitUser() {
//     localStorage.removeItem('jwt');
//     setLoggedIn(false);
//   }

//   return (
//     <CurrentUserContext.Provider value={currentUser}>
//       <div className="root">
//         <div className="page">
//           <Header
//             email={email}
//             loggedIn={loggedIn}
//             exitUser={exitUser}
//           />

//           <Routes>

//             <Route path="*" element={
//               <ProtectedRoute loggedIn={loggedIn} >
//                 <Main
//                   onEditProfile={handleEditProfileClick}
//                   onAddPlace={handleAddPlaceClick}
//                   onEditAvatarClick={handleEditAvatarClick}
//                   onCardClick={handleCardClick}
//                   onCardLike={handleCardLike}
//                   onCardDelete={handleConfirmClick}
//                   cards={cards}
//                 />
//               </ProtectedRoute>
//             } />

//             <Route path="/sign-up" element={
//               <> <Register onRegister={handleRegisterSubmit} /> </>
//             }>
//             </Route>

//             <Route path="/sign-in" element={
//               <> <Login onLogin={handleLoginSubmit} /> </>
//             }>
//             </Route>

//             <Route element={<><Footer /></>}></Route>

//           </Routes>

//           <EditProfilePopup
//             isOpen={isEditProfilePopupOpen}
//             onClose={closeAllPopups}
//             onUpdateUser={handleChangeUser}
//             renderLoading={renderLoading}
//           />

//           <AddPlacePopup
//             isOpen={isAddPlacePopupOpen}
//             onClose={closeAllPopups}
//             onAddPlace={handleAddNewCard}
//             renderLoading={renderLoading}
//           />

//           <EditAvatarPopup
//             isOpen={isEditAvatarPopupOpen}
//             onClose={closeAllPopups}
//             onUpdateAvatar={handleUpdateAvatar}
//             renderLoading={renderLoading}
//           />

//           <ConfirmPopupOpen
//             isOpen={isConfirmPopupOpen}
//             onClose={closeAllPopups}
//             onCardDelete={handleCardDelete}
//             card={deletedPopup}
//             renderLoading={renderLoading}
//           />

//           <ImagePopup
//             card={card}
//             onClose={closeAllPopups}
//           />

//           <InfoTooltip
//             onClose={closeAllPopups}
//             isOpen={isInfoTooltip}
//             loggedIn={loggedIn}
//           />
//         </div>
//       </div>
//     </CurrentUserContext.Provider>
//   );
// }


// import { useState, useEffect } from 'react';
// import { Route, Routes, useNavigate } from 'react-router-dom';

// import Header from './Header';
// import Footer from './Footer';
// import Main from './Main';
// import ImagePopup from './ImagePopup';
// import EditProfilePopup from './EditProfilePopup';
// import EditAvatarPopup from './EditAvatarPopup';
// import AddPlacePopup from './AddPlacePopup';
// import { api } from './../utils/Api';
// import { CurrentUserContext } from '../contexts/CurrentUserContext';
// import ConfirmPopupOpen from './ConfirmPopup';
// import Register from './Register';
// import Login from './Login';
// import ProtectedRoute from './ProtectedRoute';
// import InfoTooltip from './InfoTooltip';
// import * as auth from './../utils/auth'

// export default function App() {

//   const navigate = useNavigate();

//   const [state, setState] = useState({
//     isEditProfilePopupOpen: false,
//     isAddPlacePopupOpen: false,
//     isEditAvatarPopupOpen: false,
//     isConfirmPopupOpen: false,
//     renderLoading: false,
//     email: '',
//     loggedIn: false,
//     isInfoTooltip: false,
//     card: {},
//     deletedPopup: {},
//     currentUser: {},
//     cards: []
//   })

//   function handleTokenCheck() {
//     const jwt = localStorage.getItem('jwt')

//     if (jwt) {
//       auth.getUserData(jwt)
//         .then((res) => {
//           if (res)
//             setState({
//               ...state, LoggedIn: true,
//               ...state, email: res.data.email,
//             })
//           navigate('/');
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     }
//   }

//   useEffect(() => {
//     handleTokenCheck();
//   }, []);

  // useEffect(() => {
  //   state.loggedIn &&
  //     Promise.all([api.getUserInfo(), api.getInitialCards()])
  //       .then(([userData, cardsData]) => {

  //         setState({
  //           ...state, currentUser: userData,
  //           ...state, cards: cardsData,
  //         })
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  // }, [state.loggedIn])

  // function handleLoginSubmit(email, password) {
  //   auth.authorization(email, password)
  //     .then((res) => {
  //       if (res) {
  //         localStorage.setItem('jwt', res.token)
  //         setState({
  //           ...state, email: email,
  //           ...state, loggedIn: true
  //         })
  //         navigate("/");
  //       }
  //     })
  //     .catch(() => {
  //       setState({
  //         ...state, isInfoTooltip: true,
  //         ...state, loggedIn: false
  //       })
  //     })
  // }

//   const handleRegisterSubmit = (email, password) => {
//     auth.register(email, password)
//       .then((res) => {
//         if (res) {
//           setState({
//             ...state, isInfoTooltip: true,
//             ...state, loggedIn: true
//           })
//           navigate("/sign-in");
//         }
//       })
//       .catch(() => {
//         setState({
//           ...state, isInfoTooltip: true,
//           ...state, loggedIn: false
//         })
//       })
//   }

//   function handleConfirmClick(card) {
//     setState({
//       ...state, isConfirmPopupOpen: true,
//       ...state, deletedPopup: card
//     })
//   }

//   function handleCardLike(card) {
//     const isLiked = card.likes.some(i => i._id === state.currentUser._id);
//     api.changeLike(card._id, !isLiked).
//       then((newCard) => {
//         // setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
//         setState({
//           ...state, cards: (state) => state.map((c) => c._id === card._id ? newCard : c)
//         })
//       })

//       .catch((err) => {
//         console.log(err)
//       })
//   };

//   function handleCardDelete(card) {
//     setState({
//       ...state, renderLoading: true,
//     })
//     api.deleteCard(card._id).
//       then(() => {
//         // setCards((state) => state.filter((c) => c._id !== card._id))
//         setState({
//           ...state, cards: (state) => state.filter((c) => c._id !== card._id)
//         })
//         closeAllPopups()
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//       .finally(() => {
//         setState({
//           ...state, renderLoading: false,
//         })
//       })
//   };

//   function handleChangeUser(user) {
//     setState({
//       ...state, renderLoading: true
//     })
//     api.setUserInfo(user.name, user.about).
//       then((userData) => {
//         setState({
//           ...state, currentUser:
//           {
//             name: userData.name,
//             about: userData.about
//           }
//         })
//         closeAllPopups()
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//       .finally(() => {
//         setState({
//           ...state, renderLoading: false
//         })
//       })
//   };

//   function handleUpdateAvatar(data) {
//     setState({
//       ...state, renderLoading: true
//     })
//     api.setAvatarInfo(data).
//       then((data) => {
//         setState({
//           ...state, currentUser:
//             { avatar: data.avatar }
//         })
//         closeAllPopups()
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//       .finally(() => {
//         setState({
//           ...state, renderLoading: false
//         })
//       })
//   };

//   function handleAddNewCard(card) {
//     setState({
//       ...state, renderLoading: true
//     })
//     api.addNewCard(card.name, card.link)
//       .then((newCard) => {
//         setState({
//           ...state, newCard, ...state.cards
//         })
//         closeAllPopups()
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//       .finally(() => {
//         setState({
//           ...state, renderLoading: false
//         })
//       })
//   };

//   function handleEditProfileClick() {
//     setState({
//       ...state, isEditProfilePopupOpen: true
//     })
//   };

//   function handleAddPlaceClick() {
//     setState({
//       ...state, isAddPlacePopupOpen: true
//     })
//   };

//   function handleEditAvatarClick() {
//     setState({
//       ...state, isEditAvatarPopupOpen: true
//     })
//   };

//   function handleCardClick(card) {
//     setState({
//       ...state, card: card
//     })
//   };

//   function handleSetIsInfoTooltip() {
//     setState({
//       ...state, isInfoTooltip: false
//     })
//   }

//   function closeAllPopups() {
//     setState({
//       ...state, isEditProfilePopupOpen: false,
//       ...state, isAddPlacePopupOpen: false,
//       ...state, isEditAvatarPopupOpen: false,
//       ...state, isConfirmPopupOpen: false,
//       ...state, card: {},
//       ...state, deletedPopup: {},
//       // ...state, InfoTooltip: true,
//     })
//     handleSetIsInfoTooltip(true)

//   };

//   function exitUser() {
//     localStorage.removeItem('jwt');
//     setState({
//       ...state, loggedIn: false
//     })
//   }

//   return (
//     <CurrentUserContext.Provider value={state.currentUser}>
//       <div className="root">
//         <div className="page">
//           <Header
//             email={state.email}
//             loggedIn={state.loggedIn}
//             exitUser={exitUser}
//           />

//           <Routes>

//             <Route path="*" element={
//               <ProtectedRoute loggedIn={state.loggedIn}>
//                 <Main
//                   onEditProfile={handleEditProfileClick}
//                   onAddPlace={handleAddPlaceClick}
//                   onEditAvatarClick={handleEditAvatarClick}
//                   onCardClick={handleCardClick}
//                   onCardLike={handleCardLike}
//                   onCardDelete={handleConfirmClick}
//                   cards={state.cards}
//                 />

//                 <Footer />
//               </ProtectedRoute>
//             } />

//             <Route path="/sign-up" element={
//               <Register onRegister={handleRegisterSubmit} />}>
//             </Route>

//             <Route path="/sign-in" element={
//               <Login onLogin={handleLoginSubmit} />}>
//             </Route>



//           </Routes>

//           <EditProfilePopup
//             isOpen={state.isEditProfilePopupOpen}
//             onClose={closeAllPopups}
//             onUpdateUser={handleChangeUser}
//             renderLoading={state.renderLoading}
//           />

//           <AddPlacePopup
//             isOpen={state.isAddPlacePopupOpen}
//             onClose={closeAllPopups}
//             onAddPlace={handleAddNewCard}
//             renderLoading={state.renderLoading}
//           />

//           <EditAvatarPopup
//             isOpen={state.isEditAvatarPopupOpen}
//             onClose={closeAllPopups}
//             onUpdateAvatar={handleUpdateAvatar}
//             renderLoading={state.renderLoading}
//           />

//           <ConfirmPopupOpen
//             isOpen={state.isConfirmPopupOpen}
//             onClose={closeAllPopups}
//             onCardDelete={handleCardDelete}
//             card={state.deletedPopup}
//             renderLoading={state.renderLoading}
//           />

//           <ImagePopup
//             card={state.card}
//             onClose={closeAllPopups}
//           />

//           <InfoTooltip
//             onClose={closeAllPopups}
//             isOpen={state.isInfoTooltip}
//             loggedIn={state.loggedIn}
//           />
//         </div>
//       </div>
//     </CurrentUserContext.Provider>
//   );
// }