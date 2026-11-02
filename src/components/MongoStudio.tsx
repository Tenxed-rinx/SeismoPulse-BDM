import React, { useState } from 'react';
import { Earthquake } from '../types/seismic';
import {
  Database,
  Copy,
  Check,
  FileCode,
  Layers,
  Table,
  HardDrive
} from 'lucide-react';

interface MongoStudioProps {
  earthquakes: Earthquake[];
}

export const MongoStudio: React.FC<MongoStudioProps> = ({ earthquakes }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'schema' | 'stored_doc' | 'fields'>('schema');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Exact Database Schema Definition
  const DATABASE_SCHEMA = {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "type", "geometry", "properties"],
      properties: {
        _id: {
          bsonType: "string",
          description: "Unique event identifier (e.g., 'in-2001-bhuj' or 'us7000m0gh')"
        },
        type: {
          enum: ["Feature"],
          description: "Standard GeoJSON type"
        },
        geometry: {
          bsonType: "object",
          required: ["type", "coordinates"],
          properties: {
            type: { enum: ["Point"] },
            coordinates: {
              bsonType: "array",
              minItems: 2,
              maxItems: 3,
              items: { bsonType: "double" },
              description: "[longitude, latitude, focalDepthKm] in WGS 84"
            }
          }
        },
        properties: {
          bsonType: "object",
          required: ["place", "magnitude", "time", "focalDepthKm"],
          properties: {
            title: { bsonType: "string" },
            place: { bsonType: "string" },
            magnitude: { bsonType: "double", minimum: 0.0, maximum: 10.0 },
            magType: { bsonType: "string" },
            time: { bsonType: "date", description: "UTC timestamp of event" },
            focalDepthKm: { bsonType: "double" },
            depthCategory: { enum: ["shallow", "intermediate", "deep"] },
            energyJoules: { bsonType: "double" },
            tntEquivalentTons: { bsonType: "double" },
            tsunami: { bsonType: "int", description: "1 if tsunami alert, 0 otherwise" },
            net: { bsonType: "string", description: "Network agency (e.g. 'in_ncs', 'us')" },
            mmi: { bsonType: ["double", "null"] },
            felt: { bsonType: ["int", "null"] }
          }
        }
      }
    }
  };

  // Sample document representing exact stored structure
  const sampleStoredDocument = earthquakes[0] ? {
    _id: earthquakes[0].id,
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        earthquakes[0].longitude,
        earthquakes[0].latitude,
        earthquakes[0].depth
      ]
    },
    properties: {
      title: earthquakes[0].title,
      place: earthquakes[0].place,
      magnitude: earthquakes[0].magnitude,
      magType: earthquakes[0].magType,
      time: { $date: new Date(earthquakes[0].time).toISOString() },
      focalDepthKm: earthquakes[0].depth,
      depthCategory: earthquakes[0].depthCategory,
      energyJoules: earthquakes[0].energyJoules,
      tntEquivalentTons: earthquakes[0].tntEquivalentTons,
      tsunami: earthquakes[0].tsunami,
      net: earthquakes[0].net,
      mmi: earthquakes[0].mmi,
      felt: earthquakes[0].felt
    }
  } : null;

  const SCHEMA_FIELDS = [
    { field: "_id", type: "String", storedAs: "ID", desc: "Unique quake ID" },
    { field: "type", type: "String", storedAs: "Type", desc: "Always 'Feature'" },
    { field: "geometry.type", type: "String", storedAs: "Point", desc: "Always 'Point'" },
    { field: "geometry.coordinates", type: "Array", storedAs: "[Lon, Lat, Depth]", desc: "Coordinates and depth (km)" },
    { field: "properties.place", type: "String", storedAs: "Text", desc: "City or location name" },
    { field: "properties.magnitude", type: "Number", storedAs: "0 - 10", desc: "Earthquake magnitude" },
    { field: "properties.time", type: "Date", storedAs: "UTC Time", desc: "Event date & time" },
    { field: "properties.focalDepthKm", type: "Number", storedAs: "km", desc: "Depth underground" },
    { field: "properties.depthCategory", type: "Text", storedAs: "Category", desc: "shallow, intermediate, or deep" },
    { field: "properties.energyJoules", type: "Number", storedAs: "Joules", desc: "Energy released" },
    { field: "properties.tsunami", type: "Number", storedAs: "0 or 1", desc: "1 = tsunami alert, 0 = no" },
    { field: "properties.net", type: "String", storedAs: "Agency", desc: "Data source (e.g. in_ncs, us)" }
  ];

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 p-4 md:p-6 text-slate-800 space-y-5 max-w-[1400px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Database Schema &amp; Storage</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Database Schema &amp; Storage
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            How earthquake data is stored and organized in MongoDB.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('schema')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'schema'
                ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>JSON Schema</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('stored_doc')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'stored_doc'
                ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sample Document</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('fields')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'fields'
                ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fields List</span>
          </button>
        </div>
      </div>

      {/* 4 Simple Key Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">1. Storage Format</div>
          <div className="text-sm font-bold text-slate-900 mt-1">JSON / GeoJSON</div>
          <div className="text-[11px] text-slate-500 mt-0.5">1 document per quake</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">2. Database &amp; Collection</div>
          <div className="text-sm font-bold text-slate-900 mt-1">seismo_pulse_db</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Collection: earthquakes</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">3. Coordinates</div>
          <div className="text-sm font-bold text-slate-900 mt-1">[Lon, Lat, Depth]</div>
          <div className="text-[11px] text-emerald-700 font-mono font-medium">geometry.coordinates</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">4. Fast Search</div>
          <div className="text-sm font-bold text-slate-900 mt-1">2dsphere Index</div>
          <div className="text-[11px] text-sky-700 font-mono font-medium">Radius search near city</div>
        </div>
      </div>

      {/* 2. THE SCHEMA / STORED DOC / FIELDS */}
      {activeView === 'schema' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-800">
              Collection Validator Schema ($jsonSchema)
            </span>
            <button
              type="button"
              onClick={() => handleCopy(JSON.stringify(DATABASE_SCHEMA, null, 2), 'schema')}
              className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1 transition-colors"
            >
              {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'schema' ? 'Copied' : 'Copy Schema'}</span>
            </button>
          </div>
          <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[580px] leading-relaxed">
            <pre>{JSON.stringify(DATABASE_SCHEMA, null, 2)}</pre>
          </div>
        </div>
      )}

      {activeView === 'stored_doc' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-800">
              Actual Stored Document Example
            </span>
            <button
              type="button"
              onClick={() => handleCopy(JSON.stringify(sampleStoredDocument, null, 2), 'doc')}
              className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1 transition-colors"
            >
              {copiedKey === 'doc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'doc' ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <div className="p-4 bg-slate-950 text-sky-300 font-mono text-xs overflow-x-auto max-h-[580px] leading-relaxed">
            <pre>{JSON.stringify(sampleStoredDocument, null, 2)}</pre>
          </div>
        </div>
      )}

      {activeView === 'fields' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3 bg-slate-100/90 border-b border-slate-200">
            <span className="text-xs font-bold font-mono text-slate-800">
              Schema Field Specifications
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-3">Field</th>
                  <th className="p-3">Data Type</th>
                  <th className="p-3">How it is Stored</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SCHEMA_FIELDS.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                    <td className="p-3 font-mono font-bold text-slate-900">{row.field}</td>
                    <td className="p-3 font-mono text-emerald-700">{row.type}</td>
                    <td className="p-3 font-mono text-slate-600 text-[11px]">{row.storedAs}</td>
                    <td className="p-3 text-slate-600">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
