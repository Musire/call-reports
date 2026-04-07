'use client';

import { Button } from "@/components/ui/buttons";
import { useJwt } from "@/hooks";
import * as Papa from "papaparse";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { jwt, setToken } = useJwt();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchToState = async () => {
    if (!jwt) return;
    
    setLoading(true);
    try {
      
      const response = await fetch("/api/report?startTime=1772344800&endTime=1774479936", {
        headers: {
          Authorization: `JWT ${jwt}`,
        },
      });

      if (!response.ok) {
        console.log(response);
        return
      }

      const csvText = await response.text();

      // Papa.parse is synchronous when passing a string
      const result = Papa.parse(csvText, {
        header: true,         // Converts rows into objects using the first row as keys
        skipEmptyLines: true, // Prevents empty objects from trailing newlines
        dynamicTyping: true,  // Automatically converts numbers and booleans
      });

      setData(result.data);
    } catch (error) {
      console.error("Parsing error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Fetch on Mount
  useEffect(() => {
    fetchToState();
  }, []); 

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        {/* 2. Manual Refresh Button */}
        <Button onClick={fetchToState} disabled={loading} variant="secondary">
          {loading ? "Loading..." : "Refresh Data"}
        </Button>
        
        <Button onClick={() => setToken(null)} variant="ghost">
          Delete JWT
        </Button>
      </div>

      <div className="border border-border surface-1 rounded-xl p-4">
        <h2 className="text-lg font-bold mb-2">Report Data ({data.length} rows)</h2>
        
        {data.length > 0 ? (
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(data.slice(0, 5), null, 2)}
            {data.length > 5 && "\n... more rows hidden"}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground"> No data loaded yet.</p>
        )}
      </div>
    </div>
  );
}
