"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Save, Trash2, Edit3 } from "lucide-react";
import { useSnackbar } from "@/components/shared/snackbar-context";

export default function ServicesPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  
  // Form states
  const [newService, setNewService] = useState({ name: "", slug: "", description: "" });
  const [newTier, setNewTier] = useState({ serviceId: "", name: "", order: 1, isPopular: false });
  const [newPrice, setNewPrice] = useState({
    tierId: "",
    duration: "monthly" as "monthly" | "threeMonths" | "sixMonths",
    price: 0
  });

  const { 
    data: servicesData, 
    isLoading, 
    refetch 
  } = api.admin.services.getAllServices.useQuery({ page: 1, limit: 10 });

  const createService = api.admin.services.createService.useMutation({
    onSuccess: () => {
      refetch();
      setNewService({ name: "", slug: "", description: "" });
      showSnackbar("Service created successfully", "success");
    },
    onError: (error) => {
      showSnackbar(`Error creating service: ${error.message}`, "error");
    }
  });

  const updateService = api.admin.services.updateService.useMutation({
    onSuccess: () => {
      refetch();
      setEditingService(null);
      showSnackbar("Service updated successfully", "success");
    },
    onError: (error) => {
      showSnackbar(`Error updating service: ${error.message}`, "error");
    }
  });

  const deleteService = api.admin.services.deleteService.useMutation({
    onSuccess: () => {
      refetch();
      showSnackbar("Service deleted successfully", "success");
    },
    onError: (error) => {
      showSnackbar(`Error deleting service: ${error.message}`, "error");
    }
  });

  const createServiceTier = api.admin.services.createServiceTier.useMutation({
    onSuccess: () => {
      refetch();
      setNewTier({ serviceId: "", name: "", order: 1, isPopular: false });
      showSnackbar("Service tier created successfully", "success");
    },
    onError: (error) => {
      showSnackbar(`Error creating service tier: ${error.message}`, "error");
    }
  });

  const updateServiceTier = api.admin.services.updateServiceTier.useMutation({
    onSuccess: () => {
      refetch();
      setEditingTier(null);
      showSnackbar("Service tier updated successfully", "success");
    },
    onError: (error) => {
      showSnackbar(`Error updating service tier: ${error.message}`, "error");
    }
  });

  const deleteServiceTier = api.admin.services.deleteServiceTier.useMutation({
    onSuccess: () => {
      refetch();
      showSnackbar("Service tier deleted successfully", "success");
    },
    onError: (error) => {
      showSnackbar(`Error deleting service tier: ${error.message}`, "error");
    }
  });

  const createServicePrice = api.admin.services.createServicePrice.useMutation({
    onSuccess: () => {
      refetch();
      setNewPrice({ tierId: "", duration: "monthly", price: 0 });
      showSnackbar("Price created successfully", "success");
    },
    onError: (error) => {
      showSnackbar(`Error creating price: ${error.message}`, "error");
    }
  });

  const updateServicePrice = api.admin.services.updateServicePrice.useMutation({
    onSuccess: () => {
      refetch();
      setEditingPrice(null);
      showSnackbar("Price updated successfully", "success");
    },
    onError: (error) => {
      showSnackbar(`Error updating price: ${error.message}`, "error");
    }
  });

  const deleteServicePrice = api.admin.services.deleteServicePrice.useMutation({
    onSuccess: () => {
      refetch();
      showSnackbar("Price deleted successfully", "success");
    },
    onError: (error) => {
      showSnackbar(`Error deleting price: ${error.message}`, "error");
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Service Management" 
        description="Manage services, tiers, and pricing" 
      />

      {/* Add New Service Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="serviceName">Service Name</Label>
              <Input
                id="serviceName"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                placeholder="e.g., Nutrition"
              />
            </div>
            <div>
              <Label htmlFor="serviceSlug">Service Slug</Label>
              <Input
                id="serviceSlug"
                value={newService.slug}
                onChange={(e) => setNewService({...newService, slug: e.target.value})}
                placeholder="e.g., nutrition"
              />
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="serviceDescription">Description</Label>
              <Textarea
                id="serviceDescription"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                placeholder="Enter service description"
                rows={2}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => createService.mutate(newService)}
              disabled={!newService.name || !newService.slug || !newService.description}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {servicesData?.services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              {editingService === service.id ? (
                <div className="flex flex-col gap-2">
                  <Input
                    value={service.name}
                    onChange={(e) => {
                      // Update the service name in the data - we need to create a new object to trigger re-render
                      const updatedServices = servicesData.services.map(s => 
                        s.id === service.id ? {...s, name: e.target.value} : s
                      );
                      // This will be updated by the refetch after mutation
                    }}
                    placeholder="Service name"
                    onBlur={() => {
                      updateService.mutate({
                        id: service.id,
                        name: service.name,
                      });
                    }}
                  />
                  <Input
                    value={service.slug}
                    onChange={(e) => {
                      const updatedServices = servicesData.services.map(s => 
                        s.id === service.id ? {...s, slug: e.target.value} : s
                      );
                    }}
                    placeholder="Service slug"
                    onBlur={() => {
                      updateService.mutate({
                        id: service.id,
                        slug: service.slug,
                      });
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{service.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{service.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingService(service.id);
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteService.mutate({ id: service.id })}
                      disabled={deleteService.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm mb-4">{service.description}</p>
              
              {/* Add New Tier Form */}
              <div className="mb-4 p-3 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Add New Tier</h4>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <Input
                    value={newTier.name}
                    onChange={(e) => setNewTier({...newTier, name: e.target.value, serviceId: service.id})}
                    placeholder="Tier name"
                    className="col-span-2"
                  />
                  <Input
                    type="number"
                    value={newTier.order}
                    onChange={(e) => setNewTier({...newTier, order: parseInt(e.target.value), serviceId: service.id})}
                    placeholder="Order"
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    onClick={() => createServiceTier.mutate(newTier)}
                    disabled={!newTier.name}
                    size="sm"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add Tier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewTier({...newTier, isPopular: !newTier.isPopular, serviceId: service.id})}
                  >
                    {newTier.isPopular ? 'Popular ✓' : 'Popular'}
                  </Button>
                </div>
              </div>

              {/* Tiers List */}
              <div className="space-y-3">
                {service.serviceTiers.map((tier) => (
                  <div key={tier.id} className="border rounded-md p-3 bg-background">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium flex items-center gap-2">
                          {tier.name}
                          {tier.isPopular && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </h5>
                        <p className="text-sm text-muted-foreground">Order: {tier.order}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTier(tier.id);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteServiceTier.mutate({ id: tier.id })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Add New Price Form */}
                    <div className="mt-3 p-2 bg-muted rounded-sm">
                      <h5 className="text-sm font-medium mb-2">Add/Edit Price</h5>
                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          value={newPrice.duration}
                          onValueChange={(value) => setNewPrice({
                            ...newPrice,
                            duration: value as "monthly" | "threeMonths" | "sixMonths",
                            tierId: tier.id
                          })}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="threeMonths">3 Months</SelectItem>
                            <SelectItem value="sixMonths">6 Months</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={newPrice.price}
                          onChange={(e) => setNewPrice({...newPrice, price: parseFloat(e.target.value), tierId: tier.id})}
                          placeholder="Price"
                          className="h-8 text-sm"
                        />
                        <Button
                          onClick={() => createServicePrice.mutate(newPrice)}
                          disabled={!newPrice.price || newPrice.price <= 0}
                          size="sm"
                          className="h-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Prices List */}
                    <div className="mt-2 space-y-1">
                      {tier.price.map((price) => (
                        <div key={price.id} className="flex justify-between items-center pl-2 py-1 text-sm border-l-2 border-primary">
                          <span className="capitalize">{price.duration}</span>
                          <div className="flex items-center gap-2">
                            <span>{price.price} EGP</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setEditingPrice(price.id)}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => deleteServicePrice.mutate({ id: price.id })}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}