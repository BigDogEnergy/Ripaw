import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom'
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  
  const history = useHistory();

  //Demo User Button Config
  const demoUserButton = async (e) => {
    e.preventDefault();
    await dispatch(login('demo@aa.io', 'password'));
    closeModal();
    history.push('/')
  } ;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
        closeModal()
    }
  };

  return (
    <>
      <h1 className="login-form__title">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <ul className="login-form__error-list">
          {errors.map((error, idx) => (
            <li className="login-form__error-item" key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email
          <input
            className="login-form__input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            className="login-form__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="login-form__button" type="submit">Log In</button>
        <button
          className="login-form__button login-form__button--demo"
          type="button"
          onClick={demoUserButton}>
          Demo User
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;
