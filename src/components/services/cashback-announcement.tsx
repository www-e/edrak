import { Card, CardContent } from "@/components/ui/card";
import { Gift } from "lucide-react";

export default function CashbackAnnouncement() {
  return (
    <section className="py-12 lg:py-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
      <div className="container mx-auto px-4">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="p-6 bg-white rounded-full shadow-lg">
              <Gift className="w-12 h-12 text-orange-500" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Earn Credits with Every Course Purchase!
              </h2>
              <p className="text-lg text-gray-700">
                For every course you buy, you will get credits back in your account. Use these credits to purchase more courses and continue your learning journey with us.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
