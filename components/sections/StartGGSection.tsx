import { ExternalLink } from 'lucide-react';

export default function StartGGSection() {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8">
          <div className="text-center">
            <ExternalLink className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start.gg Integration</h3>
            <p className="text-gray-600 mb-4">Accédez directement à la plateforme Start.gg</p>
            <a
              href="https://start.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-colors bg-red-600 hover:bg-red-700"
            >
              <ExternalLink className="w-5 h-5" />
              Visiter Start.gg
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 