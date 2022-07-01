import React from 'react';

export default function ImagePopup({ card, onClose }) {

  return (

    <section className={`popup popup_open-foto ${card.name ? 'popup_activ' : ''}`}>


      <div className="popup__block-img">

        <button className="popup__close-icon popup__foto-close"
          type="button"
          onClick={onClose}
        ></button>

        <img className="popup__img-open"
          alt={card.name}
          src={card.link}
        />

        <h3 className="popup__foto-name">
          {card.name}
        </h3>

      </div>
    </section>
  )
}

