import { Newspaper, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { NewsItem } from '../types/f1';

interface F1NewsProps {
  news: NewsItem[];
}

export function F1News({ news }: F1NewsProps) {
  const stripHtml = (html: string) => {
    // First, remove specific patterns like "Read Also:"
    let cleanText = html.replace(/Read Also:.*?(?=\s|$)/g, '');
    
    // Then strip remaining HTML
    const tmp = document.createElement('div');
    tmp.innerHTML = cleanText;
    return tmp.textContent || tmp.innerText || '';
  };

  const formatDescription = (description: string) => {
    // Remove any "Read Also:" sections and their content
    let cleanDesc = description.replace(/Read Also:.*?(?=\s|$)/g, '');
    
    // Strip HTML first
    cleanDesc = stripHtml(cleanDesc);
    
    // Get the first two sentences or ~200 characters
    const sentences = cleanDesc.split(/[.!?]\s+/);
    let truncated = sentences[0];
    
    // Remove any "...Keep reading..." or similar text
    truncated = truncated.replace(/\.\.\.+\s*keep\s*reading\.\.\.*/gi, '');
    truncated = truncated.replace(/\.\.\.+\s*read\s*more\.\.\.*/gi, '');
    
    // Clean up any remaining ellipsis
    truncated = truncated.replace(/\.{3,}/g, '');
    
    // Add ellipsis if the text was truncated
    if (truncated.length < cleanDesc.length) {
      truncated = truncated.trim() + '...';
    }
    
    return truncated;
  };

  const getArticleImage = (article: NewsItem): string | null => {
    // Check for enclosure image first
    if (article.enclosure?.link) {
      return article.enclosure.link;
    }

    // Then check for thumbnail
    if (article.thumbnail) {
      return article.thumbnail;
    }

    // Try to extract first image from content
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = article.content?.match(imgRegex);
    if (match && match[1]) {
      return match[1];
    }

    return null;
  };

  if (!news.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="w-6 h-6 text-red-600" />
        <h2 className="text-2xl font-bold font-rationalist">Latest F1 News</h2>
      </div>

      <div className="space-y-8">
        {news.map((article) => {
          const imageUrl = getArticleImage(article);
          const title = stripHtml(article.title);
          
          return (
            <article key={article.link} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
              <div className="flex gap-6">
                {imageUrl && (
                  <div className="w-48 h-48 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', imageUrl);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 leading-tight font-rationalist">
                    {title}
                  </h3>
                  <time className="text-sm text-gray-500 block">
                    {format(new Date(article.pubDate), 'MMMM d, yyyy h:mm a')}
                  </time>
                  <p className="text-gray-600 leading-relaxed">
                    {formatDescription(article.description)}
                  </p>
                  <div className="pt-2">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Read full article
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}