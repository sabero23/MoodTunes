import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/session_manager.dart';

class AdminScreen extends StatefulWidget {
  const AdminScreen({super.key});

  @override
  State<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> {
  String nomUsuari = '';

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final nom = await SessionManager.getUserName();
    setState(() {
      nomUsuari = nom ?? 'Usuari';
    });
  }

  void logout(BuildContext context) async {
    await SessionManager.clearSession();
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF42658D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF42658D),
        elevation: 0,
        automaticallyImplyLeading: false,
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.menu, color: Colors.white),
            onSelected: (value) {
              if (value == 'logout') logout(context);
              // Aquí pots afegir més opcions si cal.
            },
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'reproductor', child: Text('Reproductor')),
              const PopupMenuItem(value: 'playlist', child: Text('Playlists')),
              const PopupMenuItem(value: 'logout', child: Text('Tanca sessió')),
            ],
            color: Colors.white,
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 30),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Benvingut, $nomUsuari!',
              style: GoogleFonts.poppins(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Com et sents avui?',
              style: GoogleFonts.poppins(
                fontSize: 18,
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 15),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                'Selector (aviat)',
                style: TextStyle(color: Color(0xFF42658D)),
              ),
            ),
            const SizedBox(height: 30),
            Text(
              'Zona Admin: Aquí podries afegir la gestió d’usuaris, estadístiques o altres funcionalitats específiques per a l\'administrador.',
              style: GoogleFonts.poppins(
                fontSize: 16,
                color: Colors.white70,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
