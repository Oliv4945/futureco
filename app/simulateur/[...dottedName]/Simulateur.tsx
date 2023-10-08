import { questionEcoDimensions } from 'Components/questionEcoDimensions'
import { parentName } from 'Components/utils/publicodesUtils'
import { usePathname } from 'next/navigation'
import { useDispatch } from 'react-redux'
import questionsConfig from './configBuilder'
import SimulateurContent from './SimulateurContent'

const Simulateur = ({ dottedName, rules, searchParams }) => {
	const dispatch = useDispatch()
	const pathname = usePathname()

	if (!rules) return 'Les règles ne sont pas chargées'
	const decodedRule = rules[dottedName]

	if (!decodedRule) return 'Règle non trouvée'

	const objectifs =
		decodedRule.exposé?.type === 'question éco'
			? questionEcoDimensions.map(
					(dimension) => parentName(dottedName) + ' . ' + dimension
			  )
			: [dottedName]

	const config = { objectifs, questions: questionsConfig(dottedName) }

	return <SimulateurContent {...{ objective: dottedName, rules, config }} />
}

export default Simulateur
