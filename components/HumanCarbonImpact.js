import scenarios from '@/app/scenarios/scenarios.yaml'
import Emoji from 'Components/Emoji'
import { questionEcoDimensions } from 'Components/questionEcoDimensions'
import animate from 'Components/ui/animate'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { utils } from 'publicodes'
import { mapObjIndexed, toPairs } from 'ramda'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import {
	answeredQuestionsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import BudgetBar, { BudgetBarStyle } from './BudgetBar'
import * as chrono from './chrono'
import { humanWeight } from './HumanWeight'

const { encodeRuleName } = utils
import { useEngine2 } from '@/providers/EngineWrapper'

let limitPerPeriod = (scenario) =>
	mapObjIndexed(
		(v) => v * scenarios[scenario]['crédit carbone par personne'] * 1000,
		{
			...chrono,
			négligeable: 0,
		}
	)

let findPeriod = (scenario, nodeValue) =>
	toPairs(limitPerPeriod(scenario))
		.sort(([, a], [, b]) => b - a)
		.find(([, limit]) => limit <= Math.abs(nodeValue))

let humanCarbonImpactData = (scenario, nodeValue) => {
	console.log('fp', nodeValue)
	let [closestPeriod, closestPeriodValue] = findPeriod(scenario, nodeValue),
		factor = Math.round(nodeValue / closestPeriodValue),
		closestPeriodLabel = closestPeriod.startsWith('demi')
			? closestPeriod.replace('demi', 'demi-')
			: closestPeriod

	return { closestPeriod, closestPeriodValue, closestPeriodLabel, factor }
}

const HumanCarbonImpact = ({ nodeValue, formule, dottedName }) => {
	const rules = useSelector((state) => state.rules),
		rule = rules[dottedName],
		examplesSource = rule.exposé?.['exemples via suggestions'],
		questionEco = rule.exposé?.type === 'question éco'

	const engine = useEngine2(),
		nextQuestions = useNextQuestions(),
		foldedSteps = useSelector(answeredQuestionsSelector),
		situation = useSelector(situationSelector),
		dirtySituation = Object.keys(situation).find((question) => {
			try {
				return (
					[...nextQuestions, ...foldedSteps].includes(question) &&
					!engine.getRule(question).rawNode.injecté
				)
			} catch (e) {
				return false
			}
		})

	if (!questionEco && (!examplesSource || dirtySituation))
		return <ImpactCard {...{ nodeValue, dottedName }} />

	if (questionEco) {
		const evaluations = questionEcoDimensions.map((unit) =>
			engine.evaluate('lave-linge . ' + unit)
		)
		return (
			<CardList>
				{evaluations.map((evaluation) => (
					<li key={dottedName}>
						<ImpactCard {...{ ...evaluation, questionEco: true }} />
					</li>
				))}
			</CardList>
		)
	}

	const suggestions = rules[examplesSource].suggestions

	const evaluations = Object.entries(suggestions).map(([k, v]) => {
		engine.setSituation({ ...situation, [examplesSource]: v })
		const evaluation = engine.evaluate(dottedName)
		engine.setSituation(situation)
		return { ...evaluation, exampleName: k }
	})

	return (
		<CardList>
			{evaluations.map(({ nodeValue, dottedName, exampleName }) => (
				<li key={exampleName}>
					<ImpactCard {...{ nodeValue, dottedName, exampleName }} />
				</li>
			))}
		</CardList>
	)
};

export default HumanCarbonImpact;

const CardList = styled.ul`
	flex-wrap: nowrap;
	overflow-x: auto;
	white-space: nowrap;
	justify-content: normal;
	scrollbar-width: none;
	display: flex;
	list-style-type: none;
	justify-content: start;
	padding: 0;
	height: auto;
	margin-bottom: 0;
	width: calc(100vw - 1.5rem);
	transform: translateX(-1.5rem);
	@media (min-width: 800px) {
		/* TODO */
		width: fit-content;
		position: relative;
		left: calc(50%);
		transform: translateX(-50%);
		overflow: initial;
		justify-content: space-evenly;
	}
	background: white;
	border-radius: 0.3rem;
	li {
		margin: 0 0.1rem;
	}
`

const ImpactCard = ({
	nodeValue,
	dottedName,
	title,
	exampleName,
	questionEco,
	unit: ruleUnit,
}) => {
	const scenario = useSelector((state) => state.scenario)
	const budget = scenarios[scenario]['crédit carbone par personne'] * 1000

	if (nodeValue == null) return
	const [value, unit] = humanWeight(nodeValue)
	let { closestPeriodLabel, closestPeriod, factor } = humanCarbonImpactData(
		scenario,
		nodeValue
	)

	return (
		<animate.appear>
			<div
				css={`
					border-radius: 6px;
					background: var(--color);
					padding: 0.4em;
					margin: 0 auto;
					color: var(--textColor);
					max-width: 13rem;
				`}
			>
				{!questionEco && closestPeriodLabel === 'négligeable' ? (
					<span>
						Impact négligeable <Emoji e={'😎'} />
					</span>
				) : (
					<>
						<div
							css={`
								padding: 0.6rem 1rem 0.25rem;
								@media (max-width: 1000px) {
									padding: 0.6rem 0.3rem 0.25rem;
								}
								margin-bottom: 0.25rem;
								color: var(--textColor);
								display: flex;
								flex-direction: column;
								justify-content: space-evenly;
								img[alt*='↔'] {
									filter: invert(1);
									margin: 0 0.4rem;
									width: 1.1rem;
								}
							`}
						>
							{exampleName && <div>{<Emoji e={exampleName} hasText />}</div>}
							{questionEco ? (
								<div>
									<h2
										css={`
											white-space: initial;
											line-height: 1rem;
											font-size: 110%;
											margin: 0.4rem 0;
											margin-left: -1rem;
											text-align: center;
											width: calc(100% + 2rem);
										`}
									>
										{nodeValue > 0
											? 'Vous économisez'
											: title.includes('oût')
											? 'Ça vous coûte'
											: title.includes('nergie')
											? 'Vous consommez'
											: 'Vous émettez'}
									</h2>
									<Link
										href={'/documentation/' + encodeRuleName(dottedName)}
										css="color: inherit; text-decoration: none"
									>
										<BudgetBarStyle color={nodeValue < 0 ? 'ee5253' : '1dd1a1'}>
											{nodeValue ? Math.round(Math.abs(nodeValue)) : '?'}{' '}
											{ruleUnit.numerators}
										</BudgetBarStyle>
									</Link>
									<em>
										{title.includes('oût') ? 'sur 10 ans' : 'chaque année'}
									</em>
								</div>
							) : [
									'transport . avion . impact',
									'transport . ferry . empreinte du voyage',
							  ].includes(dottedName) ? (
								<BudgetBar
									{...{
										noExample: !exampleName,
										budget,
										nodeValue,
										exampleName,
										factor,
										closestPeriodLabel,
										closestPeriod,
									}}
								/>
							) : (
								<div
									css={`
										display: flex;
										justify-content: center;
										align-items: center;
										font-size: ${exampleName ? '140%' : '220%'};
										img {
											width: 1.6rem;
											margin-left: 0.4rem;
											vertical-align: bottom;
										}
									`}
								>
									<div>
										{factor +
											' ' +
											closestPeriodLabel +
											(closestPeriod[closestPeriod.length - 1] !== 's' &&
											Math.abs(factor) > 1
												? 's'
												: '')}
									</div>
									<Link css="" href="/crédit-climat-personnel">
										<img src={'/images/yellow-info.svg'} />
									</Link>
								</div>
							)}
							<Link
								css="color: inherit; text-decoration: none"
								href={'/documentation/' + encodeRuleName(dottedName)}
							>
								<p
									css={`
										font-size: 100%;
										margin: 0.3rem 0 0;
										font-style: italic;
										border-radius: 0.4rem;
									`}
								>
									{questionEco ? null : (
										<span>
											{value} {unit} CO₂e
										</span>
									)}
								</p>
							</Link>
						</div>
					</>
				)}
			</div>
		</animate.appear>
	)
}

export const ProgressCircle = ({}) => {
	const nextSteps = useNextQuestions(),
		rules = useSelector((state) => state.rules)
	const foldedStepsRaw = useSelector((state) => state.simulation?.foldedSteps),
		foldedSteps = foldedStepsRaw.filter((step) => !rules[step]?.injecté)
	const progress = foldedSteps.length / (nextSteps.length + foldedSteps.length)
	const motionProgress = useMotionValue(0)
	const pathLength = useSpring(motionProgress, { stiffness: 400, damping: 90 })

	useEffect(() => {
		motionProgress.set(progress)
	}, [progress])

	return (
		<svg
			className="progress-icon"
			viewBox="0 0 60 60"
			css="width: 3rem; position: absolute; right: 0; top: .4rem"
		>
			<motion.path
				fill="none"
				strokeWidth="5"
				stroke="var(--color)"
				strokeDasharray="0 1"
				d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
				style={{
					pathLength,
					rotate: 90,
					translateX: 5,
					translateY: 5,
					scaleX: -1, // Reverse direction of line animation
				}}
			/>
			<motion.path
				fill="none"
				strokeWidth="5"
				stroke="var(--color)"
				d="M14,26 L 22,33 L 35,16"
				initial={false}
				strokeDasharray="0 1"
				animate={{ pathLength: progress === 1 ? 1 : 0 }}
			/>
		</svg>
	)
}

let FirstEstimationStamp = styled.div`
	position: absolute;
	font-size: 100%;
	font-weight: 600;
	display: inline-block;
	padding: 0rem 1rem;
	text-transform: uppercase;
	border-radius: 1rem;
	font-family: 'Courier';
	mix-blend-mode: lighten;
	color: lightgrey;
	border: 0.15rem solid lightgrey;
	-webkit-mask-position: 13rem 6rem;
	-webkit-transform: rotate(-16deg);
	-ms-transform: rotate(-16deg);
	transform: rotate(-7deg);
	border-radius: 4px;
	top: 13em;
	right: -3em;
`
