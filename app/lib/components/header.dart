import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/session.dart';

/// Componente Header reutilizable con saludo, pregunta y menú desplegable.
/// Incluye lógica para cargar el nombre del usuario y cerrar sesión correctamente.
class Header extends StatefulWidget implements PreferredSizeWidget {
  const Header({super.key});

  @override
  State<Header> createState() => _HeaderState();

  /// Define la altura del header (barra superior).
  @override
  Size get preferredSize => const Size.fromHeight(80);
}

class _HeaderState extends State<Header> {
  String nomUsuari = '';

  @override
  void initState() {
    super.initState();
    _cargarNombreUsuario();
  }

  /// Carga el nombre del usuario desde la sesión y lo guarda en el estado.
  Future<void> _cargarNombreUsuario() async {
    final nom = await SessionManager.getUserName();
    setState(() {
      nomUsuari = nom ?? 'Usuari'; // Si no hay nombre guardado, usa 'Usuari' por defecto.
    });
  }

  /// Cierra la sesión eliminando los datos de SessionManager y redirige al login.
  void _cerrarSesion(BuildContext context) async {
    await SessionManager.clearSession();
    if (mounted) { // Comprobamos que el widget sigue montado antes de navegar.
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  /// Construye el header visualmente.
  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: const Color(0xFF42658D),
      elevation: 0,
      automaticallyImplyLeading: false, // Oculta el botón de volver atrás (si no es necesario).
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Benvingut, $nomUsuari 👋', // Saludo personalizado.
            style: GoogleFonts.poppins(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Com et sents avui?', // Pregunta al usuario (el selector se implementará más adelante).
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.white70,
            ),
          ),
        ],
      ),
      actions: [
        /// 🔜 Botón para el selector de estado de ánimo (funcionalidad pendiente).
        IconButton(
          icon: const Icon(Icons.mood, color: Colors.white),
          onPressed: () {
            // Aquí se implementará el selector de estado de ánimo más adelante.
          },
        ),

PopupMenuButton<String>(
  icon: const Icon(Icons.more_vert, color: Colors.white),
  onSelected: (value) {
    switch (value) {
      case 'logout':
        _cerrarSesion(context);
        break;
      case 'playlists':
        Navigator.pop(context); // Cierra el popup primero
        Future.delayed(Duration(milliseconds: 100), () {
          Navigator.pushNamed(context, '/playlists');
        });
        break;
      case 'reproductor':
        Navigator.pop(context);
        Future.delayed(Duration(milliseconds: 100), () {
          Navigator.pushNamed(context, '/reproductor');
        });
        break;
    }
  },
  itemBuilder: (context) => const [
    PopupMenuItem(
      value: 'reproductor',
      child: Text('Reproductor'),
    ),
    PopupMenuItem(
      value: 'playlists',
      child: Text('Playlists'),
    ),
    PopupMenuItem(
      value: 'logout',
      child: Text('Tanca sessió'),
    ),
  ],
),

      ],
    );
  }
}