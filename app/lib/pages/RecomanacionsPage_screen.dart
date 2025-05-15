import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RecomanacionsPage extends StatefulWidget {
  const RecomanacionsPage({super.key});

  @override
  State<RecomanacionsPage> createState() => _RecomanacionsPageState();
}

class _RecomanacionsPageState extends State<RecomanacionsPage> {
  List<dynamic> recomanacions = [];

  @override
  void initState() {
    super.initState();
    carregarRecomanacions();
  }

  Future<void> carregarRecomanacions() async {
    final token = await _getLocal('token');
    if (token == null) return Navigator.pushReplacementNamed(context, '/login');

    final res = await http.get(
      Uri.parse('http://localhost:4000/api/recomanacions'),
      headers: {"Authorization": "Bearer $token"},
    );

    final data = jsonDecode(res.body);
    if (data['recomanacions'] != null) {
      setState(() => recomanacions = data['recomanacions']);
    }
  }

  Future<String?> _getLocal(String key) async {
    return Future.value(null); // Reemplaza con SharedPreferences
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.colorScheme.background,
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 30),
            TextButton.icon(
              onPressed: () => Navigator.pop(context),
              icon: const Icon(Icons.arrow_back),
              label: const Text("Tornar"),
            ),
            const SizedBox(height: 10),
            Text(
              "Recomanacions musicals",
              style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            if (recomanacions.isEmpty)
              const Text("No s'han trobat recomanacions.")
            else
              Expanded(
                child: GridView.builder(
                  itemCount: recomanacions.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 4 / 3,
                  ),
                  itemBuilder: (context, index) {
                    final canco = recomanacions[index];
                    return GestureDetector(
                      onTap: () => Navigator.pushNamed(
                        context,
                        '/reproductor',
                        arguments: canco,
                      ),
                      child: Container(
                        decoration: BoxDecoration(
                          color: theme.cardColor,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            )
                          ],
                        ),
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              canco['nom_canco'],
                              style: theme.textTheme.titleMedium,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              canco['artista'],
                              style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor),
                              overflow: TextOverflow.ellipsis,
                            ),
                            const Spacer(),
                            Text(
                              "Obrir a Spotify",
                              style: theme.textTheme.labelSmall?.copyWith(
                                color: theme.colorScheme.primary,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              )
          ],
        ),
      ),
    );
  }
}
