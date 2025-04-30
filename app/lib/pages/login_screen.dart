import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import '../utils/session.dart';

/// Pantalla de Login para MoodTunes.
/// Permite iniciar sesión, guarda la sesión del usuario y redirige según el rol.
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  String email = '';
  String contrasenya = '';
  String error = '';
  bool showPassword = false;

  /// Función que realiza la petición al backend para iniciar sesión.
  /// Si es correcto, guarda la sesión y redirige a la pantalla según el rol.
  Future<void> iniciarSessio() async {
    final url = Uri.parse('http://localhost:4000/login'); //  Cambiar en producción si es necesario.
    try {
      final resposta = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'contrasenya': contrasenya}),
      );

      final data = jsonDecode(resposta.body);

      if (resposta.statusCode == 200 && data['rol'] != null) {
        //  Guarda la sesión con el token, email y rol del usuario.
        await SessionManager.saveSession(
          data['token'],
          email,
          data['rol'],
        );

        //  Redirige automáticamente a la pantalla correspondiente según el rol.
        Navigator.pushReplacementNamed(context, '/${data['rol']}');
      } else {
        setState(() {
          error = data['error'] ?? 'Credenciales incorrectas';
        });
      }
    } catch (e) {
      setState(() {
        error = 'Error de conexión con el servidor';
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
                  'Bienvenido a MoodTunes',
                  style: GoogleFonts.poppins(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 30),
                buildTextField('Correo electrónico', (v) => setState(() => email = v)),
                buildTextField('Contraseña', (v) => setState(() => contrasenya = v), isPassword: true),
                const SizedBox(height: 10),
                if (error.isNotEmpty)
                  Text(error, style: const TextStyle(color: Colors.redAccent)),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: iniciarSessio,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF42658D),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                    elevation: 10,
                  ),
                  child: Text(
                    'Iniciar sesión',
                    style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '¿No tienes una cuenta?',
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        color: Colors.white70,
                      ),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pushReplacementNamed(context, '/register'),
                      child: Text(
                        'Regístrate',
                        style: GoogleFonts.poppins(
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          decoration: TextDecoration.none,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Construye un campo de texto personalizado.
  /// Soporta modo contraseña (ocultar/mostrar).
  Widget buildTextField(String label, Function(String) onChanged, {bool isPassword = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          style: const TextStyle(color: Colors.white),
          obscureText: isPassword ? !showPassword : false,
          decoration: InputDecoration(
            labelText: label,
            labelStyle: const TextStyle(color: Colors.white70),
            enabledBorder: const UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.white70),
            ),
            focusedBorder: const UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.white),
            ),
            suffixIcon: isPassword
                ? IconButton(
                    icon: Icon(
                      showPassword ? Icons.visibility_off : Icons.visibility,
                      color: Colors.white70,
                    ),
                    onPressed: () {
                      setState(() {
                        showPassword = !showPassword;
                      });
                    },
                  )
                : null,
          ),
          onChanged: onChanged,
        ),
        const SizedBox(height: 15),
      ],
    );
  }
}