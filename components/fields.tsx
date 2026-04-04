'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getFields, createField, updateField, deleteField, Field, getCrops } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Grid3x3 } from 'lucide-react';

export function FieldsPage() {
  const { currentFarm } = useAppContext();
  const [fields, setFields] = useState(() => getFields(currentFarm?.id || ''));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddField = (formData: Omit<Field, 'id' | 'createdAt'>) => {
    if (!currentFarm) return;

    const newField = createField({
      ...formData,
      farmId: currentFarm.id,
    });

    setFields([...fields, newField]);
    setIsFormOpen(false);
  };

  const handleUpdateField = (formData: Omit<Field, 'id' | 'createdAt'>) => {
    if (!editingField) return;

    const updated = updateField(editingField.id, formData);
    if (updated) {
      setFields(fields.map((f) => (f.id === editingField.id ? updated : f)));
      setEditingField(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      if (deleteField(fieldId)) {
        setFields(fields.filter((f) => f.id !== fieldId));
      }
    }
  };

  const getFieldCropCount = (fieldId: string) => {
    const crops = getCrops(currentFarm?.id || '');
    return crops.filter((c) => c.fieldId === fieldId).length;
  };

  const handleFormSubmit = (formData: Omit<Field, 'id' | 'createdAt'>) => {
    if (editingField) {
      handleUpdateField(formData);
    } else {
      handleAddField(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fields & Greenhouses</h1>
          <p className="text-gray-600 mt-1">Manage your farm fields and greenhouse areas</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingField(null)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingField ? 'Edit Field' : 'Add New Field'}</DialogTitle>
            </DialogHeader>
            <FieldForm
              initialData={editingField || undefined}
              onSubmit={handleFormSubmit}
              onClose={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Input
        placeholder="Search fields..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-md"
      />

      {/* Fields Grid */}
      {filteredFields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Grid3x3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No fields added yet</p>
            <p className="text-gray-500 text-sm mt-1">Start by adding your first field or greenhouse</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFields.map((field) => (
            <Card key={field.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{field.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{field.location}</p>
                  </div>
                  <Badge
                    variant={
                      field.status === 'available'
                        ? 'default'
                        : field.status === 'in_use'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {field.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Size</p>
                    <p className="font-semibold">{field.size.toLocaleString()} m²</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Crops</p>
                    <p className="font-semibold">{getFieldCropCount(field.id)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Soil Type</p>
                    <p className="font-semibold">{field.soilType}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Irrigation</p>
                    <p className="font-semibold">{field.irrigationType}</p>
                  </div>
                </div>

                {field.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">{field.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingField(field);
                      setIsFormOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteField(field.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {fields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Total Fields</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{fields.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Total Area</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {fields.reduce((sum, f) => sum + f.size, 0).toLocaleString()} m²
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">In Use</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {fields.filter((f) => f.status === 'in_use').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Available</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {fields.filter((f) => f.status === 'available').length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface FieldFormProps {
  initialData?: Field;
  onSubmit: (data: Omit<Field, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

function FieldForm({ initialData, onSubmit, onClose }: FieldFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    size: initialData?.size.toString() || '',
    soilType: initialData?.soilType || 'loamy',
    irrigationType: initialData?.irrigationType || 'drip',
    status: initialData?.status || ('available' as const),
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      location: formData.location,
      size: parseFloat(formData.size) || 0,
      soilType: formData.soilType,
      irrigationType: formData.irrigationType,
      status: formData.status,
      notes: formData.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Field Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., North Greenhouse A"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., Building 2, Section A"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Size (m²)</label>
        <Input
          type="number"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          placeholder="1000"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Soil Type</label>
        <select
          value={formData.soilType}
          onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="loamy">Loamy</option>
          <option value="sandy">Sandy</option>
          <option value="clay">Clay</option>
          <option value="silt">Silt</option>
          <option value="peat">Peat</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Irrigation Type</label>
        <select
          value={formData.irrigationType}
          onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="drip">Drip</option>
          <option value="sprinkler">Sprinkler</option>
          <option value="flood">Flood</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="available">Available</option>
          <option value="in_use">In Use</option>
          <option value="fallow">Fallow</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional notes..."
          className="w-full px-3 py-2 border rounded-lg text-sm"
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
          {initialData ? 'Update Field' : 'Add Field'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
