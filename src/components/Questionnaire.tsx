import * as React from 'react';
import { Redirect } from 'react-router-dom';

import QuestionGroup from './QuestionGroup';
import Transfer from './Transfer';
import Results from './Results';

export interface Props {
	match: any,
	route: any,
	history: any,
	showApp: any,
	hideApp: any
}
export interface State {
	yourNickname: string,
	partnerNickname: string,
	questions: any,
	hasError: boolean,
	sessionId: string,
	currentGroup: number,
	partnerOneIsDone: boolean,
	partnerTwoIsDone: boolean,
	showTransfer: boolean
}

export default class Questionnaire extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			yourNickname: '',
			partnerNickname: '',
			questions: [[[],[]]],
			hasError: false,
			sessionId: null,
			currentGroup: 0,
			partnerOneIsDone: false,
			partnerTwoIsDone: false,
			showTransfer: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleAnswer = this.handleAnswer.bind(this);
	}

	handleSubmit(e: any) {
		e.preventDefault();
		this.props.hideApp();
		const body: any = {};
		if (e.target.value == 'transfer') {
			body.showTransfer = false;
			body.partnerOneIsDone = true;
		} else if (this.state.partnerOneIsDone) {
			body.partnerTwoQuestions = this.state.questions;
			if (this.state.currentGroup >= this.state.questions.length-1) {
				body.partnerTwoIsDone = true;
			} else {
				body.partnerTwoCurrentGroup = this.state.currentGroup+1;
			}
		} else {
			body.partnerOneQuestions = this.state.questions;
			if (this.state.currentGroup >= this.state.questions.length-1) {
				body.showTransfer = true;
			} else {
				body.partnerOneCurrentGroup = this.state.currentGroup+1;
			}
		}
		fetch(`https://letsexperiment-api.herokuapp.com/v1/${this.state.sessionId}`, {
			method: 'put',
			body: JSON.stringify(body),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}).then((res) => {
			return res.json();
		}).then((obj) => {
			if (body.partnerTwoIsDone || body.partnerOneIsDone) {
				window.location.reload()
			} else if (body.showTransfer) {
				this.setState({showTransfer: true});
				this.props.showApp();
			} else {
				this.setState({currentGroup: this.state.currentGroup+1});
				window.scrollTo(0, 0);
				this.props.showApp();
			}
		}).catch((err) => {
			alert('ERROR :(')
			console.log(err);
		});
	}

	handleAnswer(e: any) {
		const questions = this.state.questions;
		questions[e.target.dataset.group][1][e.target.dataset.question].answer = e.target.value
		this.setState({questions});
	}

	addPartnerToQuestions(questions: Array<any>, partner: string): Array<any> {
		const sessionQuestions = questions;
		for (let g = 0; g < sessionQuestions.length; g++) {
			for (let i = 0; i < sessionQuestions[g][1].length; i++) {
				sessionQuestions[g][1][i].question = sessionQuestions[g][1][i].question.replace('{{P}}', partner);
			}
		}
		return sessionQuestions;
	}

	loadData(session: any) {
		const partnerSession: State = this.state;
		partnerSession.sessionId = session._id;
		partnerSession.partnerOneIsDone = session.partnerOneIsDone;
		partnerSession.partnerTwoIsDone = session.partnerTwoIsDone;
		partnerSession.showTransfer = session.showTransfer;
		if (partnerSession.partnerOneIsDone) {
			partnerSession.yourNickname = session.partnerTwoNickname;
			partnerSession.partnerNickname = session.partnerOneNickname;
			partnerSession.questions = this.addPartnerToQuestions(session.partnerTwoQuestions, session.partnerOneNickname);
			partnerSession.currentGroup = session.partnerTwoCurrentGroup;	
		} else {
			partnerSession.yourNickname = session.partnerOneNickname;
			partnerSession.partnerNickname = session.partnerTwoNickname;
			partnerSession.questions = this.addPartnerToQuestions(session.partnerOneQuestions, session.partnerTwoNickname);
			partnerSession.currentGroup = session.partnerOneCurrentGroup;
		}
		this.setState({...partnerSession});
		this.props.showApp();
	}

	componentDidMount() {
		fetch(`https://letsexperiment-api.herokuapp.com/v1/${this.props.match.params.id}`, {
			method: 'get'
		}).then((res) => {
			if (res.status !== 200) {
				this.setState({ hasError: true }, () => {
					this.props.showApp();
				});
			} else {
				return res.json();				
			}
		}).then((obj) => {
			this.loadData(obj.message);
		}).catch((err) => {
			console.log(err);
			this.setState({ hasError: true });
		});
	}

	render() {
		if (this.state.hasError) {
			return(
				<Redirect to='/'/>
			);
		} else if (this.state.showTransfer) {
			return(
				<Transfer
					partnerNickname={this.state.partnerNickname}
					sessionId={this.state.sessionId}
					showApp={this.props.showApp}
					hideApp={this.props.showApp}
					handleSubmit={this.handleSubmit}
				/>
			);
		} else if (this.state.partnerOneIsDone && this.state.partnerTwoIsDone) {
			return(
				<Results
					sessionId={this.state.sessionId}
					showApp={this.props.showApp}
					hideApp={this.props.showApp}
				/>
			);
		} else {
			return(
				<form className='questionnaire' onSubmit={this.handleSubmit}>
					<h2 className='nickname'>Hello, {this.state.yourNickname} 👋</h2>
					<QuestionGroup
						name={this.state.questions[this.state.currentGroup][0]}
						questions={this.state.questions[this.state.currentGroup][1]}
						groupIndex={this.state.currentGroup}
						handleAnswer={this.handleAnswer}
					/>
					<input id='advance' type='submit' value={this.state.currentGroup >= this.state.questions.length-1 ? 'Complete' : 'Next'}  />
				</form>
			);
		}
	}
}