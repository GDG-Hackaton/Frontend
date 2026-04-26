import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  MessageCircle, 
  Facebook, 
  Twitter, 
  RefreshCw, 
  Play,
  Settings,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';

export default function ScraperConfig() {
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [status, setStatus] = useState(null);
  const [sources, setSources] = useState({
    telegram: [],
    facebook: [],
    twitter: []
  });
  
  const [newSource, setNewSource] = useState({ type: 'telegram', value: '' });
  
  useEffect(() => {
    loadStatus();
  }, []);
  
  const loadStatus = async () => {
    try {
      const response = await api.get('/scrape/status');
      setStatus(response.data);
      setSources(response.data.sources || sources);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };
  
  const triggerScrape = async () => {
    setScraping(true);
    try {
      const response = await api.post('/scrape/all');
      const created = response.data?.data?.casesCreated ?? 0;
      toast.success(`Created ${created} new cases`);
      loadStatus();
    } catch (error) {
      toast.error('Scrape failed');
    } finally {
      setScraping(false);
    }
  };
  
  const addSource = () => {
    if (!newSource.value) return;
    
    setSources(prev => ({
      ...prev,
      [newSource.type]: [...prev[newSource.type], newSource.value]
    }));
    
    setNewSource({ ...newSource, value: '' });
    toast.success(`Added ${newSource.type} source`);
  };
  
  const removeSource = (type, value) => {
    setSources(prev => ({
      ...prev,
      [type]: prev[type].filter(s => s !== value)
    }));
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Social Media Scraper</h1>
        <Button onClick={triggerScrape} disabled={scraping}>
          {scraping ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Run Scrape Now
        </Button>
      </div>
      
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Scraper Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Posts Scraped</p>
              <p className="text-2xl font-bold">{status?.scrapedCount || 0}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-medium">
                {status?.isRunning ? 'Running' : 'Idle'}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Next Run</p>
              <p className="text-lg font-medium">~15 min</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Sources Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Monitored Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Telegram Sources */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <h3 className="font-medium">Telegram Channels</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {sources.telegram.map(channel => (
                <Badge key={channel} variant="secondary" className="gap-1">
                  @{channel}
                  <button
                    onClick={() => removeSource('telegram', channel)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Twitter Sources */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Twitter className="w-4 h-4 text-sky-500" />
              <h3 className="font-medium">Twitter/X Queries</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {sources.twitter.map(query => (
                <Badge key={query} variant="secondary" className="gap-1">
                  {query}
                  <button
                    onClick={() => removeSource('twitter', query)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Add New Source */}
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-3">Add New Source</h3>
            <div className="flex gap-2">
              <select
                value={newSource.type}
                onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
                className="px-3 py-2 border rounded-md"
              >
                <option value="telegram">Telegram Channel</option>
                <option value="twitter">Twitter Query</option>
              </select>
              <Input
                placeholder={newSource.type === 'telegram' ? 'channel_username' : 'search query'}
                value={newSource.value}
                onChange={(e) => setNewSource({ ...newSource, value: e.target.value })}
                className="flex-1"
              />
              <Button onClick={addSource}>Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Info */}
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Scrapes public Telegram channels every 15 minutes</li>
              <li>AI analyzes each post for missing person reports</li>
              <li>Only creates cases when confidence &gt; 60%</li>
              <li>Auto-broadcasts to Our Main Telegram channel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
