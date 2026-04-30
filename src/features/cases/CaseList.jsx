import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { caseService } from "@/services/caseService";
import { MapPin, Clock, Search, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // all, high-priority, active, resolved

  useEffect(() => {
    loadCases();
    loadStats();
  }, []);

  const loadCases = async () => {
    try {
      const response = await caseService.getAllCases({
        status: "active",
        limit: 20,
      });
      setCases(response.data);
    } catch (error) {
      console.error("Failed to load cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await caseService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCases();
      return;
    }

    setLoading(true);
    try {
      const response = await caseService.searchCases(searchQuery);
      setCases(response.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // Filter logic would be applied here in real implementation
  };

  const getPriorityColor = (level) => {
    switch (level) {
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.data.total}</div>
              <p className="text-sm text-gray-500">Total Cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {stats.data.byStatus.find((s) => s._id === "active")
                  ?.highPriority || 0}
              </div>
              <p className="text-sm text-gray-500">High Priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {stats.data.today}
              </div>
              <p className="text-sm text-gray-500">Today's Reports</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Bar and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400 dark:text-orange-500 pointer-events-none" />
            <Input
              placeholder="Search by name, location, or case ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 border-orange-200 dark:border-orange-700 focus:border-orange-400 dark:focus:border-orange-500 focus:ring-orange-300 dark:focus:ring-orange-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl h-11"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-bold rounded-xl h-11 px-6 shadow-md hover:shadow-lg transition-all duration-150 text-base"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 ${
              activeFilter === "all"
                ? "bg-orange-500 dark:bg-orange-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700"
            }`}
          >
            All Cases
          </button>
          
          <button
            onClick={() => handleFilterChange("high-priority")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 flex items-center gap-2 ${
              activeFilter === "high-priority"
                ? "bg-red-500 dark:bg-red-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border-2 border-red-300 dark:border-red-700 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            High Priority
          </button>
          
          <button
            onClick={() => handleFilterChange("active")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 flex items-center gap-2 ${
              activeFilter === "active"
                ? "bg-orange-500 dark:bg-orange-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 border-2 border-orange-300 dark:border-orange-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700"
            }`}
          >
            <Clock className="w-4 h-4" />
            Active
          </button>
          
          <button
            onClick={() => handleFilterChange("resolved")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 flex items-center gap-2 ${
              activeFilter === "resolved"
                ? "bg-green-500 dark:bg-green-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border-2 border-green-300 dark:border-green-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-gray-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Resolved
          </button>
        </div>
      </div>

      {/* Cases List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Cases ({cases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading cases...
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No cases found</div>
          ) : (
            <div className="space-y-4">
              {cases.map((caseItem) => (
                <Link
                  key={caseItem.caseId}
                  to={`/case/${caseItem.caseId}`}
                  className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {caseItem.person.name || "Unknown Person"}
                        {caseItem.person.age && (
                          <span className="text-gray-500 ml-2">
                            Age: {caseItem.person.age}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Case ID: {caseItem.caseId}
                      </p>
                      {caseItem.sourceType && (
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getSourceIcon(caseItem.sourceType)}
                            {getSourceLabel(caseItem.sourceType)}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Badge
                      className={getPriorityColor(caseItem.priority.level)}
                    >
                      {caseItem.priority.level}
                    </Badge>
                  </div>

                  {caseItem.aiData?.summary && (
                    <p className="text-sm text-gray-700 mb-2">
                      {caseItem.aiData.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {caseItem.lastSeen?.address || "Unknown location"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(caseItem.createdAt))} ago
                    </span>
                    {caseItem.sightings?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {caseItem.sightings.length} sightings
                      </span>
                    )}
                  </div>

                  {caseItem.person.clothing?.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {caseItem.person.clothing.slice(0, 3).map((item, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getPriorityColor(priority) {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-500";
    case "HIGH":
      return "bg-orange-500";
    case "MEDIUM":
      return "bg-yellow-500";
    case "LOW":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

function getSourceIcon(sourceType) {
  switch (sourceType) {
    case "social_media_auto":
      return "🤖";
    case "telegram":
      return "📱";
    case "whatsapp":
      return "💬";
    case "sms":
      return "📞";
    case "web":
      return "🌐";
    default:
      return "📝";
  }
}

function getSourceLabel(sourceType) {
  switch (sourceType) {
    case "social_media_auto":
      return "Auto-detected";
    case "telegram":
      return "Telegram";
    case "whatsapp":
      return "WhatsApp";
    case "sms":
      return "SMS";
    case "web":
      return "Web Report";
    default:
      return "Manual";
  }
}
