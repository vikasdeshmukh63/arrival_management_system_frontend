import { useParams } from 'react-router-dom'

const IndividualArrival = () => {
    const { arrival_number } = useParams()

    return <div>{arrival_number}</div>
}

export default IndividualArrival
