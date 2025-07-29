import dynamic from 'next/dynamic';
import visitedData from '../../data/visited.json';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
    const visitedCities = visitedData.visited;

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <Map cities={visitedCities} />
        </div>
    );
}
