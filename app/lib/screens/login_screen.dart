import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  String email = '';
  String nom = '';
  String contrasenya = '';
  String rol = 'standard';
  String error = '';

  Future<void> registrarUsuari() async {
    final url = Uri.parse('http://10.0.2.2:4000/register');
    try {
      final resposta = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'nom': nom,
          'contrasenya': contrasenya,
          'rol': rol,
        }),
      );

      final data = jsonDecode(resposta.body);

      if (resposta.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Compte creat correctament')),
        );
        Navigator.pushReplacementNamed(context, '/login');
      } else {
        setState(() {
          error = data['error'] ?? 'Error desconegut';
        });
      }
    } catch (e) {
      setState(() {
        error = 'Error de connexió amb el servidor';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF42658D),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Image.asset('assets/logo.png', height: 80),
                const SizedBox(height: 20),
                Text(
                  'Crear un nou compte',
                  style: GoogleFonts.poppins(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                  child: const Text(
                    'Ja creat? Inicia la sessió',
                    style: TextStyle(color: Colors.white70),
                  ),
                ),
                const SizedBox(height: 30),
                buildTextField('Usuari', (v) => setState(() => nom = v)),
                buildTextField('Contrasenya', (v) => setState(() => contrasenya = v), isPassword: true),
                buildTextField('Correu electrònic', (v) => setState(() => email = v)),
                const SizedBox(height: 10),
                DropdownButton<String>(
                  value: rol,
                  dropdownColor: Colors.blue[200],
                  items: const [
                    DropdownMenuItem(value: 'standard', child: Text('Standard')),
                    DropdownMenuItem(value: 'premium', child: Text('Premium')),
                    DropdownMenuItem(value: 'admin', child: Text('Admin')),
                  ],
                  onChanged: (value) => setState(() => rol = value!),
                ),
                const SizedBox(height: 10),
                if (error.isNotEmpty)
                  Text(error, style: const TextStyle(color: Colors.redAccent)),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: registrarUsuari,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                    elevation: 10,
                  ),
                  child: const Text('Crear el compte'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget buildTextField(String label, Function(String) onChanged, {bool isPassword = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          style: const TextStyle(color: Colors.white),
          obscureText: isPassword,
          decoration: InputDecoration(
            labelText: label,
            labelStyle: const TextStyle(color: Colors.white70),
            enabledBorder: const UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.white70),
            ),
            focusedBorder: const UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.white),
            ),
          ),
          onChanged: onChanged,
        ),
        const SizedBox(height: 15),
      ],
    );
  }
}
