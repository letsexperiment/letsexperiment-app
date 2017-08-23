import * as React from 'react';
import { Link } from 'react-router-dom'
import * as copy from 'copy-to-clipboard';

export interface Props {
	partnerNickname: string,
	sessionId: string,
	showApp: any,
	hideApp: any,
	handleSubmit: any
}

export interface State {
	sessionUrl: string,
	copyText: string,
	copyCursor: string
}

export default class Transfer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			sessionUrl: null,
			copyText: 'Copy',
			copyCursor: 'pointer'
		}
		this.handleCopy = this.handleCopy.bind(this);
	}

	handleCopy(e: any) {
		copy(this.state.sessionUrl);
		this.setState({
			copyText: 'Copied!',
			copyCursor: 'default'
		});
	}

	componentDidMount() {
		this.setState({
			sessionUrl: `https://letsexperiment.xyz/${this.props.sessionId}`
		});
	}

	render() {
		return(
			<div className='modal'>
				<h2>It's time for {this.props.partnerNickname} now.</h2>
				<p>
					They can start now on this device or you can email them this url:<br/>
					<div className='session-url'>
						<span>{this.state.sessionUrl}</span>
						<span
							className='copy-url'
							onClick={this.handleCopy}
							style={{cursor: this.state.copyCursor}}
						>{this.state.copyText}</span>
					</div>
				</p>
				<button
					className='launch-session'
					value='transfer'
					onClick={this.props.handleSubmit}
				>Let's Go 🚀</button>
			</div>
		);
	}
}