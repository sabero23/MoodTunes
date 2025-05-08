import Playlists from "../components/Playlists";
import CreatePlaylist from "../components/CreatePlaylist";

function StandardPage() {
  return (
    <div>
      <h1>🎧 MoodTunes</h1>
      <CreatePlaylist />
      <Playlists />
    </div>
  );
}

export default StandardPage;
