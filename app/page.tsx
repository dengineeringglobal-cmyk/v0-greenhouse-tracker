"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  FileSpreadsheet,
  Printer,
  Leaf,
  TrendingUp,
  Package,
  DollarSign,
  Trash2,
  ClipboardList,
} from "lucide-react";
import * as XLSX from "xlsx";

type HarvestRecord = {
  id: string;
  date: string;
  greenhouse: string;
  harvestKg: string;
  buyer: string;
  price: string;
  revenue: number;
};

const INITIAL_RECORDS: HarvestRecord[] = [
  { id: "1", date: "2024-01-05", greenhouse: "GH-01", harvestKg: "320", buyer: "AgriMarket Ltd", price: "850", revenue: 272000 },
  { id: "2", date: "2024-01-12", greenhouse: "GH-02", harvestKg: "410", buyer: "Pepper World", price: "900", revenue: 369000 },
  { id: "3", date: "2024-01-19", greenhouse: "GH-01", harvestKg: "280", buyer: "FreshProduce Co.", price: "870", revenue: 243600 },
  { id: "4", date: "2024-02-02", greenhouse: "GH-03", harvestKg: "510", buyer: "AgriMarket Ltd", price: "880", revenue: 448800 },
  { id: "5", date: "2024-02-16", greenhouse: "GH-02", harvestKg: "390", buyer: "SpiceGate Nigeria", price: "910", revenue: 354900 },
  { id: "6", date: "2024-03-01", greenhouse: "GH-01", harvestKg: "460", buyer: "Pepper World", price: "920", revenue: 423200 },
  { id: "7", date: "2024-03-14", greenhouse: "GH-03", harvestKg: "375", buyer: "FreshProduce Co.", price: "895", revenue: 335625 },
];

export default function GreenhouseTracker() {
  const [records, setRecords] = useState<HarvestRecord[]>(INITIAL_RECORDS);
  const [form, setForm] = useState({
    date: "",
    greenhouse: "",
    harvestKg: "",
    buyer: "",
    price: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const printRef = useRef<HTMLDivElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.date) newErrors.date = "Date is required";
    if (!form.greenhouse) newErrors.greenhouse = "Greenhouse number is required";
    if (!form.harvestKg || isNaN(Number(form.harvestKg)) || Number(form.harvestKg) <= 0)
      newErrors.harvestKg = "Enter a valid harvest weight";
    if (!form.buyer) newErrors.buyer = "Buyer name is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = "Enter a valid price";
    return newErrors;
  };

  const addRecord = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const revenue = Number(form.harvestKg) * Number(form.price);
    const newRecord: HarvestRecord = {
      ...form,
      id: Date.now().toString(),
      revenue,
    };
    setRecords([newRecord, ...records]);
    setForm({ date: "", greenhouse: "", harvestKg: "", buyer: "", price: "" });
    setErrors({});
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const totalHarvest = records.reduce((sum, r) => sum + Number(r.harvestKg), 0);
  const totalRevenue = records.reduce((sum, r) => sum + r.revenue, 0);
  const avgPrice =
    records.length > 0
      ? records.reduce((sum, r) => sum + Number(r.price), 0) / records.length
      : 0;

  const exportToExcel = () => {
    const worksheetData = [
      ["Date", "Greenhouse", "Harvest (kg)", "Buyer", "Price per kg (₦)", "Revenue (₦)"],
      ...records.map((r) => [
        r.date,
        r.greenhouse,
        Number(r.harvestKg),
        r.buyer,
        Number(r.price),
        r.revenue,
      ]),
      [],
      ["", "", "", "", "Total Harvest (kg):", totalHarvest],
      ["", "", "", "", "Total Revenue (₦):", totalRevenue],
      ["", "", "", "", "Avg Price/kg (₦):", Math.round(avgPrice)],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Column widths
    worksheet["!cols"] = [
      { wch: 14 },
      { wch: 16 },
      { wch: 14 },
      { wch: 22 },
      { wch: 18 },
      { wch: 16 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Harvest Records");

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `pepper-harvest-records-${today}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const summaryCards = [
    {
      label: "Total Harvest",
      value: `${totalHarvest.toLocaleString()} kg`,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Avg Price / kg",
      value: `₦${Math.round(avgPrice).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Records",
      value: records.length.toString(),
      icon: ClipboardList,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-section, #print-section * { visibility: visible; }
          #print-section { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-background font-sans">
        {/* Header */}
        <header className="bg-primary text-primary-foreground py-5 px-6 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <div className="bg-primary-foreground/20 p-2 rounded-xl">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight text-balance">
                Pepper Plantation Greenhouse Tracker
              </h1>
              <p className="text-primary-foreground/75 text-sm">
                Harvest management and sales records
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6 grid gap-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map((s) => (
              <Card key={s.label} className="border-border shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`${s.bg} p-2.5 rounded-xl`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-base font-bold text-foreground leading-tight">
                      {s.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="add" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 no-print">
              <TabsList className="bg-muted border border-border">
                <TabsTrigger value="add" className="gap-1.5">
                  <PlusCircle className="w-4 h-4" />
                  Add Record
                </TabsTrigger>
                <TabsTrigger value="records" className="gap-1.5">
                  <ClipboardList className="w-4 h-4" />
                  Past Records
                  {records.length > 0 && (
                    <Badge className="ml-1 bg-primary text-primary-foreground text-xs px-1.5">
                      {records.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToExcel}
                  className="gap-2 border-border text-foreground hover:bg-secondary"
                >
                  <FileSpreadsheet className="w-4 h-4 text-primary" />
                  Export Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-2 border-border text-foreground hover:bg-secondary"
                >
                  <Printer className="w-4 h-4 text-primary" />
                  Print
                </Button>
              </div>
            </div>

            {/* Add Record Tab */}
            <TabsContent value="add">
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-foreground">
                    New Harvest Record
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <label className="text-sm font-medium text-foreground">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm({ ...form, date: e.target.value })
                        }
                        className={errors.date ? "border-destructive" : ""}
                      />
                      {errors.date && (
                        <p className="text-xs text-destructive">{errors.date}</p>
                      )}
                    </div>

                    <div className="grid gap-1.5">
                      <label className="text-sm font-medium text-foreground">
                        Greenhouse Number
                      </label>
                      <Input
                        placeholder="e.g. GH-01"
                        value={form.greenhouse}
                        onChange={(e) =>
                          setForm({ ...form, greenhouse: e.target.value })
                        }
                        className={errors.greenhouse ? "border-destructive" : ""}
                      />
                      {errors.greenhouse && (
                        <p className="text-xs text-destructive">
                          {errors.greenhouse}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-1.5">
                      <label className="text-sm font-medium text-foreground">
                        Harvest Weight (kg)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g. 350"
                        value={form.harvestKg}
                        onChange={(e) =>
                          setForm({ ...form, harvestKg: e.target.value })
                        }
                        className={errors.harvestKg ? "border-destructive" : ""}
                      />
                      {errors.harvestKg && (
                        <p className="text-xs text-destructive">
                          {errors.harvestKg}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-1.5">
                      <label className="text-sm font-medium text-foreground">
                        Buyer Name
                      </label>
                      <Input
                        placeholder="e.g. AgriMarket Ltd"
                        value={form.buyer}
                        onChange={(e) =>
                          setForm({ ...form, buyer: e.target.value })
                        }
                        className={errors.buyer ? "border-destructive" : ""}
                      />
                      {errors.buyer && (
                        <p className="text-xs text-destructive">{errors.buyer}</p>
                      )}
                    </div>

                    <div className="grid gap-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-foreground">
                        Price per kg (₦)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g. 900"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                        className={errors.price ? "border-destructive" : ""}
                      />
                      {errors.price && (
                        <p className="text-xs text-destructive">{errors.price}</p>
                      )}
                    </div>
                  </div>

                  {form.harvestKg && form.price && (
                    <div className="mt-4 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Estimated Revenue
                      </span>
                      <span className="text-lg font-bold text-primary">
                        ₦
                        {(
                          Number(form.harvestKg) * Number(form.price)
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <Button
                    onClick={addRecord}
                    className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Harvest Record
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Past Records Tab */}
            <TabsContent value="records">
              <div id="print-section">
                {/* Print header */}
                <div className="hidden print:block mb-6">
                  <h2 className="text-2xl font-bold">
                    Pepper Plantation — Harvest Records
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Printed on {new Date().toLocaleDateString("en-NG")}
                  </p>
                  <div className="flex gap-8 mt-3 text-sm">
                    <span>Total Harvest: {totalHarvest.toLocaleString()} kg</span>
                    <span>Total Revenue: ₦{totalRevenue.toLocaleString()}</span>
                    <span>
                      Avg Price/kg: ₦{Math.round(avgPrice).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center justify-between">
                      <span>All Harvest Records</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {records.length} record{records.length !== 1 ? "s" : ""}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {records.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                        <Package className="w-10 h-10 opacity-40" />
                        <p className="text-sm">
                          No records yet. Add your first harvest record.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted border-b border-border">
                              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                Date
                              </th>
                              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                Greenhouse
                              </th>
                              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                                Harvest (kg)
                              </th>
                              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                Buyer
                              </th>
                              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                                Price/kg
                              </th>
                              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                                Revenue
                              </th>
                              <th className="py-3 px-4 no-print" />
                            </tr>
                          </thead>
                          <tbody>
                            {records.map((r, i) => (
                              <tr
                                key={r.id}
                                className={`border-b border-border transition-colors hover:bg-muted/50 ${
                                  i % 2 === 0 ? "bg-card" : "bg-background"
                                }`}
                              >
                                <td className="py-3 px-4 text-foreground">
                                  {formatDate(r.date)}
                                </td>
                                <td className="py-3 px-4">
                                  <Badge
                                    variant="outline"
                                    className="border-primary/30 text-primary bg-primary/5 font-mono text-xs"
                                  >
                                    {r.greenhouse}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-right font-medium text-foreground">
                                  {Number(r.harvestKg).toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-foreground">
                                  {r.buyer}
                                </td>
                                <td className="py-3 px-4 text-right text-muted-foreground">
                                  ₦{Number(r.price).toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-right font-semibold text-primary">
                                  ₦{r.revenue.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 no-print">
                                  <button
                                    onClick={() => deleteRecord(r.id)}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                    aria-label="Delete record"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-primary/10 border-t-2 border-primary/20">
                              <td
                                colSpan={2}
                                className="py-3 px-4 font-bold text-foreground"
                              >
                                Total
                              </td>
                              <td className="py-3 px-4 text-right font-bold text-foreground">
                                {totalHarvest.toLocaleString()} kg
                              </td>
                              <td colSpan={2} />
                              <td className="py-3 px-4 text-right font-bold text-primary">
                                ₦{totalRevenue.toLocaleString()}
                              </td>
                              <td className="no-print" />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
