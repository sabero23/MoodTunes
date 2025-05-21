import 'package:flutter/material.dart';

class Header extends StatefulWidget implements PreferredSizeWidget {
  final String rol;
  final String nombre;
  final VoidCallback onLogout;

  const Header({
    super.key,
    required this.rol,
    required this.nombre,
    required this.onLogout,
  });

  @override
  State<Header> createState() => _HeaderState();

  @override
  Size get preferredSize => const Size.fromHeight(56);
}

class _HeaderState extends State<Header> {
  bool showMenu = false;

  void toggleTheme(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final isDark = brightness == Brightness.dark;
    DynamicTheme.of(context)?.setBrightness(isDark ? Brightness.light : Brightness.dark);
  }

  void goTo(String route) {
    setState(() => showMenu = false);
    Navigator.pushNamed(context, route);
  }

@override
Widget build(BuildContext context) {
  final theme = Theme.of(context);

  return AppBar(
    backgroundColor: theme.primaryColor,
    title: Text('${widget.rol}: ${widget.nombre}'),
    actions: [
      IconButton(
        icon: Icon(
          Theme.of(context).brightness == Brightness.dark
              ? Icons.light_mode
              : Icons.dark_mode,
          color: Colors.white,
        ),
        onPressed: () => toggleTheme(context),
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
              Future.delayed(const Duration(milliseconds: 100), () {
                Navigator.pushNamed(context, '/playlists');
              });
              break;
            case 'reproductor':
              Navigator.pop(context);
              Future.delayed(const Duration(milliseconds: 100), () {
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

void _cerrarSesion(BuildContext context) {
  widget.onLogout();
}
}

// Clase auxiliar para cambiar tema dinámicamente
class DynamicTheme extends InheritedWidget {
  final void Function(Brightness) setBrightness;

  const DynamicTheme({
    super.key,
    required super.child,
    required this.setBrightness,
  });

  static DynamicTheme? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<DynamicTheme>();
  }

  @override
  bool updateShouldNotify(DynamicTheme oldWidget) => true;
}
