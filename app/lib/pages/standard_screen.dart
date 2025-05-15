import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'mood_selector_magic.dart'; // Este será tu componente animado del mood selector

class StandardPage extends StatefulWidget {
  const StandardPage({super.key});

  @override
  State<StandardPage> createState() => _StandardPageState();
}

class _StandardPageState extends State<StandardPage> {
  String? nombre;
  bool spotifyLinked = false;

  @override
  void initState() {
    super.initState();
    cargarDadesUsuari();
  }

  void cargarDadesUsuari() async {
    final token = await _getLocal('token');
    final email = await _getLocal('email');
    final nom = await _getLocal('nombre');

    if (token == null || email == null) {
      if (mounted) Navigator.pushReplacementNamed(context, '/login');
    } else {
      setState(() => nombre = nom ?? 'Usuari');

      final res = await http.get(
        Uri.parse('http://localhost:4000/usuarios/info?email=$email'),
        headers: {"Authorization": "Bearer $token"},
      );

      final data = jsonDecode(res.body);
      if (data['spotify_refresh_token'] != null) {
        setState(() => spotifyLinked = true);
      }
    }
  }

  void iniciarSpotify() async {
    final email = await _getLocal('email');
    if (email != null) {
      final uri = Uri.parse('http://localhost:4000/auth/spotify?email=$email');
      // Esto abre el navegador externo
      if (mounted) Navigator.pushNamed(context, '/connect_spotify', arguments: uri.toString());
    }
  }

  Future<String?> _getLocal(String key) async {
    // Sustituir por SharedPreferences o secure_storage si lo implementas
    return Future.value(null); // Placeholder si aún no tienes guardado nada
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
<<<<<<< HEAD
      backgroundColor: const Color(0xFF42658D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF42658D),
        elevation: 0,
        automaticallyImplyLeading: false, // Evita el botón de 'volver'.
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.menu, color: Colors.white),
         onSelected: (value) {
  if (value == 'logout') {
    logout(context);
  } else if (value == 'playlist') {
    Navigator.pushNamed(context, '/playlists'); // ✅ Esto era lo que faltaba
  } else if (value == 'reproductor') {
    Navigator.pushNamed(context, '/reproductor'); // (si lo tienes implementado)
  }
},

            itemBuilder: (context) => [
              const PopupMenuItem(value: 'reproductor', child: Text('Reproductor')),
              const PopupMenuItem(value: 'playlist', child: Text('Playlists')),
              const PopupMenuItem(value: 'logout', child: Text('Cerrar sesión')),
            ],
            color: Colors.white,
          ),
        ],
      ),
=======
      backgroundColor: theme.colorScheme.background,
>>>>>>> 44f321b9e27379ef06ba58518dbdf45849dba3ac
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Benvingut,',
              style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 6),
            Text(
              nombre != null ? nombre! : 'Usuari',
              style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.primary),
            ),
            const SizedBox(height: 30),
            if (!spotifyLinked)
              Column(
                children: [
                  Text(
                    "Abans d'utilitzar el servei, has de vincular el teu compte Spotify:",
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green[500],
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: iniciarSpotify,
                    child: const Text('Iniciar sessió amb Spotify'),
                  )
                ],
              )
            else
              const MoodSelectorMagic(),
          ],
        ),
      ),
    );
  }
}
