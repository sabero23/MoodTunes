import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class RegisterScreen extends StatelessWidget {
  final TextEditingController nomController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController dataController = TextEditingController();
  String rol = 'standard';

  RegisterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF3B5A7B),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 30),
          child: ListView(
            children: [
              const SizedBox(height: 60),
              Center(
                child: Text(
                  'Crear un nou compte',
                  style: GoogleFonts.sen(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Center(
                child: GestureDetector(
                  onTap: () => Navigator.pushNamed(context, '/login'),
                  child: Text(
                    'Ja creat? Inicia la sessió',
                    style: GoogleFonts.sen(
                      fontSize: 14,
                      color: Colors.white,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 40),

              // Nom
              _inputField(nomController, 'Usuari'),
              const SizedBox(height: 20),

              // Contrasenya
              _inputField(passwordController, 'Contrasenya', obscure: true),
              const SizedBox(height: 20),

              // Email
              _inputField(emailController, 'Correu electrònic'),
              const SizedBox(height: 20),

              // Data de naixement
              _inputField(dataController, 'Data de naixement'),
              const SizedBox(height: 20),

              // Rol
              DropdownButtonFormField<String>(
                value: rol,
                dropdownColor: const Color(0xFF3B5A7B),
                decoration: const InputDecoration(
                  border: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white)),
                  focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white)),
                ),
                style: const TextStyle(color: Colors.white),
                items: ['standard', 'premium'].map((String valor) {
                  return DropdownMenuItem<String>(
                    value: valor,
                    child: Text(valor, style: const TextStyle(color: Colors.white)),
                  );
                }).toList(),
                onChanged: (value) => rol = value!,
              ),

              const SizedBox(height: 30),

              // Botó
              ElevatedButton(
                onPressed: () {
                  // 🔁 Enviar dades al backend aquí
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFF3B5A7B),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text(
                  'Crear el compte',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _inputField(TextEditingController controller, String label, {bool obscure = false}) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white),
        enabledBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.white)),
        focusedBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.white)),
      ),
    );
  }
}
