import 'package:flutter/material.dart';
import '../components/header.dart';

class PlaylistPage extends StatefulWidget {
  @override
  _PlaylistPageState createState() => _PlaylistPageState();
}

class _PlaylistPageState extends State<PlaylistPage> {
  List<Map<String, String>> playlists = [];
  String search = "";
  String estatAnim = "Normal"; // Simulació
  String newPlaylistName = "";
  String newPlaylistDesc = "";
  String newSong = "";
  Map<String, String>? selectedPlaylist;

  void addPlaylist() {
    if (newPlaylistName.trim().isEmpty) return;
    setState(() {
      playlists.add({
        'nom': newPlaylistName,
        'descripcio': newPlaylistDesc,
      });
      newPlaylistName = "";
      newPlaylistDesc = "";
    });
  }

  void deletePlaylist(int index) {
    setState(() {
      playlists.removeAt(index);
    });
  }

  void addSong() {
    if (newSong.trim().isEmpty) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Cançó afegida (simulat): $newSong')),
    );
    setState(() {
      newSong = "";
    });
  }

  @override
  Widget build(BuildContext context) {
    final filtered = playlists
        .where((p) => p['nom']!.toLowerCase().contains(search.toLowerCase()))
        .toList();

    return Scaffold(
      appBar: const Header(),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                if (estatAnim.isNotEmpty)
                  Text("Estat d'ànim actual: $estatAnim"),
                const SizedBox(height: 16),
                TextField(
                  decoration: const InputDecoration(hintText: 'Cerca una playlist...'),
                  onChanged: (val) => setState(() => search = val),
                ),
                const SizedBox(height: 24),
                Card(
                  elevation: 3,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        const Text("Nova Playlist", style: TextStyle(fontWeight: FontWeight.bold)),
                        TextField(
                          decoration: const InputDecoration(hintText: "Nom"),
                          onChanged: (val) => newPlaylistName = val,
                        ),
                        TextField(
                          decoration: const InputDecoration(hintText: "Descripció"),
                          onChanged: (val) => newPlaylistDesc = val,
                        ),
                        const SizedBox(height: 10),
                        ElevatedButton(
                          onPressed: addPlaylist,
                          child: const Text("Crear"),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                filtered.isEmpty
                    ? const Text("No tens cap playlist.")
                    : Column(
                        children: List.generate(filtered.length, (index) {
                          final p = filtered[index];
                          return Card(
                            elevation: 2,
                            margin: const EdgeInsets.symmetric(vertical: 8),
                            child: ListTile(
                              title: Text(p['nom'] ?? ""),
                              subtitle: Text(p['descripcio'] ?? "Sense descripció"),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.visibility),
                                    onPressed: () => setState(() => selectedPlaylist = p),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.delete, color: Colors.red),
                                    onPressed: () => deletePlaylist(index),
                                  ),
                                ],
                              ),
                            ),
                          );
                        }),
                      ),
              ],
            ),
          ),
          if (selectedPlaylist != null)
            Positioned.fill(
              child: GestureDetector(
                onTap: () => setState(() => selectedPlaylist = null),
                child: Container(color: Colors.black54),
              ),
            ),
          if (selectedPlaylist != null)
            Center(
              child: Card(
                margin: const EdgeInsets.all(32),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(selectedPlaylist!['nom'] ?? "", style: const TextStyle(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text(selectedPlaylist!['descripcio'] ?? ""),
                      const SizedBox(height: 16),
                      TextField(
                        decoration: const InputDecoration(hintText: "Afegir cançó..."),
                        onChanged: (val) => newSong = val,
                      ),
                      const SizedBox(height: 10),
                      ElevatedButton(
                        onPressed: addSong,
                        child: const Text("Afegir"),
                      ),
                      TextButton(
                        onPressed: () => setState(() => selectedPlaylist = null),
                        child: const Text("Tancar"),
                      )
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
