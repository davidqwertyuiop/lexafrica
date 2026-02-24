import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'pages/chat_page.dart';
import 'pages/library_page.dart';

void main() {
  runApp(const LexAfricaApp());
}

class LexAfricaApp extends StatelessWidget {
  const LexAfricaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'LexAfrica',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
        useMaterial3: true,
        textTheme: GoogleFonts.interTextTheme(),
      ),
      home: const DashboardPage(),
    );
  }
}

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final List<Map<String, String>> _recentCases = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchCases();
  }

  Future<void> _fetchCases() async {
    const String apiUrl = 'https://lexafrica-y5k8.onrender.com/api/cases';
    try {
      final response = await http.get(Uri.parse(apiUrl));
      if (response.statusCode == 200) {
        final List data = json.decode(response.body);
        setState(() {
          _recentCases.clear();
          for (var item in data) {
            _recentCases.add({
              'title': item['title'].toString(),
              'court': item['court']?.toString() ?? 'Supreme Court of Nigeria',
              'topic': item['topic']?.toString() ?? 'Jurisprudence',
            });
          }
        });
      }
    } catch (e) {
      debugPrint('Error fetching cases: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('LexAfrica', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Counsel, welcome back.',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Your legal mastery awaits.',
              style: TextStyle(color: Colors.grey[600], fontSize: 16),
            ),
            const SizedBox(height: 24),
            _buildLexaPrompt(),
            const SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Recent Jurisprudence',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                TextButton(
                  onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (c) => const LibraryPage())),
                  child: const Text('See All'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _isLoading 
              ? const Center(child: CircularProgressIndicator())
              : _buildCaseList(),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        selectedItemColor: const Color(0xFF2563EB),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.book_outlined), label: 'Library'),
          BottomNavigationBarItem(icon: Icon(Icons.school_outlined), label: 'Courses'),
        ],
        onTap: (index) {
          if (index == 1) Navigator.push(context, MaterialPageRoute(builder: (c) => const LibraryPage()));
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (c) => const ChatPage())),
        label: const Text('Ask LEXA'),
        icon: const Icon(Icons.auto_awesome),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _buildLexaPrompt() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF2563EB), Color(0xFF1D4ED8)]),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2563EB).withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.auto_awesome, color: Colors.white, size: 24),
              SizedBox(width: 8),
              Text(
                'Meet LEXA',
                style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Ask me anything about legal principles or specific cases. I am your specialized law tutor.',
            style: TextStyle(color: Colors.white70, fontSize: 14),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (c) => const ChatPage())),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: const Color(0xFF2563EB),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
            child: const Text('Start Chat', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildCaseList() {
    if (_recentCases.isEmpty) {
      return const Center(child: Text("No cases found."));
    }
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _recentCases.length > 5 ? 5 : _recentCases.length,
      itemBuilder: (context, index) {
        final item = _recentCases[index];
        return InkWell(
          onTap: () {},
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey[200]!),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item['title']!,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF2563EB)),
                      ),
                      const SizedBox(height: 4),
                      Text(item['court']!, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right, color: Colors.grey),
              ],
            ),
          ),
        );
      },
    );
  }
}