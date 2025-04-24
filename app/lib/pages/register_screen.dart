import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  String email = '';
  String nom = '';
  String contrasenya = '';
  DateTime? selectedDate;
  String rol = 'standard';
  String error = '';
  bool showPassword = false;

  String get formattedDate {
    if (selectedDate == null) return '';
    return DateFormat('yyyy-MM-dd').format(selectedDate!);
  }

  Future<void> registrarUsuari() async {
    final url = Uri.parse('http://localhost:4000/register');
    try {
      final resposta = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'nom': nom,
          'contrasenya': contrasenya,
          'rol': rol,
          'data_naixement': formattedDate,
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

  Future<void> triarData(BuildContext context) async {
    final DateTime? data = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (data != null) {
      setState(() {
        selectedDate = data;
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Ja creat?',
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        color: Colors.white70,
                      ),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                      child: Text(
                        'Inicia la sessió',
                        style: GoogleFonts.poppins(
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          decoration: TextDecoration.none,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 30),
                buildTextField('Usuari', (v) => setState(() => nom = v)),
                buildTextField('Contrasenya', (v) => setState(() => contrasenya = v), isPassword: true),
                buildTextField('Correu electrònic', (v) => setState(() => email = v)),
                const SizedBox(height: 15),
                GestureDetector(
                  onTap: () => triarData(context),
                  child: AbsorbPointer(
                    child: TextField(
                      decoration: InputDecoration(
                        labelText: 'Data de naixement',
                        labelStyle: const TextStyle(color: Colors.white70),
                        hintText: 'yyyy-mm-dd',
                        hintStyle: const TextStyle(color: Colors.white38),
                        enabledBorder: const UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.white70),
                        ),
                        focusedBorder: const UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.white),
                        ),
                      ),
                      style: const TextStyle(color: Colors.white),
                      controller: TextEditingController(text: formattedDate),
                    ),
                  ),
                ),
                const SizedBox(height: 15),
                Theme(
                  data: Theme.of(context).copyWith(
                    canvasColor: Colors.blue[200],
                  ),
                  child: DropdownButton<String>(
                    value: rol,
                    dropdownColor: Colors.blue[200],
                    style: const TextStyle(color: Colors.white),
                    items: const [
                      DropdownMenuItem(
                        value: 'standard',
                        child: Text('Standard', style: TextStyle(color: Colors.white)),
                      ),
                      DropdownMenuItem(
                        value: 'premium',
                        child: Text('Premium', style: TextStyle(color: Colors.white)),
                      ),
                    ],
                    onChanged: (value) => setState(() => rol = value!),
                  ),
                ),
                const SizedBox(height: 10),
                if (error.isNotEmpty)
                  Text(error, style: const TextStyle(color: Colors.redAccent)),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: registrarUsuari,
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
                    'Crear el compte',
                    style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
                  ),
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
