import 'package:flutter/material.dart';
import 'pages/login_screen.dart';
import 'pages/register_screen.dart';
import 'pages/admin_screen.dart';
import 'pages/premium_screen.dart';
import 'pages/standard_screen.dart';

/// Punto de entrada principal de la aplicación.
/// Arranca la app cargando el widget MyApp.
void main() => runApp(const MyApp());

/// Widget raíz de la aplicación.
/// Define las rutas de navegación y la configuración general del proyecto.
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MoodTunes',                      // Nombre de la aplicación.
      debugShowCheckedModeBanner: false,       // Oculta la etiqueta de debug en la esquina.
      initialRoute: '/login',                  // Ruta inicial al arrancar la app.
      routes: {
        // Definición de las rutas y sus respectivas pantallas.
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/admin': (context) => const AdminScreen(),
        '/premium': (context) => const PremiumScreen(),
        '/standard': (context) => const StandardScreen(),
      },
    );
  }
}
