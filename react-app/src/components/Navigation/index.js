import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from '../../images/logo.png'

function Navigation({ isLoaded }){
	
	const sessionUser = useSelector(state => state.session.user);


	return (
		<>
			<div className='navbar'>
				
				<Link to="/" className='navbar-logo__container'>
					<img src={logo} alt='navbar__logo' />
				</Link>

				{isLoaded && (
					<div className='navbar__button'>
						<ProfileButton user={sessionUser} />
					</div>
				)}
				
			</div>
		</>
	);
}

export default Navigation;
