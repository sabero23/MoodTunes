import 'package:flutter/material.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

/// Widget que actúa como protección de rutas según el rol de usuario
class RouteGuard extends StatelessWidget {
  final Widget child;
  final List<String> allowedRoles;
  final String? token;

  const RouteGuard({
    super.key,
    required this.child,
    required this.allowedRoles,
    required this.token,
  });

  @override
  Widget build(BuildContext context) {
    if (token == null || token!.isEmpty) {
      return const _AccessDenied();
    }

    try {
      final decoded = JwtDecoder.decode(token!);
      final userRole = decoded['rol'];
      if (!allowedRoles.contains(userRole)) {
        return const _AccessDenied();
      }
      return child;
    } catch (e) {
      return const _AccessDenied();
    }
  }
}

class _AccessDenied extends StatelessWidget {
  const _AccessDenied();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Accés denegat'),
      ),
    );
  }
}
