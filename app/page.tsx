"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Leaf, Trash2, Download } from "lucide-react";
import * as XLSX from "xlsx";

type GreenhouseRecord = {
  id: string;
  greenhouseNumber: string;
  seedVariety: string;
  plantingDate: string;
  plantCount: string;
  fertilizerSchedule: string;
  irrigationSchedule: string;
  pestObservation: string;
};

type HarvestRecord = {
  id: string;
  date: string;
  greenhouse: string;
  quantity: string;
  grade: string;
  destination: string;
};

export default function BellPepperFarmTracker() {
  const [greenhouses, setGreenhouses] = useState<GreenhouseRecord[]>([]);
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>([]);

  const [greenhouseForm, setGreenhouseForm] = useState({
    greenhouseNumber: "",
    seedVariety: "",
    plantingDate: "",
    plantCount: "",
    fertilizerSchedule: "",
    irrigationSchedule: "",
    pestObservation: "",
  });

  const [harvestForm, setHarvestForm] = useState({
    date: "",
    greenhouse: "",
    quantity: "",
    grade: "",
    destination: "",
  });

  const [greenhouseErrors, setGreenhouseErrors] = useState<Record<string, string>>({});
  const [harvestErrors, setHarvestErrors] = useState<Record<string, string>>({});

  const validateGreenhouse = () => {
    const errors: Record<string, string> = {};
    if (!greenhouseForm.greenhouseNumber) errors.greenhouseNumber = "Required";
    if (!greenhouseForm.seedVariety) errors.seedVariety = "Required";
    if (!greenhouseForm.plantingDate) errors.plantingDate = "Required";
    if (!greenhouseForm.plantCount) errors.plantCount = "Required";
    if (!greenhouseForm.fertilizerSchedule) errors.fertilizerSchedule = "Required";
    if (!greenhouseForm.irrigationSchedule) errors.irrigationSchedule = "Required";
    return errors;
  };

  const validateHarvest = () => {
    const errors: Record<string, string> = {};
    if (!harvestForm.date) errors.date = "Required";
    if (!harvestForm.greenhouse) errors.greenhouse = "Required";
    if (!harvestForm.quantity) errors.quantity = "Required";
    if (!harvestForm.grade) errors.grade = "Required";
    if (!harvestForm.destination) errors.destination = "Required";
    return errors;
  };

  const addGreenhouse = () => {
    const errors = validateGreenhouse();
    if (Object.keys(errors).length > 0) {
      setGreenhouseErrors(errors);
      return;
    }

    const newRecord: GreenhouseRecord = {
      ...greenhouseForm,
      id: Date.now().toString(),
    };

    setGreenhouses([...greenhouses, newRecord]);
    setGreenhouseForm({
      greenhouseNumber: "",
      seedVariety: "",
      plantingDate: "",
      plantCount: "",
      fertilizerSchedule: "",
      irrigationSchedule: "",
      pestObservation: "",
    });
    setGreenhouseErrors({});
  };

  const addHarvest = () => {
    const errors = validateHarvest();
    if (Object.keys(errors).length > 0) {
      setHarvestErrors(errors);
      return;
    }

    const newRecord: HarvestRecord = {
      ...harvestForm,
      id: Date.now().toString(),
    };

    setHarvestRecords([...harvestRecords, newRecord]);
    setHarvestForm({
      date: "",
      greenhouse: "",
      quantity: "",
      grade: "",
      destination: "",
    });
    setHarvestErrors({});
  };

  const deleteHarvest = (id: string) => {
    setHarvestRecords(harvestRecords.filter((r) => r.id !== id));
  };

  const deleteGreenhouse = (id: string) => {
    setGreenhouses(greenhouses.filter((g) => g.id !== id));
  };

  const totalHarvest = harvestRecords.reduce(
    (sum, h) => sum + Number(h.quantity || 0),
    0
  );

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Greenhouse sheet
    const greenhouseData = [
      [
        "Greenhouse Number",
        "Seed Variety",
        "Planting Date",
        "Plant Count",
        "Fertilizer Schedule",
        "Irrigation Schedule",
        "Pest Observation",
      ],
      ...greenhouses.map((g) => [
        g.greenhouseNumber,
        g.seedVariety,
        g.plantingDate,
        g.plantCount,
        g.fertilizerSchedule,
        g.irrigationSchedule,
        g.pestObservation,
      ]),
    ];

    const greenhouseSheet = XLSX.utils.aoa_to_sheet(greenhouseData);
    greenhouseSheet["!cols"] = [
      { wch: 18 },
      { wch: 16 },
      { wch: 14 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(workbook, greenhouseSheet, "Production Monitoring");

    // Harvest sheet
    const harvestData = [
      ["Date", "Greenhouse", "Quantity (kg)", "Grade", "Destination"],
      ...harvestRecords.map((h) => [h.date, h.greenhouse, h.quantity, h.grade, h.destination]),
      [],
      ["Total Harvest (kg):", "", totalHarvest],
    ];

    const harvestSheet = XLSX.utils.aoa_to_sheet(harvestData);
    harvestSheet["!cols"] = [
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 12 },
      { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(workbook, harvestSheet, "Harvest Records");

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `bell-pepper-tracker-${today}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Bell Pepper Greenhouse Farm Tracker
            </h1>
          </div>
          <p className="text-muted-foreground">
            Monitor your production and harvest records in one place
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Greenhouses</p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {greenhouses.length}
                  </p>
                </div>
                <Leaf className="w-12 h-12 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Harvest Records</p>
                  <p className="text-3xl font-bold text-accent mt-1">
                    {harvestRecords.length}
                  </p>
                </div>
                <Leaf className="w-12 h-12 text-accent/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Harvest (kg)</p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {totalHarvest.toLocaleString()}
                  </p>
                </div>
                <Leaf className="w-12 h-12 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Production Monitoring Section */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Production Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Greenhouse Number</label>
                <Input
                  placeholder="e.g., GH-01"
                  value={greenhouseForm.greenhouseNumber}
                  onChange={(e) =>
                    setGreenhouseForm({
                      ...greenhouseForm,
                      greenhouseNumber: e.target.value,
                    })
                  }
                  className={greenhouseErrors.greenhouseNumber ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Seed Variety</label>
                <Input
                  placeholder="e.g., Bell Pepper Red"
                  value={greenhouseForm.seedVariety}
                  onChange={(e) =>
                    setGreenhouseForm({
                      ...greenhouseForm,
                      seedVariety: e.target.value,
                    })
                  }
                  className={greenhouseErrors.seedVariety ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Planting Date</label>
                <Input
                  type="date"
                  value={greenhouseForm.plantingDate}
                  onChange={(e) =>
                    setGreenhouseForm({
                      ...greenhouseForm,
                      plantingDate: e.target.value,
                    })
                  }
                  className={greenhouseErrors.plantingDate ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Number of Plants</label>
                <Input
                  placeholder="e.g., 500"
                  value={greenhouseForm.plantCount}
                  onChange={(e) =>
                    setGreenhouseForm({
                      ...greenhouseForm,
                      plantCount: e.target.value,
                    })
                  }
                  className={greenhouseErrors.plantCount ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Fertilizer Schedule</label>
                <Input
                  placeholder="e.g., Weekly NPK"
                  value={greenhouseForm.fertilizerSchedule}
                  onChange={(e) =>
                    setGreenhouseForm({
                      ...greenhouseForm,
                      fertilizerSchedule: e.target.value,
                    })
                  }
                  className={greenhouseErrors.fertilizerSchedule ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Irrigation Schedule</label>
                <Input
                  placeholder="e.g., Daily 6AM & 4PM"
                  value={greenhouseForm.irrigationSchedule}
                  onChange={(e) =>
                    setGreenhouseForm({
                      ...greenhouseForm,
                      irrigationSchedule: e.target.value,
                    })
                  }
                  className={greenhouseErrors.irrigationSchedule ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-1.5 md:col-span-3">
                <label className="text-sm font-medium">Pest or Disease Observation</label>
                <Input
                  placeholder="e.g., Minor aphid activity"
                  value={greenhouseForm.pestObservation}
                  onChange={(e) =>
                    setGreenhouseForm({
                      ...greenhouseForm,
                      pestObservation: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Button
              onClick={addGreenhouse}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Greenhouse Record
            </Button>
          </CardContent>
        </Card>

        {/* Greenhouse Records */}
        {greenhouses.length > 0 && (
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Active Greenhouses ({greenhouses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {greenhouses.map((g) => (
                  <div key={g.id} className="border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-primary text-primary-foreground font-mono">
                        {g.greenhouseNumber}
                      </Badge>
                      <button
                        onClick={() => deleteGreenhouse(g.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Seed Variety</p>
                        <p className="font-medium">{g.seedVariety}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Planting Date</p>
                        <p className="font-medium">{g.plantingDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Plant Count</p>
                        <p className="font-medium">{g.plantCount} plants</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fertilizer Schedule</p>
                        <p className="font-medium">{g.fertilizerSchedule}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Irrigation Schedule</p>
                        <p className="font-medium">{g.irrigationSchedule}</p>
                      </div>
                      {g.pestObservation && (
                        <div>
                          <p className="text-xs text-muted-foreground">Pest Observation</p>
                          <p className="font-medium">{g.pestObservation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Harvest Monitoring Section */}
        <Card className="mb-8 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-accent" />
              Harvest Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={harvestForm.date}
                  onChange={(e) =>
                    setHarvestForm({ ...harvestForm, date: e.target.value })
                  }
                  className={harvestErrors.date ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Greenhouse Number</label>
                <Input
                  placeholder="e.g., GH-01"
                  value={harvestForm.greenhouse}
                  onChange={(e) =>
                    setHarvestForm({
                      ...harvestForm,
                      greenhouse: e.target.value,
                    })
                  }
                  className={harvestErrors.greenhouse ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Quantity (kg)</label>
                <Input
                  type="number"
                  placeholder="e.g., 150"
                  value={harvestForm.quantity}
                  onChange={(e) =>
                    setHarvestForm({
                      ...harvestForm,
                      quantity: e.target.value,
                    })
                  }
                  className={harvestErrors.quantity ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Grade Classification</label>
                <Input
                  placeholder="e.g., A, B, C"
                  value={harvestForm.grade}
                  onChange={(e) =>
                    setHarvestForm({ ...harvestForm, grade: e.target.value })
                  }
                  className={harvestErrors.grade ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-1.5 md:col-span-2">
                <label className="text-sm font-medium">Destination (Buyer / Market)</label>
                <Input
                  placeholder="e.g., Local Market, Export, Processor"
                  value={harvestForm.destination}
                  onChange={(e) =>
                    setHarvestForm({
                      ...harvestForm,
                      destination: e.target.value,
                    })
                  }
                  className={harvestErrors.destination ? "border-destructive" : ""}
                />
              </div>
            </div>

            <Button
              onClick={addHarvest}
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            >
              <Plus className="w-4 h-4" />
              Record Harvest
            </Button>
          </CardContent>
        </Card>

        {/* Harvest Records Table */}
        {harvestRecords.length > 0 && (
          <Card className="border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Harvest Records ({harvestRecords.length})</CardTitle>
              <Button
                onClick={exportToExcel}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Greenhouse</th>
                      <th className="text-right py-3 px-4 font-semibold">Quantity (kg)</th>
                      <th className="text-center py-3 px-4 font-semibold">Grade</th>
                      <th className="text-left py-3 px-4 font-semibold">Destination</th>
                      <th className="py-3 px-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {harvestRecords.map((h, i) => (
                      <tr
                        key={h.id}
                        className={`border-b border-border transition-colors hover:bg-muted/50 ${
                          i % 2 === 0 ? "bg-card" : "bg-background"
                        }`}
                      >
                        <td className="py-3 px-4 text-foreground">{h.date}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="font-mono">
                            {h.greenhouse}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {Number(h.quantity).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className="bg-accent/20 text-accent font-semibold">
                            {h.grade}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-foreground">{h.destination}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => deleteHarvest(h.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-primary/10 border-t-2 border-primary/20 font-semibold">
                      <td colSpan={2} className="py-3 px-4">
                        Total Harvest
                      </td>
                      <td className="py-3 px-4 text-right text-primary">
                        {totalHarvest.toLocaleString()} kg
                      </td>
                      <td colSpan={3} />
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
