import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/session_manager.dart';

/// Pantalla principal para el rol 'standard'.
/// Muestra el nombre del usuario y una pregunta sobre el estado de ánimo.
/// Incluye menú de opciones y cierre de sesión.
class StandardScreen extends StatefulWidget {
  const StandardScreen({super.key});

  @override
  State<StandardScreen> createState() => _StandardScreenState();
}

class _StandardScreenState extends State<StandardScreen> {
  String nomUsuari = '';

  @override
  void initState() {
    super.initState();
    _loadUserData(); // Carga el nombre del usuario al iniciar la pantalla.
  }

  /// Carga el nombre del usuario desde la sesión guardada.
  Future<void> _loadUserData() async {
    final nom = await SessionManager.getUserName();
    setState(() {
      nomUsuari = nom ?? 'Usuari'; // Si no encuentra nombre, pone 'Usuari'.
    });
  }

  /// Cierra la sesión y redirige a la pantalla de login.
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
        automaticallyImplyLeading: false, // Evita el botón de 'volver'.
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.menu, color: Colors.white),
            onSelected: (value) {
              if (value == 'logout') logout(context);
              // Aquí se podrían añadir más acciones (ej. navegación entre pantallas).
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
            // Mensaje de bienvenida personalizado con el nombre del usuario.
            Text(
              'Bienvenido, $nomUsuari!',
              style: GoogleFonts.poppins(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 20),
            // Pregunta sobre el estado de ánimo.
            Text(
              '¿Cómo te sientes hoy?',
              style: GoogleFonts.poppins(
                fontSize: 18,
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 15),
            // Placeholder del selector de estado de ánimo (pendiente de implementar).
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
          ],
        ),
      ),
    );
  }
}
