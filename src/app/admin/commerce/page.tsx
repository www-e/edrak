import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/shared/page-header";
import { MetricCard } from "@/components/admin/shared/metric-card";
import { 
  CreditCard, 
  Ticket, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";

export default function CommercePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Commerce"
        description="Manage payments, coupons, and financial metrics"
      />
      
      {/* Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value="EGP 45,231.00"
          description="+12% from last month"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Pending Payments"
          value="EGP 1,234.00"
          description="+3% from last month"
          icon={<CreditCard className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Active Coupons"
          value="24"
          description="3 expiring soon"
          icon={<Ticket className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Conversion Rate"
          value="4.2%"
          description="-0.5% from last month"
          icon={<TrendingDown className="h-4 w-4" />}
        />
      </div>
      
      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Payment #{1000 + item}</p>
                    <p className="text-sm text-muted-foreground">User {item} - Course {item}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">EGP {(item * 299.99).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Active Coupons */}
      <Card>
        <CardHeader>
          <CardTitle>Active Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <Ticket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">COUPON{100 + item}</p>
                    <p className="text-sm text-muted-foreground">20% off - 50 uses left</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">20% OFF</p>
                  <p className="text-sm text-muted-foreground">Expires 2023-12-31</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}