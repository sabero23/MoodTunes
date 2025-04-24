import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../utils/session.dart';

class Header extends StatefulWidget implements PreferredSizeWidget {
  const Header({super.key});

  @override
  State<Header> createState() => _HeaderState();

  @override
  Size get preferredSize => const Size.fromHeight(80);
}

class _HeaderState extends State<Header> {
  String nomUsuari = '';

  @override
  void initState() {
    super.initState();
    _carregarNom();
  }

  Future<void> _carregarNom() async {
    final nom = await SessionManager.getUserName();
    setState(() {
      nomUsuari = nom ?? 'Usuari';
    });
  }

  void _tancarSessio(BuildContext context) async {
    await SessionManager.clearSession();
    if (mounted) {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: const Color(0xFF42658D),
      elevation: 0,
      automaticallyImplyLeading: false,
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Benvingut, $nomUsuari 👋',
            style: GoogleFonts.poppins(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Com et sents avui?',
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.white70,
            ),
          ),
        ],
      ),
      actions: [
        // 🔥 Placeholder del selector (després afegirem la funcionalitat real)
        IconButton(
          icon: const Icon(Icons.mood, color: Colors.white),
          onPressed: () {
            // Aquí pots obrir el selector d'estat d'ànim en el futur
          },
        ),
        PopupMenuButton<String>(
          icon: const Icon(Icons.more_vert, color: Colors.white),
          onSelected: (value) {
            if (value == 'logout') {
              _tancarSessio(context);
            }
          },
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'logout',
              child: Text('Tanca sessió'),
            ),
          ],
        ),
      ],
    );
  }
}
