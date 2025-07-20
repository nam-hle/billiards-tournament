import { useParams } from 'next/navigation';

export default function PlayerProfilePage() {
  // In a real app, fetch player data using the id
  // const { id } = useParams();
  return (
    <main>
      <h1>Player Profile</h1>
      <p>Multi-year stats and profile for this player will be shown here.</p>
    </main>
  );
}
