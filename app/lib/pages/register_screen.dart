import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController nomController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController birthDateController = TextEditingController();
  bool showPassword = false;
  String selectedRol = 'standard';

  void registrarUsuari() async {
    final response = await http.post(
      Uri.parse('http://localhost:4000/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': emailController.text,
        'nom': nomController.text,
        'contrasenya': passwordController.text,
        'rol': selectedRol,
        'data_naixement': birthDateController.text,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 201) {
      Fluttertoast.showToast(msg: 'Usuari creat correctament!');
      Future.delayed(const Duration(seconds: 2), () {
        Navigator.pushReplacementNamed(context, '/login');
      });
    } else {
      Fluttertoast.showToast(msg: data['error'] ?? 'Error desconegut al registrar');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isDark
                ? [Color(0xFF0b132b), Color(0xFF1c2541)]
                : [Colors.blue.shade100, Colors.blue.shade300],
          ),
        ),
        padding: const EdgeInsets.all(20),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Image.asset('assets/logo.png', width: 64),
                const SizedBox(height: 10),
                Text('Crear un nou compte',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.black87,
                    )),
                const SizedBox(height: 30),
                _buildInputField('Usuari', nomController),
                const SizedBox(height: 15),
                _buildInputField('Correu electrònic', emailController, keyboard: TextInputType.emailAddress),
                const SizedBox(height: 15),
                _buildPasswordField(),
                const SizedBox(height: 15),
                _buildInputField('Data de naixement', birthDateController, keyboard: TextInputType.datetime),
                const SizedBox(height: 15),
                DropdownButtonFormField<String>(
                  value: selectedRol,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    labelText: 'Tipus de compte',
                    filled: true,
                  ),
                  items: const [
                    DropdownMenuItem(value: 'standard', child: Text('Standard')),
                    DropdownMenuItem(value: 'premium', child: Text('Premium')),
                  ],
                  onChanged: (value) {
                    if (value != null) setState(() => selectedRol = value);
                  },
                ),
                const SizedBox(height: 25),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue[600],
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: registrarUsuari,
                  child: const Text(
                    'Crear el compte',
                    style: TextStyle(fontWeight: FontWeight.w600),
                  ),
                ),
                const SizedBox(height: 15),
                GestureDetector(
                  onTap: () => Navigator.pushReplacementNamed(context, '/login'),
                  child: Text(
                    "Ja tens un compte? Inicia la sessió",
                    style: TextStyle(
                      color: isDark ? Colors.blue[200] : Colors.blue[600],
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputField(String label, TextEditingController controller,
      {TextInputType keyboard = TextInputType.text}) {
    return TextField(
      controller: controller,
      keyboardType: keyboard,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
        filled: true,
      ),
    );
  }

  Widget _buildPasswordField() {
    return TextField(
      controller: passwordController,
      obscureText: !showPassword,
      decoration: InputDecoration(
        labelText: 'Contrasenya',
        border: const OutlineInputBorder(),
        filled: true,
        suffixIcon: IconButton(
          icon: Icon(showPassword ? Icons.visibility_off : Icons.visibility),
          onPressed: () {
            setState(() {
              showPassword = !showPassword;
            });
          },
        ),
      ),
    );
  }
}