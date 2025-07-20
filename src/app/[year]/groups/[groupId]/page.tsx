import { useParams } from 'next/navigation';

export default function GroupPage() {
  // const { groupId } = useParams();
  return (
    <main>
      <h1>Group Standings & Matches - [Year]</h1>
      <p>Details for this group in the [Year] tournament.</p>
    </main>
  );
}
