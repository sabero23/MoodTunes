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
    _redirigirASpotify();
  }

  Future<void> _redirigirASpotify() async {
    final url = Uri.parse('http://localhost:4000/auth/spotify?email=${widget.email}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No s’ha pogut obrir Spotify')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text(
          'Redirigint a Spotify...'
        ),
      ),
    );
  }
}
