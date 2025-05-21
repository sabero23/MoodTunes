import 'package:flutter/material.dart';

/// Widget que permite alternar entre tema claro y oscuro
class ThemeToggle extends StatelessWidget {
  final Brightness currentBrightness;
  final void Function(Brightness) onToggle;

  const ThemeToggle({
    super.key,
    required this.currentBrightness,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = currentBrightness == Brightness.dark;

    return Positioned(
      top: 16,
      right: 16,
      child: IconButton(
        tooltip: 'Canviar tema',
        icon: Icon(isDark ? Icons.wb_sunny_outlined : Icons.nights_stay_outlined),
        onPressed: () => onToggle(isDark ? Brightness.light : Brightness.dark),
        style: ButtonStyle(
          backgroundColor: MaterialStatePropertyAll(
            isDark ? Colors.black : Colors.white,
          ),
          foregroundColor: MaterialStatePropertyAll(
            isDark ? Colors.white : Colors.black,
          ),
          shape: MaterialStatePropertyAll(
            RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(
                color: isDark ? Colors.grey.shade700 : Colors.grey.shade300,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
