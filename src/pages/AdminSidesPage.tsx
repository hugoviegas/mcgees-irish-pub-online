import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useSidesData } from '@/hooks/useSidesData';
import { SideForm } from '@/components/admin/SideForm';
import { Side } from '@/types/menu';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminSidesPage() {
  const { user, logout } = useAuth();
  const { sides, loading, addSide, updateSide, deleteSide } = useSidesData();
  const [editingSide, setEditingSide] = useState<Side | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access the admin panel.</p>
      </div>
    );
  }

  const handleSave = async (sideData: Omit<Side, 'id'>) => {
    if (editingSide) {
      await updateSide(editingSide.id, sideData);
    } else {
      await addSide(sideData);
    }
  };

  const handleEdit = (side: Side) => {
    setEditingSide(side);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this side?')) {
      await deleteSide(id);
    }
  };

  const handleCancel = () => {
    setEditingSide(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Link>
              <h1 className="text-2xl font-bold">Manage Sides</h1>
            </div>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Manage side items that can be added to menu items</p>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Side
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sides.map((side) => (
            <Card key={side.id}>
              <CardHeader>
                <CardTitle className="text-lg">{side.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {side.description && (
                  <p className="text-gray-600 mb-2">{side.description}</p>
                )}
                {side.price && (
                  <p className="font-semibold text-primary mb-4">{side.price}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(side)}
                    className="flex items-center gap-1"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(side.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No sides created yet</p>
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Side
            </Button>
          </div>
        )}

        {showForm && (
          <SideForm
            side={editingSide || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
}