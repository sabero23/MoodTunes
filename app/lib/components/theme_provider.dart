import 'package:flutter/material.dart';

/// Proveedor personalizado para gestionar tema claro/oscuro manualmente
class ThemeProvider extends StatefulWidget {
  final Widget child;
  final Brightness defaultBrightness;

  const ThemeProvider({
    super.key,
    required this.child,
    this.defaultBrightness = Brightness.light,
  });

  @override
  State<ThemeProvider> createState() => _ThemeProviderState();

  static _ThemeProviderState? of(BuildContext context) {
    return context.findAncestorStateOfType<_ThemeProviderState>();
  }
}

class _ThemeProviderState extends State<ThemeProvider> {
  late Brightness _brightness;

  @override
  void initState() {
    super.initState();
    _brightness = widget.defaultBrightness;
  }

  void setBrightness(Brightness brightness) {
    setState(() {
      _brightness = brightness;
    });
  }

  @override
  Widget build(BuildContext context) {
    return DynamicTheme(
      setBrightness: setBrightness,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData.light(),
        darkTheme: ThemeData.dark(),
        themeMode: _brightness == Brightness.dark
            ? ThemeMode.dark
            : ThemeMode.light,
        home: widget.child,
      ),
    );
  }
}

class DynamicTheme extends InheritedWidget {
  final void Function(Brightness) setBrightness;

  const DynamicTheme({
    super.key,
    required super.child,
    required this.setBrightness,
  });

  static DynamicTheme? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<DynamicTheme>();
  }

  @override
  bool updateShouldNotify(DynamicTheme oldWidget) => true;
}
