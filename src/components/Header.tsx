import * as React from 'react';
import { Link } from 'react-router-dom'

export default () => {
	return(
		<header>
			<div><Link to='/' className='logo'>Let's Experiment!</Link></div><br />
			<div>Experiment with your partner!</div>
		</header>
	);
}
