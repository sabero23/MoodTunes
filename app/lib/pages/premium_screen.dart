import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/session_manager.dart';

/// Pantalla principal para el usuario con rol Premium.
/// Muestra mensaje de bienvenida, opciones de menú y espacio para futuras funcionalidades exclusivas.
class PremiumScreen extends StatefulWidget {
  const PremiumScreen({super.key});

  @override
  State<PremiumScreen> createState() => _PremiumScreenState();
}

class _PremiumScreenState extends State<PremiumScreen> {
  String nomUsuari = '';

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  /// Carga el nombre del usuario desde la sesión almacenada.
  /// Si no se encuentra el nombre, utiliza 'Usuari' por defecto.
  Future<void> _loadUserData() async {
    final nom = await SessionManager.getUserName();
    setState(() {
      nomUsuari = nom ?? 'Usuari';
    });
  }

  /// Función para cerrar sesión.
  /// Limpia los datos de la sesión y redirige al login.
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
              // Aquí se pueden añadir más opciones si es necesario.
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
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 30),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Bienvenido, $nomUsuari',
              style: GoogleFonts.poppins(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              '¿Cómo te sientes hoy?',
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
                'Selector (próximamente)',
                style: TextStyle(color: Color(0xFF42658D)),
              ),
            ),
            const SizedBox(height: 30),
            Text(
              'Zona Premium: Aquí se pueden añadir funcionalidades exclusivas, recomendaciones especiales o ventajas para los usuarios premium.',
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
