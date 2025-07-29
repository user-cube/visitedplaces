import dynamic from 'next/dynamic';
import visitedData from '../../data/visited.json';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
    const visitedCities = visitedData.visited as any;

    return (
        <div style={{ 
            height: '100vh', 
            width: '100vw', 
            margin: 0, 
            padding: 0,
            overflow: 'hidden'
        }}>
            <Map cities={visitedCities} />
        </div>
    );
}
