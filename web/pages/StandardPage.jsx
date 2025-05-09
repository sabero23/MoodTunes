import Playlists from "../src/components/Playlists";
import CreatePlaylist from "../src/components/CreatePlaylist";

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
