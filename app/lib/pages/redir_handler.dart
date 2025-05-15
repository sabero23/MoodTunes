import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RedirHandler extends StatefulWidget {
  final Uri uri;
  const RedirHandler({super.key, required this.uri});

  @override
  State<RedirHandler> createState() => _RedirHandlerState();
}

class _RedirHandlerState extends State<RedirHandler> {
  @override
  void initState() {
    super.initState();
    gestionarRedireccio();
  }

  Future<void> gestionarRedireccio() async {
    final emailFromUrl = widget.uri.queryParameters['email'];
    final email = emailFromUrl; // O lo que hayas almacenado localmente

    if (email == null) {
      if (mounted) Navigator.pushReplacementNamed(context, '/login');
      return;
    }

    final response = await http.get(
      Uri.parse('http://localhost:4000/usuarios/info?email=$email'),
    );

    final data = jsonDecode(response.body);

    if (data['error'] != null) {
      if (mounted) Navigator.pushReplacementNamed(context, '/login');
    } else {
      final rol = data['rol'];
      final token = data['token'];
      final nom = data['nom'];
      final usuariJson = jsonEncode(data);

      // Aquí guardarías localmente los datos (SharedPreferences)

      if (mounted) {
        Navigator.pushReplacementNamed(context, '/$rol', arguments: {
          'token': token,
          'email': email,
          'nombre': nom,
          'usuari': usuariJson,
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text(
          'Redirigint...'
        ),
      ),
    );
  }
}
