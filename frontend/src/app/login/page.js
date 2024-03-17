'use client'
import '../css/clerk.css';
import { useState } from 'react';

const mode = 'login';

const LoginComponent = ({ mode, onSubmit }) => {
    const [currentMode, setCurrentMode] = useState(mode);

    const toggleMode = () => {
        setCurrentMode(currentMode === 'login' ? 'signup' : 'login');
    };

    return (
        <div>
            <div className={`form-block-wrapper form-block-wrapper--is-${currentMode}`} ></div>
            <section className={`form-block form-block--is-${currentMode}`}>
                <header className="form-block__header">
                    <h1>{currentMode === 'login' ? 'Welcome back!' : 'Sign up'}</h1>
                    <div className="form-block__toggle-block">
                        <span>{currentMode === 'login' ? 'Don\'t have' : 'Have'}  an account? Click here →</span>
                        <input id="form-toggler" type="checkbox" onClick={toggleMode} />
                        <label htmlFor="form-toggler"></label>
                    </div>
                </header>
                <LoginForm mode={currentMode} onSubmit={onSubmit} />
            </section>
        </div>
    );
};

const LoginForm = ({ mode, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="form-block__input-wrapper">
                <div className="form-group form-group--login">
                    <Input type="text" id="username" label="user name" disabled={mode === 'signup'}/>
                    <Input type="password" id="password" label="password" disabled={mode === 'signup'}/>
                </div>
                <div className="form-group form-group--signup">
                    <Input type="text" id="fullname" label="user name" disabled={mode === 'login'} />
                    <Input type="email" id="email" label="email" disabled={mode === 'login'} />
                    <Input type="password" id="createpassword" label="password" disabled={mode === 'login'} />
                    <Input type="password" id="repeatpassword" label="repeat password" disabled={mode === 'login'} />
                </div>
            </div>
            <button className="button button--primary full-width" type="submit">{mode === 'login' ? 'Log In' : 'Sign Up'}</button>
        </form>
    );
};

const Input = ({ id, type, label, disabled }) => (
    <input className="form-group__input" type={type} id={id} placeholder={label} disabled={disabled}/>
);

const login = () => (
    <div className={`app app--is-${mode}`}>
        <LoginComponent
            mode={mode}
            onSubmit={() => {
                console.log('submit');
            }}
        />
    </div>
);

export default login;
