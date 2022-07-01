export default function PopupWithForm({ children, title, name, isOpen, btnText, onClose, onSubmit }) {

  return (
    <section className={`popup ${isOpen && 'popup_activ'}`}>
      <div className="popup__block">

        <button className="popup__close-icon popup__close"
          type="button"
          onClick={onClose}
        >
        </button>
        <div className="popup__form">
          <h3 className="popup__text">{title}</h3>
          <form className="popup__forms" name={`popup_${name}`} onSubmit={onSubmit}>
            {children}
            <button className="popup__save" type="submit">{btnText}</button>
          </form>
        </div>
      </div>
    </section>
  )
}

