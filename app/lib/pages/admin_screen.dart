import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/session_manager.dart';

/// Pantalla principal para el rol de administrador.
/// Incluye saludo personalizado, cierre de sesión y menú para navegación.
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
    _cargarDatosUsuario();
  }

  /// Carga el nombre del usuario desde la sesión y lo guarda en el estado.
  Future<void> _cargarDatosUsuario() async {
    final nom = await SessionManager.getUserName();
    setState(() {
      nomUsuari = nom ?? 'Usuari'; // Si no hay nombre guardado, usa 'Usuari' por defecto.
    });
  }

  /// Cierra la sesión, borra los datos guardados y redirige a la pantalla de login.
  void _cerrarSesion(BuildContext context) async {
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
        automaticallyImplyLeading: false, // Oculta el botón de volver atrás si no es necesario.
        actions: [
          /// Menú desplegable con opciones (reproductor, playlists, cerrar sesión).
          PopupMenuButton<String>(
            icon: const Icon(Icons.menu, color: Colors.white),
            onSelected: (value) {
              if (value == 'logout') _cerrarSesion(context);
              // Aquí se podrían añadir más acciones si fuese necesario.
            },
            itemBuilder: (context) => const [
              PopupMenuItem(value: 'reproductor', child: Text('Reproductor')),
              PopupMenuItem(value: 'playlist', child: Text('Playlists')),
              PopupMenuItem(value: 'logout', child: Text('Tanca sessió')),
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
            /// Texto de bienvenida con el nombre del usuario.
            Text(
              'Benvingut, $nomUsuari!',
              style: GoogleFonts.poppins(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 20),
            /// Pregunta genérica (relacionada con el selector de estado de ánimo).
            Text(
              'Com et sents avui?',
              style: GoogleFonts.poppins(
                fontSize: 18,
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 15),
            /// Espacio reservado para el selector de estado de ánimo (pendiente de implementar).
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                'Selector (próximamente)', // Cambiado a castellano para coherencia.
                style: TextStyle(color: Color(0xFF42658D)),
              ),
            ),
            const SizedBox(height: 30),
            /// Texto informativo sobre las funcionalidades de la zona admin.
            Text(
              'Zona Admin: Aquí podrías añadir gestión de usuarios, estadísticas u otras funcionalidades exclusivas del administrador.',
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
