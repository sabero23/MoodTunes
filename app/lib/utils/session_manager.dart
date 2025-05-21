import 'package:shared_preferences/shared_preferences.dart';

class SessionManager {
  static Future<void> saveSession({
    required String token,
    required String email,
    required String rol,
    required String nombre,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    await prefs.setString('email', email);
    await prefs.setString('rol', rol);
    await prefs.setString('nombre', nombre);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<String?> getEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('email');
  }

  static Future<String?> getRol() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('rol');
  }

  static Future<String?> getNombre() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('nombre');
  }

  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
