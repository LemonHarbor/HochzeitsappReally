import React from "react";
import VerificationBadge from "@/components/vendor/VerificationBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VerificationBadgeDemo = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Review Verification Badges</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Verification Badge Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Standard Size</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <VerificationBadge type="booking" />
                  <span className="text-sm text-muted-foreground">
                    For users who booked the vendor
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <VerificationBadge type="contract" />
                  <span className="text-sm text-muted-foreground">
                    For users with a contract
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <VerificationBadge type="purchase" />
                  <span className="text-sm text-muted-foreground">
                    For verified purchases
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <VerificationBadge type="admin" />
                  <span className="text-sm text-muted-foreground">
                    Admin-verified reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Size Variations</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <VerificationBadge type="booking" size="sm" />
                  <span className="text-sm text-muted-foreground">
                    Small size
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <VerificationBadge type="booking" size="md" />
                  <span className="text-sm text-muted-foreground">
                    Medium size (default)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <VerificationBadge type="booking" size="lg" />
                  <span className="text-sm text-muted-foreground">
                    Large size
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <VerificationBadge
                    type="booking"
                    size="sm"
                    showLabel={false}
                  />
                  <span className="text-sm text-muted-foreground">
                    Icon only (no label)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage in Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="font-medium">JD</span>
                </div>
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-muted-foreground">
                    2 days ago
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <VerificationBadge type="contract" size="sm" />
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`h-4 w-4 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p>
                This vendor was amazing! They provided excellent service and
                were very professional. I would highly recommend them to anyone
                planning a wedding.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationBadgeDemo;
