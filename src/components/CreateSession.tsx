import * as React from 'react';
import { withRouter, Link } from 'react-router-dom'

import basicQuestions from '../lib/basicQuestions';
import advancedQuestions from '../lib/advancedQuestions';

export interface Props {
	loadSession: any,
	history: any,
	showApp: any,
	hideApp: any
}
export interface State {
	partnerOneNickname: string,
	partnerTwoNickname: string,
	partnerOneQuestions: Array<any>,
	partnerTwoQuestions: Array<any>,
	advancedQuestions: boolean,
	ageAgreement: boolean,
	termAgreement: boolean
}

export default class CreateSession extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			partnerOneNickname: 'Partner 1',
			partnerTwoNickname: 'Partner 2',
			partnerOneQuestions: null,
			partnerTwoQuestions: null,
			advancedQuestions: false,
			ageAgreement: false,
			termAgreement: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleSubmit(e: any) {
		e.preventDefault();
		this.props.hideApp();
		const sessionQuestions = this.state.advancedQuestions ? advancedQuestions : basicQuestions;
		fetch('https://letsexperiment-api.herokuapp.com/v1/', {
			method: 'post',
			body: JSON.stringify({
				partnerOneNickname: this.state.partnerOneNickname,
				partnerTwoNickname: this.state.partnerTwoNickname,
				partnerOneQuestions: sessionQuestions,
				partnerTwoQuestions: sessionQuestions,
				partnerOneIsDone: false,
				partnerTwoIsDone: false,
				partnerOneCurrentGroup: 0,
				partnerTwoCurrentGroup: 0,
				showTransfer: false
			}),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}).then((res) => {
			return res.json();
		}).then((obj) => {
			this.props.history.push(`/${obj.message._id}`);
		}).catch((err) => {
			alert('ERROR :(')
			console.log(err);
		});
	}

	handleInputChange(e: any) {
		const target = e.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	handleFocus(e: any) {
		e.target.select();
	}

	setQuestionLevel(e: any) {
		this.setState({
			advancedQuestions: e.target.value === 'advanced' ? true : false
		});
	}

	componentDidMount() {
		this.props.showApp();
	}

    render() {
        return(
            <div className='getting-started'>
				<form onSubmit={this.handleSubmit}>
					<div className='form-container'>
						<div className='text-input'>
							<div>
								<label>Your nickname:</label>
								<input
									type='text'
									name='partnerOneNickname'
									autoComplete='off'
									value={this.state.partnerOneNickname}
									onChange={this.handleInputChange}
									onFocus={this.handleFocus}
									required
								/>
							</div>
							<div>
								<label>Partner's nickname:</label>
								<input
									type='text'
									name='partnerTwoNickname'
									autoComplete='off'
									value={this.state.partnerTwoNickname}
									onChange={this.handleInputChange}
									onFocus={this.handleFocus}
									required
								/>
							</div>
						</div>
						<label>
							<input
								type='checkbox'
								name='advancedQuestions'
								autoComplete='off'
								checked={this.state.advancedQuestions}
								onChange={this.handleInputChange}
							/>
							Advanced questions?
						</label>
						<label className='terms'>
							<input
								type='checkbox'
								name='ageAgreement'
								autoComplete='off'
								checked={this.state.ageAgreement}
								onChange={this.handleInputChange}
								required
							/>
							I confirm that my partner and I are over 18 years of age
						</label>
						<label className='terms'>
							<input
								type='checkbox'
								name='termAgreement'
								autoComplete='off'
								checked={this.state.termAgreement}
								onChange={this.handleInputChange}
								required
							/>
							We agree to the <Link to='/terms'>terms and conditions</Link>
						</label>
					</div>
					<div>
						<input className='launch-session' type='submit' value="Let's go 🚀" />
					</div>
				</form>
				<div className='app-info'>
					<div className='img-container'>
						<img alt='placeholder' src='http://via.placeholder.com/300x300' />
					</div>
				</div>
			</div>
        );
    }
}