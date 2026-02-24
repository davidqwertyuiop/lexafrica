import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LibraryPage extends StatefulWidget {
  const LibraryPage({super.key});

  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage> {
  List<dynamic> _allCases = [];
  List<dynamic> _filteredCases = [];
  bool _isLoading = true;
  String _searchQuery = "";

  @override
  void initState() {
    super.initState();
    _fetchLibrary();
  }

  Future<void> _fetchLibrary() async {
    const String apiUrl = 'https://lexafrica-y5k8.onrender.com/api/cases';
    try {
      final response = await http.get(Uri.parse(apiUrl));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _allCases = data;
          _filteredCases = data;
        });
      }
    } catch (e) {
      debugPrint('Library fetch error: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _onSearch(String query) {
    setState(() {
      _searchQuery = query;
      if (query.isEmpty) {
        _filteredCases = _allCases;
      } else {
        _filteredCases = _allCases.where((c) {
          final title = c['title']?.toString().toLowerCase() ?? '';
          final topic = c['topic']?.toString().toLowerCase() ?? '';
          return title.contains(query.toLowerCase()) || topic.contains(query.toLowerCase());
        }).toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Case Library', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              onChanged: _onSearch,
              decoration: InputDecoration(
                hintText: 'Search statutes, topics, or citations...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.grey[100],
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _fetchLibrary,
                    child: _filteredCases.isEmpty
                        ? const Center(child: Text("No precedents found for your search."))
                        : ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: _filteredCases.length,
                            itemBuilder: (context, index) {
                              final item = _filteredCases[index];
                              return _buildLibraryItem(item);
                            },
                          ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildLibraryItem(dynamic item) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 0,
      color: Colors.white,
      side: BorderSide(color: Colors.grey[200]!),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        title: Text(
          item['title'] ?? 'Unknown Case',
          style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF2563EB)),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(item['court'] ?? 'Supreme Court of Nigeria', style: TextStyle(color: Colors.grey[600], fontSize: 13)),
            const SizedBox(height: 8),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: Colors.blue[50], borderRadius: BorderRadius.circular(8)),
                  child: Text(item['topic'] ?? 'General', style: TextStyle(color: Colors.blue[800], fontSize: 11, fontWeight: FontWeight.bold)),
                ),
                const Spacer(),
                const Text('View Analysis', style: TextStyle(color: Colors.grey, fontSize: 12)),
                const Icon(Icons.arrow_right, size: 16, color: Colors.grey),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
