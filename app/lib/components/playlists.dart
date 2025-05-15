import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Playlists extends StatefulWidget {
  const Playlists({super.key});

  @override
  State<Playlists> createState() => _PlaylistsState();
}

class _PlaylistsState extends State<Playlists> {
  List<dynamic> playlists = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    carregarPlaylists();
  }

  Future<void> carregarPlaylists() async {
    final token = await _getToken();
    if (token == null) return;

    final res = await http.get(
      Uri.parse('http://localhost:4000/playlists'),
      headers: {'Authorization': 'Bearer $token'},
    );

    final data = jsonDecode(res.body);
    setState(() {
      playlists = data['playlists'] ?? [];
      loading = false;
    });
  }

  Future<void> eliminarPlaylist(int id) async {
    final token = await _getToken();
    if (token == null) return;

    final res = await http.delete(
      Uri.parse('http://localhost:4000/playlists/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (res.statusCode == 200) carregarPlaylists();
  }

  Future<String?> _getToken() async {
    return Future.value(null); // Reemplazar por SharedPreferences
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (loading) return const Center(child: CircularProgressIndicator());
    if (playlists.isEmpty) return const Text('No tens cap playlist.');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Les meves Playlists', style: theme.textTheme.titleLarge),
        const SizedBox(height: 16),
        ...playlists.map((p) => Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                title: Text(p['nom']),
                subtitle: Text(p['descripcio'] ?? 'Sense descripció'),
                trailing: IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () => eliminarPlaylist(p['id']),
                ),
              ),
            )),
      ],
    );
  }
}
