"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SalesChartPropes {
    grapData: any
}

const SalesChart: React.FC<SalesChartPropes> = ({ grapData }) => {
    return (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex gap-3 items-center">
              Sales Chart <IndianRupee className="w-5 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                className="w-full h-full"
                data={grapData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
}

export const dynamic = "force-dynamic"
export default SalesChart