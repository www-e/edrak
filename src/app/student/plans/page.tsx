'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { StudentPlan, LibraryItem } from '@prisma/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Calendar,
  Clock,
  User,
  ChefHat,
  Dumbbell,
  Apple,
  X
} from 'lucide-react';

type PlanWithItems = StudentPlan & {
  planItems: {
    libraryItem: LibraryItem;
    quantity: number | null;
    duration: number | null;
    repetitions: number | null;
    sets: number | null;
    notes: string | null;
  }[];
  student: { id: string; firstName: string; lastName: string; email: string };
  professor: { id: string; firstName: string; lastName: string; email: string };
};

export default function StudentPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanWithItems | null>(null);
  
  // Fetch student's plans
  const {
    data: studentPlans,
    isLoading
  } = api.student.plans.getMyPlans.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Plans</h1>
        <p className="text-muted-foreground">
          View and follow your personalized plans created by your professors
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !studentPlans || studentPlans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-muted-foreground">
              <X className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium">No plans yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You do not have any personalized plans yet. Check back later!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studentPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPlan(plan)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-2">{plan.name}</CardTitle>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <User className="h-4 w-4 mr-1" />
                    <span>By {plan.professor.firstName} {plan.professor.lastName}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {plan.description}
                  </p>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{plan.planItems.length} items</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Plan Details Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPlan.name}</h2>
                  <p className="text-muted-foreground">
                    Created by {selectedPlan.professor.firstName} {selectedPlan.professor.lastName}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {selectedPlan.description && (
                <p className="text-muted-foreground mb-6">{selectedPlan.description}</p>
              )}
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPlan.planItems.map((item, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.libraryItem.name}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.libraryItem.type === 'FOOD' 
                              ? 'bg-green-100 text-green-800 flex items-center' 
                              : item.libraryItem.type === 'EXERCISE' 
                              ? 'bg-blue-100 text-blue-800 flex items-center' 
                              : 'bg-purple-100 text-purple-800 flex items-center'
                          }`}>
                            {item.libraryItem.type === 'FOOD' && <ChefHat className="h-3 w-3 mr-1" />}
                            {item.libraryItem.type === 'EXERCISE' && <Dumbbell className="h-3 w-3 mr-1" />}
                            {item.libraryItem.type === 'NUTRITION_SET' && <Apple className="h-3 w-3 mr-1" />}
                            {item.libraryItem.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {item.quantity && (
                              <div>Quantity: {item.quantity}</div>
                            )}
                            {item.duration && (
                              <div>Duration: {item.duration} min</div>
                            )}
                            {item.repetitions && (
                              <div>Repetitions: {item.repetitions}</div>
                            )}
                            {item.sets && (
                              <div>Sets: {item.sets}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.notes ? item.notes : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}