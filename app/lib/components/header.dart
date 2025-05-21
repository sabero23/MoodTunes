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

    return Stack(
      children: [
        AppBar(
          backgroundColor: Colors.black,
          title: Row(
            children: [
              Image.asset('assets/logo.png', height: 30),
              const SizedBox(width: 8),
              const Text(
                'MoodTunes',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
          actions: [
            IconButton(
              icon: Icon(
                theme.brightness == Brightness.dark
                    ? Icons.wb_sunny_outlined
                    : Icons.nightlight_outlined,
              ),
              onPressed: () => toggleTheme(context),
            ),
            IconButton(
              icon: const Icon(Icons.menu),
              onPressed: () => setState(() => showMenu = !showMenu),
            ),
            IconButton(
              icon: const Icon(Icons.logout),
              onPressed: widget.onLogout,
            )
          ],
        ),
        if (showMenu)
          Positioned(
            top: 56,
            right: 12,
            child: Material(
              elevation: 6,
              borderRadius: BorderRadius.circular(12),
              color: theme.cardColor,
              child: Container(
                width: 200,
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${widget.nombre} (${widget.rol})',
                      style: theme.textTheme.bodyMedium,
                    ),
                    const Divider(),
                    if (widget.rol == 'admin')
                      TextButton(
                        onPressed: () => goTo('/admin'),
                        child: const Text('Admin Panel'),
                      ),
                    if (widget.rol == 'premium') ...[
                      TextButton(
                        onPressed: () => goTo('/premium'),
                        child: const Text('Premium Page'),
                      ),
                      TextButton(
                        onPressed: () => goTo('/recomanacions'),
                        child: const Text('Recomanacions'),
                      ),
                    ],
                    if (widget.rol == 'standard') ...[
                      TextButton(
                        onPressed: () => goTo('/standard'),
                        child: const Text('Standard Page'),
                      ),
                      TextButton(
                        onPressed: () => goTo('/recomanacions'),
                        child: const Text('Recomanacions'),
                      ),
                    ],
                    if (['standard', 'premium'].contains(widget.rol))
                      TextButton(
                        onPressed: () => goTo('/reproductor'),
                        child: const Text('Reproductor'),
                      ),
                  ],
                ),
              ),
            ),
          )
      ],
    );
  }
}

/// Clase auxiliar para cambiar tema dinámicamente
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
