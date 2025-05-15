import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class MoodSelectorMagic extends StatefulWidget {
  const MoodSelectorMagic({super.key});

  @override
  State<MoodSelectorMagic> createState() => _MoodSelectorMagicState();
}

class _MoodSelectorMagicState extends State<MoodSelectorMagic>
    with SingleTickerProviderStateMixin {
  int selectedIndex = 2; // Valor por defecto

  final moods = [
    {'id': 'muy_mal', 'label': 'Muy mal', 'color': [Colors.red, Colors.redAccent]},
    {'id': 'mal', 'label': 'Mal', 'color': [Colors.orange, Colors.deepOrange]},
    {'id': 'algo_mal', 'label': 'Algo mal', 'color': [Colors.amber, Colors.amberAccent]},
    {'id': 'normal', 'label': 'Normal', 'color': [Colors.grey, Colors.blueGrey]},
    {'id': 'bien', 'label': 'Bien', 'color': [Colors.green, Colors.lightGreen]},
    {'id': 'muy_bien', 'label': 'Muy bien', 'color': [Colors.teal, Colors.greenAccent]},
    {'id': 'motivado', 'label': 'Motivado', 'color': [Colors.blue, Colors.indigo]},
  ];

  void handleNext() async {
    final selectedMood = moods[selectedIndex];
    final token = await _getLocalToken();

    final res = await http.post(
      Uri.parse('http://localhost:4000/api/estat'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'estat': selectedMood['id']}),
    );

    final data = jsonDecode(res.body);

    if (res.statusCode == 200) {
      Fluttertoast.showToast(msg: "Estat d'ànim guardat!");
      if (mounted) Navigator.pushNamed(context, '/recomanacions');
    } else {
      Fluttertoast.showToast(msg: data['error'] ?? 'Error al desar l\'estat');
    }
  }

  Future<String?> _getLocalToken() async {
    return Future.value(null); // Reemplazar con SharedPreferences o secure_storage
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final selectedMood = moods[selectedIndex];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '¿Cómo te has sentido en general hoy?',
            style: theme.textTheme.titleMedium?.copyWith(color: Colors.white),
          ),
          const SizedBox(height: 24),
          AnimatedContainer(
            duration: const Duration(milliseconds: 600),
            width: 160,
            height: 160,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: List<Color>.from(selectedMood['color'] as List),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 12,
                  spreadRadius: 2,
                )
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text(
            selectedMood['label'],
            style: theme.textTheme.headlineSmall?.copyWith(color: Colors.white),
          ),
          const SizedBox(height: 24),
          Slider(
            value: selectedIndex.toDouble(),
            min: 0,
            max: (moods.length - 1).toDouble(),
            divisions: moods.length - 1,
            onChanged: (value) {
              setState(() => selectedIndex = value.round());
            },
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(moods.first['label'], style: const TextStyle(color: Colors.white70)),
              Text(moods.last['label'], style: const TextStyle(color: Colors.white70)),
            ],
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: handleNext,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.indigo,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Siguiente'),
          )
        ],
      ),
    );
  }
}
