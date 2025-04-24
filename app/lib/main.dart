import 'package:flutter/material.dart';
import 'pages/login_screen.dart';
import 'pages/register_screen.dart';
import 'pages/admin_screen.dart';
import 'pages/premium_screen.dart';
import 'pages/standard_screen.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MoodTunes',
      debugShowCheckedModeBanner: false,
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/admin': (context) => const AdminScreen(),
        '/premium': (context) => const PremiumScreen(),
        '/standard': (context) => const StandardScreen(),
      },
    );
  }
}
