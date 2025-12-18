'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { LibraryItem } from '@prisma/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

// Form component for adding/editing library items
type LibraryItemFormData = {
  name: string;
  type: 'FOOD' | 'EXERCISE' | 'NUTRITION_SET';
  description?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
};

const LibraryItemForm = ({
  item,
  onSubmit,
  onCancel
}: {
  item?: LibraryItem | null;
  onSubmit: (data: LibraryItemFormData) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(item?.name || '');
  const [type, setType] = useState<'FOOD' | 'EXERCISE' | 'NUTRITION_SET'>(item?.type || 'FOOD');
  const [description, setDescription] = useState(item?.description || '');
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '');
  const [metadata, setMetadata] = useState(item?.metadata ? JSON.stringify(item.metadata, null, 2) : '{}');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try to parse metadata as JSON
      let parsedMetadata: Record<string, unknown> | null = null;
      if (metadata.trim()) {
        parsedMetadata = JSON.parse(metadata);
      }

      onSubmit({
        name,
        type,
        description,
        imageUrl: imageUrl || undefined,
        metadata: parsedMetadata || undefined
      });
    } catch (error) {
      toast.error('Invalid JSON in metadata field');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Item name (e.g., Grilled Chicken)"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <Select value={type} onValueChange={(value: 'FOOD' | 'EXERCISE' | 'NUTRITION_SET') => setType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FOOD">Food</SelectItem>
            <SelectItem value="EXERCISE">Exercise</SelectItem>
            <SelectItem value="NUTRITION_SET">Nutrition Set</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description of the item"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL to image (optional)"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Metadata</label>
        <textarea
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          className="w-full p-2 border rounded-md min-h-[100px] font-mono text-sm"
          placeholder='JSON metadata (e.g., {"calories": 200, "protein": 30})'
        />
        <p className="text-xs text-muted-foreground mt-1">
          Additional data in JSON format (calories for food, reps/duration for exercises, etc.)
        </p>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (item ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

export default function AdminLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'FOOD' | 'EXERCISE' | 'NUTRITION_SET' | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Fetch library items
  const {
    data: libraryItems,
    isLoading,
    refetch
  } = api.admin.library.getAllLibraryItems.useQuery({
    type: filterType,
    search: searchTerm
  });

  // Mutations
  const createItemMutation = api.admin.library.createLibraryItem.useMutation({
    onSuccess: () => {
      toast.success('Library item created successfully');
      refetch();
      setIsFormOpen(false);
    },
    onError: (err) => {
      toast.error(`Error creating item: ${err.message}`);
    }
  });

  const updateItemMutation = api.admin.library.updateLibraryItem.useMutation({
    onSuccess: () => {
      toast.success('Library item updated successfully');
      refetch();
      setIsFormOpen(false);
      setSelectedItem(null);
    },
    onError: (err) => {
      toast.error(`Error updating item: ${err.message}`);
    }
  });

  const deleteItemMutation = api.admin.library.deleteLibraryItem.useMutation({
    onSuccess: () => {
      toast.success('Library item deleted successfully');
      refetch();
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
    },
    onError: (err) => {
      toast.error(`Error deleting item: ${err.message}`);
    }
  });

  const handleCreateItem = (data: LibraryItemFormData) => {
    createItemMutation.mutate(data);
  };

  const handleUpdateItem = (data: LibraryItemFormData) => {
    if (selectedItem) {
      updateItemMutation.mutate({ ...data, id: selectedItem.id });
    }
  };

  const handleDeleteItem = () => {
    if (itemToDelete) {
      deleteItemMutation.mutate({ id: itemToDelete });
    }
  };

  const handleFormSubmit = (data: LibraryItemFormData) => {
    if (selectedItem) {
      handleUpdateItem(data);
    } else {
      handleCreateItem(data);
    }
  };

  const handleEditClick = (item: LibraryItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Library Management</h1>
        <p className="text-muted-foreground">
          Manage the library of items that professors can use to create personalized plans
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Library Items</CardTitle>
              <CardDescription>
                Manage and categorize items that professors can use in student plans
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              
              <Select value={filterType} onValueChange={(value: string | undefined) => setFilterType(value as 'FOOD' | 'EXERCISE' | 'NUTRITION_SET' | undefined)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOOD">Food</SelectItem>
                  <SelectItem value="EXERCISE">Exercise</SelectItem>
                  <SelectItem value="NUTRITION_SET">Nutrition Set</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setSelectedItem(null);
                    setIsFormOpen(true);
                  }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedItem ? 'Edit Library Item' : 'Add New Library Item'}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedItem 
                        ? 'Update the details of this library item' 
                        : 'Add a new item to the library that professors can use in student plans'}
                    </DialogDescription>
                  </DialogHeader>
                  <LibraryItemForm 
                    item={selectedItem} 
                    onSubmit={handleFormSubmit} 
                    onCancel={() => {
                      setIsFormOpen(false);
                      setSelectedItem(null);
                    }} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !libraryItems || libraryItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-muted-foreground">
                <X className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium">No library items</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new library item.
              </p>
              <div className="mt-6">
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Library Item</DialogTitle>
                      <DialogDescription>
                        Add a new item to the library that professors can use in student plans
                      </DialogDescription>
                    </DialogHeader>
                    <LibraryItemForm 
                      onSubmit={handleFormSubmit} 
                      onCancel={() => setIsFormOpen(false)} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {libraryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.type === 'FOOD' 
                            ? 'bg-green-100 text-green-800' 
                            : item.type === 'EXERCISE' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(item)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this library item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                setItemToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteItem}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}