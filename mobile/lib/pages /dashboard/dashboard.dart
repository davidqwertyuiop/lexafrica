

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
    // API_URL should be configured based on deployment
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
            const Text(
              'Recent Jurisprudence',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _isLoading 
              ? const Center(child: CircularProgressIndicator())
              : _buildCaseList(),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openLexaChat(),
        label: const Text('Ask LEXA'),
        icon: const Icon(Icons.chat_bubble_outline),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _buildLexaPrompt() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF2563EB),
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
            'Ask any legal question. I can summarize cases, explain statutes, and help you prep for the Bar.',
            style: TextStyle(color: Colors.white70, fontSize: 14),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () => _openLexaChat(),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: const Color(0xFF2563EB),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
            child: const Text('Chat with LEXA', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildCaseList() {
    if (_recentCases.isEmpty) {
      return const Center(child: Text("No cases found. Check connection."));
    }
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _recentCases.length > 5 ? 5 : _recentCases.length,
      itemBuilder: (context, index) {
        final item = _recentCases[index];
        return Container(
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
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.blue[50],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        item['topic']!,
                        style: TextStyle(color: Colors.blue[800], fontSize: 10, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: Colors.grey),
            ],
          ),
        );
      },
    );
  }

  void _openLexaChat() {
    // Navigate to Chat Page
  }
}
