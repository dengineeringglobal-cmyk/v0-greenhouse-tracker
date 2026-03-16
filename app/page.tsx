"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GreenhouseTracker() {
  const [records, setRecords] = useState<
    {
      date: string;
      greenhouse: string;
      harvestKg: string;
      buyer: string;
      price: string;
      revenue: number;
    }[]
  >([]);
  const [form, setForm] = useState({
    date: "",
    greenhouse: "",
    harvestKg: "",
    buyer: "",
    price: "",
  });

  const addRecord = () => {
    const revenue = Number(form.harvestKg) * Number(form.price);
    const newRecord = { ...form, revenue };
    setRecords([...records, newRecord]);
    setForm({ date: "", greenhouse: "", harvestKg: "", buyer: "", price: "" });
  };

  const totalHarvest = records.reduce((sum, r) => sum + Number(r.harvestKg), 0);
  const totalRevenue = records.reduce((sum, r) => sum + r.revenue, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">
            Pepper Plantation Greenhouse Tracker
          </h1>
          <p className="text-green-600 mt-2">
            Track your pepper harvests and sales
          </p>
        </header>

        <div className="grid gap-6">
          <Card className="rounded-2xl shadow-lg border-green-200">
            <CardContent className="p-6 grid gap-4">
              <h2 className="text-xl font-bold text-green-800">
                Add Harvest Record
              </h2>

              <Input
                type="date"
                placeholder="Date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border-green-300 focus:border-green-500 focus:ring-green-500"
              />

              <Input
                placeholder="Greenhouse Number"
                value={form.greenhouse}
                onChange={(e) =>
                  setForm({ ...form, greenhouse: e.target.value })
                }
                className="border-green-300 focus:border-green-500 focus:ring-green-500"
              />

              <Input
                type="number"
                placeholder="Harvest (kg)"
                value={form.harvestKg}
                onChange={(e) =>
                  setForm({ ...form, harvestKg: e.target.value })
                }
                className="border-green-300 focus:border-green-500 focus:ring-green-500"
              />

              <Input
                placeholder="Buyer"
                value={form.buyer}
                onChange={(e) => setForm({ ...form, buyer: e.target.value })}
                className="border-green-300 focus:border-green-500 focus:ring-green-500"
              />

              <Input
                type="number"
                placeholder="Price per kg"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border-green-300 focus:border-green-500 focus:ring-green-500"
              />

              <Button
                onClick={addRecord}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Record
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-green-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                Performance Summary
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-green-600">Total Harvest</p>
                  <p className="text-2xl font-bold text-green-800">
                    {totalHarvest.toLocaleString()} kg
                  </p>
                </div>
                <div className="bg-green-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-green-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-800">
                    ₦{totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-green-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                Harvest Records
              </h2>

              {records.length === 0 ? (
                <p className="text-center text-green-600 py-8">
                  No harvest records yet. Add your first record above!
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-green-200 text-green-700">
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Greenhouse</th>
                        <th className="text-right py-3 px-2">Harvest (kg)</th>
                        <th className="text-left py-3 px-2">Buyer</th>
                        <th className="text-right py-3 px-2">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((r, i) => (
                        <tr
                          key={i}
                          className="border-b border-green-100 hover:bg-green-50"
                        >
                          <td className="py-3 px-2">{r.date}</td>
                          <td className="py-3 px-2">{r.greenhouse}</td>
                          <td className="text-right py-3 px-2">
                            {Number(r.harvestKg).toLocaleString()}
                          </td>
                          <td className="py-3 px-2">{r.buyer}</td>
                          <td className="text-right py-3 px-2 font-medium text-green-700">
                            ₦{r.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
