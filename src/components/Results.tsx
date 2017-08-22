import * as React from 'react';

import answers from '../lib/answers';

export interface Props {
	showApp: any,
	hideApp: any,
	sessionId: string
}
export interface State {
	hasError: boolean,
	partnerOneNickname: string,
	partnerTwoNickname: string,
	matches: Array<any>
}

export default class Questionnaire extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			partnerOneNickname: 'Partner 1',
			partnerTwoNickname: 'Partner 2',
			matches: []
		};
		this.handleInputChange = this.handleInputChange.bind(this);	
	}

	findMatches(session: any) {
		const matches = [];
		for (let g = 0; g < session.partnerOneQuestions.length; g++) {
			for (var i = 0; i < session.partnerOneQuestions[g][1].length; i++) {
				if (session.partnerOneQuestions[g][1][i].answer > 1 && session.partnerTwoQuestions[g][1][i].answer > 1) {
					matches.push({
						match: session.partnerOneQuestions[g][1][i],
						groupName: session.partnerOneQuestions[g][0],
						partnerOneAnswer: session.partnerOneQuestions[g][1][i].answer,
						partnerTwoAnswer: session.partnerTwoQuestions[g][1][i].answer,
						completed: false
					});
				}
			}
		}
		this.updateMatches(matches, () => {
			this.props.showApp();
		});		
	}

	updateMatches(matches: Array<any>, callback: any) {
		this.setState({matches});
		fetch(`https://letsexperiment-api.herokuapp.com/v1/${this.props.sessionId}`, {
			method: 'put',
			body: JSON.stringify({matches}),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}).then((res) => {
			callback();
		}).catch((err) => {
			alert('ERROR :(')
			console.log(err);
		});
	}

	handleInputChange(e: any) {
		const matches = this.state.matches;
		matches[e.target.value].completed = e.target.checked;
		this.updateMatches(matches, () => {});
	}

	componentDidMount() {
		fetch(`https://letsexperiment-api.herokuapp.com/v1/${this.props.sessionId}`, {
			method: 'get'
		}).then((res) => {
			return res.json();
		}).then((obj) => {
			if (obj.status !== 200) {
				this.setState({ hasError: true });
			} else {
				this.setState({
					partnerOneNickname: obj.message.partnerOneNickname,
					partnerTwoNickname: obj.message.partnerTwoNickname
				});
				if (obj.message.matches) {
					this.setState({matches: obj.message.matches});
				} else {
					this.findMatches(obj.message);
				}
			}
		}).catch((err) => {
			this.setState({ hasError: true });
			console.log(err);
		});
	}

	render() {
		if (this.state.hasError) {
			return(
				<div>
					<h2>Could not load results for {this.props.sessionId}</h2>
					<p>Our servers might be down, please try again later</p>
				</div>
			);
		} else {
			return(
				<div>
					<h2>Results</h2>
					<p>Bookmark this page and complete your activities one by one!</p>
					{this.state.matches.map((m: any, i: number) =>
						<label key={i} className='match'>
							<div>
								<input
									type='checkbox'
									name='completed'
									value={i}
									autoComplete='off'
									checked={m.completed}
									onChange={this.handleInputChange}
								/>
								<div>
									<span className='match-group'>{m.groupName}</span>
									<span className='match-question'>{m.match.question}</span>
									<span className='match-answer'><b>{this.state.partnerOneNickname}:</b>{answers[m.partnerOneAnswer]}</span>
									<span className='match-answer'><b>{this.state.partnerTwoNickname}:</b>{answers[m.partnerTwoAnswer]}</span>
								</div>
							</div>
							<span className='match-completed'>{m.completed ? 'Completed!' : null}</span>
						</label>	
					)}
				</div>
			);
		}
	}
}