import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

class LogoutButton extends StatelessWidget {
  final VoidCallback? onLoggedOut;
  const LogoutButton({super.key, this.onLoggedOut});

  void handleLogout(BuildContext context) {
    // Aquí se elimina el token local (usando SharedPreferences si lo configuras)
    Fluttertoast.showToast(msg: 'Sessió tancada correctament');
    onLoggedOut?.call();
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => handleLogout(context),
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.red,
        foregroundColor: Colors.white,
      ),
      child: const Text('Tancar sessió'),
    );
  }
}
