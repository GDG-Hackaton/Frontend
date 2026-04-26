import React from "react";
import { motion } from "framer-motion";
import MapView from "@/features/map/MapView";

export default function Map() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-slate-900">Search Map</h1>
          <p className="text-sm text-slate-500 mt-2">
            Explore case locations and report sightings directly from the map.
          </p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <MapView />
        </div>
      </div>
    </div>
  );
}
