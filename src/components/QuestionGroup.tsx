import * as React from 'react';

import answers from '../lib/answers';

export interface Props {
	name: string,
	questions: Array<any>,
	groupIndex: number,
	handleAnswer: any
}

export default (props: Props) => {
	return (
		<div>
			<h2 className='question-group'>{props.name}</h2>
			{props.questions.map((q: any, i: number) =>
				<li key={i} className='question'>
					<span>{q.question}</span>
					<div className='radio-list'>
						{answers.map((a: string, j: number) => 
							<button
								key={j}
								type='button'
								value={j}
								className={q.answer == j ? 'radio-option selected' : 'radio-option'}
								onClick={props.handleAnswer}
								data-group={props.groupIndex}
								data-question={i}
							>{a}</button>
						)}
					</div>
				</li>
			)}
		</div>
	);
}