import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class CreatePlaylist extends StatefulWidget {
  final VoidCallback? onCreated;
  const CreatePlaylist({super.key, this.onCreated});

  @override
  State<CreatePlaylist> createState() => _CreatePlaylistState();
}

class _CreatePlaylistState extends State<CreatePlaylist> {
  final TextEditingController nomController = TextEditingController();
  final TextEditingController descripcioController = TextEditingController();

  Future<void> crearPlaylist() async {
    final nom = nomController.text.trim();
    final descripcio = descripcioController.text.trim();

    if (nom.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ El nom de la playlist és obligatori')),
      );
      return;
    }

    final token = await _getToken();
    if (token == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Torna a iniciar sessió.')),
      );
      return;
    }

    final res = await http.post(
      Uri.parse('http://localhost:4000/playlists'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'nom': nom,
        'descripcio': descripcio,
      }),
    );

    final data = jsonDecode(res.body);
    if (res.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('✅ Playlist creada!')),
      );
      nomController.clear();
      descripcioController.clear();
      widget.onCreated?.call();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(data['error'] ?? '❌ Error al crear la playlist')),
      );
    }
  }

  Future<String?> _getToken() async {
    return Future.value(null); // Reemplazar con SharedPreferences
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Nova Playlist', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          TextField(
            controller: nomController,
            decoration: const InputDecoration(
              labelText: 'Nom',
              border: OutlineInputBorder(),
              filled: true,
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: descripcioController,
            decoration: const InputDecoration(
              labelText: 'Descripció (opcional)',
              border: OutlineInputBorder(),
              filled: true,
            ),
          ),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: crearPlaylist,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Crear'),
          )
        ],
      ),
    );
  }
}
