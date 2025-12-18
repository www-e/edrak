'use client';

import { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { LibraryItem, Prisma } from '@prisma/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  PlusCircle,
  Search,
  User,
  Plus,
  X,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

type UserType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentProfile: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    bio: string | null;
    avatar: string | null;
    preferredLanguage: string | null;
    timezone: string | null;
    notifications: Prisma.JsonValue;
  } | null;
};

// Component for selecting students
const StudentSelector = ({
  onSelect,
  onCancel
}: {
  onSelect: (student: UserType) => void;
  onCancel: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentList, setStudentList] = useState<UserType[]>([]);

  // Fetch all students accessible to this professor
  const { data: allUsers, isLoading: usersLoading, refetch } = api.professor.plans.getMyStudents.useQuery({
    search: searchTerm
  });

  useEffect(() => {
    if (allUsers) {
      // Filter out students who already have plans to avoid duplication if needed
      setStudentList(allUsers);
    }
  }, [allUsers]);

  useEffect(() => {
    refetch();
  }, [searchTerm, refetch]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-8 border rounded-md"
        />
      </div>

      {usersLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          {studentList.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No students found
            </div>
          ) : (
            <ul className="space-y-2">
              {studentList.map((student) => (
                <li key={student.id} className="border rounded-md p-3 hover:bg-muted cursor-pointer"
                  onClick={() => onSelect(student)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {student.studentProfile?.avatar ? (
                        <img
                          src={student.studentProfile.avatar}
                          alt={student.firstName}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-8 w-8 rounded-full text-muted-foreground" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{student.firstName} {student.lastName}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Component for selecting library items
const LibraryItemSelector = ({
  onAdd,
  onCancel,
  existingItems = []
}: {
  onAdd: (item: LibraryItem) => void;
  onCancel: () => void;
  existingItems?: PlanItemWithLibrary[];
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'FOOD' | 'EXERCISE' | 'NUTRITION_SET' | undefined>(undefined);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);

  // Fetch library items
  const { data: allLibraryItems, isLoading } = api.admin.library.getAllLibraryItems.useQuery({
    type: filterType,
    search: searchTerm
  });

  useEffect(() => {
    // Filter out items that are already in the plan
    if (allLibraryItems) {
      const existingIds = existingItems.map(item => item.libraryItem.id);
      const filteredItems = allLibraryItems.filter(item => !existingIds.includes(item.id));
      setLibraryItems(filteredItems);
    }
  }, [allLibraryItems, existingItems]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search library items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 border rounded-md"
          />
        </div>
        
        <select
          value={filterType || ''}
          onChange={(e) => {
            const value = e.target.value || undefined;
            if (value === undefined || value === 'FOOD' || value === 'EXERCISE' || value === 'NUTRITION_SET') {
              setFilterType(value);
            }
          }}
          className="border rounded-md p-2"
        >
          <option value="">All Types</option>
          <option value="FOOD">Food</option>
          <option value="EXERCISE">Exercise</option>
          <option value="NUTRITION_SET">Nutrition Set</option>
        </select>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          {libraryItems.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No library items found
            </div>
          ) : (
            <ul className="space-y-2">
              {libraryItems.map((item) => (
                <li 
                  key={item.id} 
                  className="border rounded-md p-3 hover:bg-muted cursor-pointer flex justify-between items-center"
                  onClick={() => onAdd(item)}
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Plus className="h-4 w-4" />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

type PlanItemWithLibrary = {
  libraryItem: LibraryItem;
  quantity?: number;
  duration?: number;
  repetitions?: number;
  sets?: number;
  notes?: string;
};

// Component for plan item details
const PlanItemDetails = ({
  item,
  onUpdate,
  onRemove
}: {
  item: PlanItemWithLibrary;
  onUpdate: (updatedItem: PlanItemWithLibrary) => void;
  onRemove: () => void;
}) => {
  const [quantity, setQuantity] = useState(item.quantity || 0);
  const [duration, setDuration] = useState(item.duration || 0);
  const [repetitions, setRepetitions] = useState(item.repetitions || 0);
  const [sets, setSets] = useState(item.sets || 0);
  const [notes, setNotes] = useState(item.notes || '');

  const handleUpdate = () => {
    onUpdate({
      ...item,
      quantity: quantity || undefined,
      duration: duration || undefined,
      repetitions: repetitions || undefined,
      sets: sets || undefined,
      notes
    });
  };

  // Auto-save when values change
  useEffect(() => {
    handleUpdate();
  }, [quantity, duration, repetitions, sets, notes, handleUpdate]);

  return (
    <div className="border rounded-md p-3 bg-muted">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{item.libraryItem.name}</h4>
        <button onClick={onRemove} className="text-red-500 hover:text-red-700">
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{item.libraryItem.description}</p>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        {item.libraryItem.type === 'FOOD' && (
          <div>
            <label className="text-xs text-muted-foreground">Quantity</label>
            <input
              type="number"
              value={quantity || 0}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-1 text-sm border rounded"
              min="0"
            />
          </div>
        )}
        
        {(item.libraryItem.type === 'EXERCISE') && (
          <>
            <div>
              <label className="text-xs text-muted-foreground">Repetitions</label>
              <input
                type="number"
                value={repetitions || 0}
                onChange={(e) => setRepetitions(Number(e.target.value))}
                className="w-full p-1 text-sm border rounded"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Sets</label>
              <input
                type="number"
                value={sets || 0}
                onChange={(e) => setSets(Number(e.target.value))}
                className="w-full p-1 text-sm border rounded"
                min="0"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground">Duration (minutes)</label>
              <input
                type="number"
                value={duration || 0}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-1 text-sm border rounded"
                min="0"
              />
            </div>
          </>
        )}
        
        <div className="col-span-2">
          <label className="text-xs text-muted-foreground">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-1 text-sm border rounded"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

type PlanWithItems = {
  id: string;
  name: string;
  description: string;
  studentId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  planItems: PlanItemWithLibrary[];
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  professor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function ProfessorPlansPage() {
  const [activeTab, setActiveTab] = useState<'myPlans' | 'createPlan'>('myPlans');
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);
  const [isLibrarySelectorOpen, setIsLibrarySelectorOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<UserType | null>(null);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanDescription, setNewPlanDescription] = useState('');
  const [planItems, setPlanItems] = useState<PlanItemWithLibrary[]>([]);
  const [editingPlan, setEditingPlan] = useState<PlanWithItemsFromAPI | null>(null);

type PlanWithItemsFromAPI = {
  id: string;
  name: string;
  description: string;
  studentId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  planItems: PlanItemWithLibrary[];
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  professor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

  // Fetch professor's plans
  const { 
    data: professorPlans, 
    isLoading, 
    refetch 
  } = api.professor.plans.getMyPlans.useQuery();

  // Mutations
  const createPlanMutation = api.professor.plans.createStudentPlan.useMutation({
    onSuccess: () => {
      toast.success('Plan created successfully');
      refetch();
      resetPlanForm();
    },
    onError: (err) => {
      toast.error(`Error creating plan: ${err.message}`);
    }
  });

  const handleCreatePlan = () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }
    
    if (planItems.length === 0) {
      toast.error('Please add at least one item to the plan');
      return;
    }
    
    createPlanMutation.mutate({
      name: newPlanName,
      description: newPlanDescription,
      studentId: selectedStudent.id,
      planItems: planItems.map(item => ({
        libraryItemId: item.libraryItem.id,
        ...item
      }))
    });
  };

  const handleAddItemToPlan = (item: LibraryItem) => {
    // Check if item is already added
    if (planItems.some(planItem => planItem.libraryItem.id === item.id)) {
      toast.error('This item is already in the plan');
      return;
    }

    setPlanItems([...planItems, {
      libraryItem: item,
      quantity: 0,
      duration: 0,
      repetitions: 0,
      sets: 0,
      notes: ''
    }]);
    setIsLibrarySelectorOpen(false);
  };

  const handleUpdatePlanItem = (updatedItem: PlanItemWithLibrary) => {
    setPlanItems(planItems.map(item =>
      item.libraryItem.id === updatedItem.libraryItem.id ? updatedItem : item
    ));
  };

  const handleRemovePlanItem = (itemId: string) => {
    setPlanItems(planItems.filter(item => item.libraryItem.id !== itemId));
  };

  const resetPlanForm = () => {
    setSelectedStudent(null);
    setNewPlanName('');
    setNewPlanDescription('');
    setPlanItems([]);
    setActiveTab('myPlans');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Plans</h1>
        <p className="text-muted-foreground">
          Create and manage personalized plans for your students
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'myPlans'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('myPlans')}
        >
          My Plans
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'createPlan'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('createPlan')}
        >
          Create Plan
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'myPlans' ? (
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !professorPlans || professorPlans.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-muted-foreground">
                  <X className="h-12 w-12" />
                </div>
                <h3 className="mt-2 text-sm font-medium">No plans yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get started by creating your first student plan.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setActiveTab('createPlan')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {professorPlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      For: {plan.student.firstName} {plan.student.lastName}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {plan.description}
                    </p>
                    
                    <div className="text-sm text-muted-foreground mb-4">
                      <span className="font-medium">Items: </span>
                      {plan.planItems.length}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setEditingPlan(plan as unknown as PlanWithItemsFromAPI)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Create Plan Tab
        <Card>
          <CardHeader>
            <CardTitle>Create New Plan</CardTitle>
            <CardDescription>
              Create a personalized plan for a student using library items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Student</label>
                {selectedStudent ? (
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{selectedStudent.firstName} {selectedStudent.lastName}</span>
                      <span className="text-muted-foreground text-sm ml-2">({selectedStudent.email})</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedStudent(null)}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Dialog open={isStudentSelectorOpen} onOpenChange={setIsStudentSelectorOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setIsStudentSelectorOpen(true)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Select Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Select Student</DialogTitle>
                        <DialogDescription>
                          Choose a student to create a plan for
                        </DialogDescription>
                      </DialogHeader>
                      <StudentSelector 
                        onSelect={(student) => {
                          setSelectedStudent(student);
                          setIsStudentSelectorOpen(false);
                        }} 
                        onCancel={() => setIsStudentSelectorOpen(false)} 
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              {/* Plan Details */}
              <div>
                <label className="block text-sm font-medium mb-2">Plan Name</label>
                <input
                  type="text"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Plan name (e.g., John's Training Plan)"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newPlanDescription}
                  onChange={(e) => setNewPlanDescription(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Optional description for the plan"
                  rows={3}
                />
              </div>
              
              {/* Plan Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Plan Items</label>
                  <Dialog open={isLibrarySelectorOpen} onOpenChange={setIsLibrarySelectorOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLibrarySelectorOpen(true)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Library Item</DialogTitle>
                        <DialogDescription>
                          Select a library item to add to the plan
                        </DialogDescription>
                      </DialogHeader>
                      <LibraryItemSelector 
                        onAdd={handleAddItemToPlan} 
                        onCancel={() => setIsLibrarySelectorOpen(false)}
                        existingItems={planItems}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                
                {planItems.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-md">
                    <p className="text-muted-foreground">No items added yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add items from the library to create a plan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto p-1">
                    {planItems.map((item, index) => (
                      <PlanItemDetails
                        key={index}
                        item={item}
                        onUpdate={(updatedItem) => handleUpdatePlanItem(updatedItem)}
                        onRemove={() => handleRemovePlanItem(item.libraryItem.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetPlanForm}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePlan}
                  disabled={createPlanMutation.isPending}
                >
                  {createPlanMutation.isPending ? 'Creating...' : 'Create Plan'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Details Modal */}
      {editingPlan && (
        <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlan.name}</DialogTitle>
              <DialogDescription>
                Plan for {editingPlan.student.firstName} {editingPlan.student.lastName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">{editingPlan.description}</p>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">Plan Items</h3>
                
                {editingPlan.planItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No items in this plan</p>
                ) : (
                  <div className="space-y-3">
                    {editingPlan.planItems.map((item: PlanItemWithLibrary, index: number) => (
                      <div key={index} className="border rounded-md p-3 bg-muted">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{item.libraryItem.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.libraryItem.type === 'FOOD' 
                              ? 'bg-green-100 text-green-800' 
                              : item.libraryItem.type === 'EXERCISE' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {item.libraryItem.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{item.libraryItem.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          {item.quantity && (
                            <div>
                              <span className="text-muted-foreground">Quantity: </span>
                              <span>{item.quantity}</span>
                            </div>
                          )}
                          {item.duration && (
                            <div>
                              <span className="text-muted-foreground">Duration: </span>
                              <span>{item.duration} min</span>
                            </div>
                          )}
                          {item.repetitions && (
                            <div>
                              <span className="text-muted-foreground">Reps: </span>
                              <span>{item.repetitions}</span>
                            </div>
                          )}
                          {item.sets && (
                            <div>
                              <span className="text-muted-foreground">Sets: </span>
                              <span>{item.sets}</span>
                            </div>
                          )}
                          {item.notes && (
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Notes: </span>
                              <span>{item.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}