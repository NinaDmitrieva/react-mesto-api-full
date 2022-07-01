import React, { useState } from "react";

export default function Login({ onLogin }) {

    const [state, setState] = useState({
        email: '',
        password: '',
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setState((prev) => ({
            ...prev,
            [name]: value
        }))
    };

    function handleSubmit(e) {
        e.preventDefault();
        console.log('state:', state)
        if (onLogin) {
            onLogin(
                state.email,
                state.password,
            );
        }
    }

    return (

        <section className='login'>
            <div className="login__block">

                <div className="login__form">
                    <h3 className="login__text">Вход</h3>
                    <form className="login__forms" onSubmit={handleSubmit}>
                        <input className="login__input"
                            type="email"
                            name="email"
                            placeholder="Email"
                            minLength="2"
                            maxLength="30"
                            required
                            value={state.email || ''}
                            onChange={handleChange}
                        />
                        <span id="name-place-error" className="error"></span>

                        <input className="login__input"
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            required
                            autoComplete="on"
                            value={state.password || ''}
                            onChange={handleChange}
                        />
                        <span id="place-url-error" className="error"></span>
                        <button className="login__save"
                            type="submit">Войти
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )

}