import React, { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dryrun } from "@permaweb/aoconnect";

interface AnalyticsData {
  pageCounts: { [key: string]: number };
  monthlyCounts: { [key: string]: number };
  allTimeCount: number;
}

export function AnalyticsDashboardComponent() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await dryrun({
          process: "KgeRB6uIOmh-zFj2JUIpPvaVcY_CKBvwzpAMPWyi2pI",
          data: "Analytics.GetAllCounts",
          tags: [
            { name: "Action", value: "Analytics.GetAllCounts" }
          ]
        });
        const parsedData: AnalyticsData = JSON.parse(result.Messages[0].Data);
        setAnalyticsData(parsedData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalytics();
  }, []);

  const totalVisitors = analyticsData?.allTimeCount || 0;
  const uniqueVisitors = Math.floor(totalVisitors * 0.7); // Placeholder: assuming 70% of total visitors are unique
  const pageViews = analyticsData ? Object.values(analyticsData.pageCounts).reduce((a, b) => a + b, 0) : 0;

  const monthlyData = analyticsData ? Object.entries(analyticsData.monthlyCounts)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => {
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return months.indexOf(a.name) - months.indexOf(b.name);
    }) : [];

  return (
    <div className="flex justify-center items-start min-h-screen bg-background p-36">
      <div className="w-full max-w-7xl space-y-5">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueVisitors.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pageViews.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Visit Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <Card className="col-span-1 lg:col-span-4 bg-background">
            <CardHeader>
              <CardTitle>Visitor Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-1 lg:col-span-3 bg-background">
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {analyticsData && Object.entries(analyticsData.pageCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([page, visits], index) => (
                    <div className="flex items-center" key={index}>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-muted-foreground">{page}</p>
                        <p className="text-sm text-muted-foreground">{visits.toLocaleString()} visits</p>
                      </div>
                      <div className="ml-auto font-medium">{index + 1}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}