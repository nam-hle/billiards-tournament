import { useParams } from 'next/navigation';

export default function YearPlayerProfilePage() {
  // const { id } = useParams();
  return (
    <main>
      <h1>Player Performance - [Year]</h1>
      <p>Performance and stats for this player in [Year].</p>
    </main>
  );
}
