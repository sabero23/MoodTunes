import 'package:flutter/material.dart';
import 'components/theme_provider.dart';
import 'pages/login_screen.dart';
import 'pages/register_screen.dart';
import 'pages/standard_page.dart';
import 'pages/premium_page.dart';
import 'pages/admin_page.dart';
import 'pages/recomanacions_page.dart';
import 'pages/reproductor_page.dart';
import 'pages/redir_handler.dart';
import 'pages/connect_spotify.dart';

void main() {
  runApp(const ThemeProvider(child: MoodTunesApp()));
}

class MoodTunesApp extends StatelessWidget {
  const MoodTunesApp({super.key});

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'MoodTunes',
      theme: ThemeData.light(),
      darkTheme: ThemeData.dark(),
      themeMode:
          brightness == Brightness.dark ? ThemeMode.dark : ThemeMode.light,
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/standard': (context) => const StandardPage(),
        '/premium': (context) => const PremiumPage(),
        '/admin': (context) => const AdminPage(),
        '/recomanacions': (context) => const RecomanacionsPage(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/reproductor') {
          final args = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
              builder: (_) => ReproductorPage(canco: args));
        } else if (settings.name == '/redir') {
          final uri = settings.arguments as Uri;
          return MaterialPageRoute(
              builder: (_) => RedirHandler(uri: uri));
        } else if (settings.name == '/connect_spotify') {
          final email = settings.arguments as String;
          return MaterialPageRoute(
              builder: (_) => ConnectSpotifyPage(email: email));
        }
        return null;
      },
    );
  }
}
