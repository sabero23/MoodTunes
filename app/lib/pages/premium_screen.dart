import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/session_manager.dart';
import '../components/mood_selector_magic.dart';
import '../components/header.dart';

class PremiumScreen extends StatefulWidget {
  const PremiumScreen({super.key});

  @override
  State<PremiumScreen> createState() => _PremiumScreenState();
}

class _PremiumScreenState extends State<PremiumScreen> {
  String? nom;
  String? email;
  String? token;
  bool spotifyLinked = false;

  @override
  void initState() {
    super.initState();
    carregarDades();
  }

  void carregarDades() async {
    final nomGuardat = await SessionManager.getNombre();
    final emailGuardat = await SessionManager.getEmail();
    final tokenGuardat = await SessionManager.getToken();

    String? refreshToken;

    if (tokenGuardat != null && emailGuardat != null) {
      final res = await http.get(
        Uri.parse('http://localhost:4000/usuarios/info?email=$emailGuardat'),
        headers: {"Authorization": "Bearer $tokenGuardat"},
      );

      final data = jsonDecode(res.body);
      refreshToken = data['spotify_refresh_token'];
    }

    setState(() {
      nom = nomGuardat;
      email = emailGuardat;
      token = tokenGuardat;
      spotifyLinked = refreshToken != null;
    });
  }

  void iniciarSpotify() async {
    if (email != null) {
      final uri = Uri.parse('http://localhost:4000/auth/spotify?email=$email');
      final linked = await Navigator.pushNamed(
        context,
        '/connect_spotify',
        arguments: uri.toString(),
      );
      if (linked == true) {
        carregarDades();
      }
    }
  }

  void logout() async {
    await SessionManager.clearSession();
    if (mounted) Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: Header(
        rol: 'premium',
        nombre: nom ?? 'Usuari',
        onLogout: logout,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Benvingut, usuari premium!',
              style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 6),
            Text(
              nom ?? 'Usuari',
              style: theme.textTheme.headlineSmall?.copyWith(
                color: theme.colorScheme.primary,
              ),
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
