import 'dart:async';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class ConnectSpotifyPage extends StatefulWidget {
  final String email;
  const ConnectSpotifyPage({super.key, required this.email});

  @override
  State<ConnectSpotifyPage> createState() => _ConnectSpotifyPageState();
}

class _ConnectSpotifyPageState extends State<ConnectSpotifyPage> {
  @override
  void initState() {
    super.initState();
    _launchSpotifyAuth();
  }

  Future<void> _launchSpotifyAuth() async {
    final uri = Uri.parse('http://localhost:4000/auth/spotify?email=${widget.email}');

    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }

    // Esperem uns segons i tornem enrere per refrescar el parent
    await Future.delayed(const Duration(seconds: 4));
    if (mounted) Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text(
          'Redirigint a Spotify...',
          style: TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}
