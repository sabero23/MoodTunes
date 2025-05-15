import 'package:flutter/material.dart';
import 'package:moodtunes/components/header.dart';

class AppLayout extends StatelessWidget {
  final Widget child;
  final String rol;
  final String nombre;
  final VoidCallback onLogout;

  const AppLayout({
    super.key,
    required this.child,
    required this.rol,
    required this.nombre,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: Header(
        rol: rol,
        nombre: nombre,
        onLogout: onLogout,
      ),
      body: Container(
        padding: const EdgeInsets.all(16),
        color: Theme.of(context).colorScheme.background,
        child: child,
      ),
    );
  }
}
