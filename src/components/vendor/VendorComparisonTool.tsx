import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import { Separator } from "../../../../src/components/ui/separator";
import { ScrollArea } from "../../../../src/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../src/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select";
import { Vendor } from "../../../../src/types/vendor";
import { useCurrency } from "../../../../src/lib/currency";
import {
  getVendorsByCategory,
  getVendorExpenseSummary,
} from "../../../../src/services/vendorService";
import { useToast } from "../../../../src/components/ui/use-toast";
import {
  ArrowLeft,
  ExternalLink,
  Phone,
  Mail,
  Building,
  Check,
  X as XIcon,
  Info,
} from "lucide-react";
import VendorStatusBadge from "./VendorStatusBadge";

interface VendorComparisonToolProps {
  onBack: () => void;
  onViewVendorDetail?: (vendor: Vendor) => void;
}

const VendorComparisonTool: React.FC<VendorComparisonToolProps> = ({
  onBack,
  onViewVendorDetail = () => {},
}) => {
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [expenseSummaries, setExpenseSummaries] = useState<Record<string, any>>(
    {},
  );
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // This is a simplified approach - in a real app, you might want to fetch categories from the database
        setCategories([
          "venue",
          "catering",
          "photography",
          "videography",
          "florist",
          "music",
          "cake",
          "attire",
          "transportation",
          "decor",
          "beauty",
          "stationery",
          "jewelry",
          "other",
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load vendor categories.",
        });
      }
    };

    fetchCategories();
  }, [toast]);

  // Fetch vendors when category changes
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchVendors = async () => {
      try {
        setLoading(true);
        const data = await getVendorsByCategory(selectedCategory);
        setVendors(data);
        // Reset selected vendors when category changes
        setSelectedVendors([]);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load vendors: ${error.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [selectedCategory, toast]);

  // Fetch expense summaries for selected vendors
  useEffect(() => {
    if (selectedVendors.length === 0) return;

    const fetchExpenseSummaries = async () => {
      const summaries: Record<string, any> = {};

      for (const vendor of selectedVendors) {
        try {
          const summary = await getVendorExpenseSummary(vendor.id);
          summaries[vendor.id] = summary;
        } catch (error) {
          console.error(
            `Error fetching expense summary for ${vendor.name}:`,
            error,
          );
          // Continue with other vendors even if one fails
        }
      }

      setExpenseSummaries(summaries);
    };

    fetchExpenseSummaries();
  }, [selectedVendors]);

  // Toggle vendor selection
  const toggleVendorSelection = (vendor: Vendor) => {
    if (selectedVendors.some((v) => v.id === vendor.id)) {
      setSelectedVendors(selectedVendors.filter((v) => v.id !== vendor.id));
    } else {
      // Limit to 3 vendors for comparison
      if (selectedVendors.length < 3) {
        setSelectedVendors([...selectedVendors, vendor]);
      } else {
        toast({
          title: "Maximum Vendors Reached",
          description: "You can compare up to 3 vendors at a time.",
        });
      }
    }
  };

  // Get category display name
  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case "venue":
        return "Venue";
      case "catering":
        return "Catering";
      case "photography":
        return "Photography";
      case "videography":
        return "Videography";
      case "florist":
        return "Florist";
      case "music":
        return "Music/Entertainment";
      case "cake":
        return "Cake/Bakery";
      case "attire":
        return "Attire/Clothing";
      case "transportation":
        return "Transportation";
      case "decor":
        return "Decor/Rentals";
      case "beauty":
        return "Hair/Makeup";
      case "stationery":
        return "Stationery";
      case "jewelry":
        return "Jewelry";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Vendor Comparison</h1>
          <p className="text-muted-foreground">
            Compare vendors side-by-side to make informed decisions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Vendors to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-2 block">
                Select Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vendor category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {getCategoryDisplay(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedCategory ? (
            vendors.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Compare</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            className={
                              selectedVendors.some((v) => v.id === vendor.id)
                                ? "bg-primary text-primary-foreground"
                                : ""
                            }
                            onClick={() => toggleVendorSelection(vendor)}
                          >
                            {selectedVendors.some((v) => v.id === vendor.id) ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{vendor.name}</div>
                          {vendor.address && (
                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                              <Building className="h-3 w-3 mr-1" />
                              {vendor.address}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {vendor.contact_name && (
                            <div className="text-sm">{vendor.contact_name}</div>
                          )}
                          {vendor.email && (
                            <div className="text-xs flex items-center mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              <a
                                href={`mailto:${vendor.email}`}
                                className="text-primary hover:underline"
                              >
                                {vendor.email}
                              </a>
                            </div>
                          )}
                          {vendor.phone && (
                            <div className="text-xs flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {vendor.phone}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <VendorStatusBadge status={vendor.status} size="sm" />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewVendorDetail(vendor)}
                          >
                            <Info className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No vendors found in this category.</p>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Select a category to view vendors.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedVendors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vendor Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Detailed Comparison</TabsTrigger>
                <TabsTrigger value="expenses">Expenses & Pricing</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedVendors.map((vendor) => (
                    <Card key={vendor.id} className="overflow-hidden">
                      <CardHeader className="pb-2 bg-muted/30">
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <Badge variant="outline">
                          {getCategoryDisplay(vendor.category)}
                        </Badge>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium">Status</div>
                            <VendorStatusBadge status={vendor.status} />
                          </div>

                          {vendor.contact_name && (
                            <div>
                              <div className="text-sm font-medium">Contact</div>
                              <div>{vendor.contact_name}</div>
                            </div>
                          )}

                          {vendor.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{vendor.phone}</span>
                            </div>
                          )}

                          {vendor.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              <a
                                href={`mailto:${vendor.email}`}
                                className="text-primary hover:underline"
                              >
                                {vendor.email}
                              </a>
                            </div>
                          )}

                          {vendor.website && (
                            <div className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              <a
                                href={vendor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}

                          {expenseSummaries[vendor.id] && (
                            <div>
                              <div className="text-sm font-medium">
                                Total Expenses
                              </div>
                              <div className="text-lg font-bold">
                                {formatCurrency(
                                  expenseSummaries[vendor.id].total || 0,
                                )}
                              </div>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => onViewVendorDetail(vendor)}
                          >
                            View Full Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="details">
                <ScrollArea className="h-[500px]">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Feature</TableHead>
                          {selectedVendors.map((vendor) => (
                            <TableHead key={vendor.id}>{vendor.name}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            Category
                          </TableCell>
                          {selectedVendors.map((vendor) => (
                            <TableCell key={vendor.id}>
                              <Badge variant="outline">
                                {getCategoryDisplay(vendor.category)}
                              </Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Status</TableCell>
                          {selectedVendors.map((vendor) => (
                            <TableCell key={vendor.id}>
                              <VendorStatusBadge
                                status={vendor.status}
                                size="sm"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Contact Person
                          </TableCell>
                          {selectedVendors.map((vendor) => (
                            <TableCell key={vendor.id}>
                              {vendor.contact_name || "Not specified"}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Email</TableCell>
                          {selectedVendors.map((vendor) => (
                            <TableCell key={vendor.id}>
                              {vendor.email ? (
                                <a
                                  href={`mailto:${vendor.email}`}
                                  className="text-primary hover:underline flex items-center"
                                >
                                  <Mail className="h-3 w-3 mr-1" />
                                  {vendor.email}
                                </a>
                              ) : (
                                "Not provided"
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Phone</TableCell>
                          {selectedVendors.map((vendor) => (
                            <TableCell key={vendor.id}>
                              {vendor.phone || "Not provided"}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Website</TableCell>
                          {selectedVendors.map((vendor) => (
                            <TableCell key={vendor.id}>
                              {vendor.website ? (
                                <a
                                  href={vendor.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Visit
                                </a>
                              ) : (
                                "Not provided"
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Address</TableCell>
                          {selectedVendors.map((vendor) => (
                            <TableCell key={vendor.id}>
                              {vendor.address || "Not provided"}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Notes</TableCell>
                          {selectedVendors.map((vendor) => (
                            <TableCell
                              key={vendor.id}
                              className="max-w-[300px] whitespace-normal"
                            >
                              {vendor.notes || "No notes"}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="expenses">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">
                          Expense Category
                        </TableHead>
                        {selectedVendors.map((vendor) => (
                          <TableHead key={vendor.id}>{vendor.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          Total Expenses
                        </TableCell>
                        {selectedVendors.map((vendor) => (
                          <TableCell key={vendor.id} className="font-bold">
                            {expenseSummaries[vendor.id]
                              ? formatCurrency(
                                  expenseSummaries[vendor.id].total || 0,
                                )
                              : "Loading..."}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Paid Expenses
                        </TableCell>
                        {selectedVendors.map((vendor) => (
                          <TableCell
                            key={vendor.id}
                            className="text-green-600 dark:text-green-500"
                          >
                            {expenseSummaries[vendor.id]
                              ? formatCurrency(
                                  expenseSummaries[vendor.id].paid || 0,
                                )
                              : "Loading..."}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Pending Expenses
                        </TableCell>
                        {selectedVendors.map((vendor) => (
                          <TableCell
                            key={vendor.id}
                            className="text-amber-600 dark:text-amber-500"
                          >
                            {expenseSummaries[vendor.id]
                              ? formatCurrency(
                                  expenseSummaries[vendor.id].pending || 0,
                                )
                              : "Loading..."}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Expense Comparison
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedVendors.map((vendor) => (
                      <Card key={vendor.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            {vendor.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {expenseSummaries[vendor.id] ? (
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Total:</span>
                                <span className="font-bold">
                                  {formatCurrency(
                                    expenseSummaries[vendor.id].total || 0,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Paid:</span>
                                <span className="text-green-600 dark:text-green-500">
                                  {formatCurrency(
                                    expenseSummaries[vendor.id].paid || 0,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Pending:</span>
                                <span className="text-amber-600 dark:text-amber-500">
                                  {formatCurrency(
                                    expenseSummaries[vendor.id].pending || 0,
                                  )}
                                </span>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between">
                                <span>Remaining:</span>
                                <span className="font-bold">
                                  {formatCurrency(
                                    (expenseSummaries[vendor.id].total || 0) -
                                      (expenseSummaries[vendor.id].paid || 0),
                                  )}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorComparisonTool;
