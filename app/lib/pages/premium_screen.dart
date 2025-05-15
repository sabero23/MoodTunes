import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'mood_selector_magic.dart';

class PremiumPage extends StatefulWidget {
  const PremiumPage({super.key});

  @override
  State<PremiumPage> createState() => _PremiumPageState();
}

class _PremiumPageState extends State<PremiumPage> {
  String? nombre;
  bool spotifyLinked = false;

  @override
  void initState() {
    super.initState();
    carregarDadesUsuari();
  }

  void carregarDadesUsuari() async {
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
      if (mounted) Navigator.pushNamed(context, '/connect_spotify', arguments: uri.toString());
    }
  }

  Future<String?> _getLocal(String key) async {
    return Future.value(null); // sustituir por SharedPreferences
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.colorScheme.background,
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
