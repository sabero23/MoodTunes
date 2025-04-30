import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

/// Pantalla de registro de usuario.
/// Permite introducir datos básicos: nombre, contraseña, email, rol y fecha de nacimiento.
/// Envía los datos al backend para crear el usuario en la base de datos.
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

  /// Formatea la fecha seleccionada a formato yyyy-MM-dd para enviarla al backend.
  String get formattedDate {
    if (selectedDate == null) return '';
    return DateFormat('yyyy-MM-dd').format(selectedDate!);
  }

  /// Función que realiza la petición HTTP POST al endpoint /register.
  /// Envía los datos del formulario al servidor para registrar el usuario.
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
        // Registro correcto: muestra mensaje y redirige al login.
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cuenta creada correctamente')),
        );
        Navigator.pushReplacementNamed(context, '/login');
      } else {
        // Error devuelto por el backend.
        setState(() {
          error = data['error'] ?? 'Error desconocido al registrar';
        });
      }
    } catch (e) {
      // Error de conexión con el backend.
      setState(() {
        error = 'Error de conexión con el servidor';
      });
    }
  }

  /// Abre el selector de fecha (DatePicker).
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
                  'Crear una nueva cuenta',
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
                      '¿Ya tienes cuenta?',
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        color: Colors.white70,
                      ),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                      child: Text(
                        'Inicia sesión',
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
                buildTextField('Nombre de usuario', (v) => setState(() => nom = v)),
                buildTextField('Contraseña', (v) => setState(() => contrasenya = v), isPassword: true),
                buildTextField('Correo electrónico', (v) => setState(() => email = v)),
                const SizedBox(height: 15),
                // Selector de fecha de nacimiento
                GestureDetector(
                  onTap: () => triarData(context),
                  child: AbsorbPointer(
                    child: TextField(
                      decoration: InputDecoration(
                        labelText: 'Fecha de nacimiento',
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
                // Selector del tipo de cuenta
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
                    'Crear cuenta',
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

  /// Constructor de los campos del formulario con opción para contraseña visible/oculta.
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
