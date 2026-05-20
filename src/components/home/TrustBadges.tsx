import { Shield, Truck, Undo2, Headphones } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "Secure Payment",
    desc: "SSL encrypted, multiple payment options",
  },
  {
    icon: Truck,
    title: "Global Shipping",
    desc: "Tracked delivery to 200+ countries",
  },
  {
    icon: Undo2,
    title: "30-Day Returns",
    desc: "Easy and free returns worldwide",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    desc: "24/7 multilingual customer service",
  },
];

export function TrustBadges() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-bold text-center mb-10 text-[#1a1a2e]">
          Why Choose Us
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1a1a2e]/5 mb-4">
                  <Icon className="h-6 w-6 text-[#c9a96e]" />
                </div>
                <h3 className="font-semibold text-[#1a1a2e]">{badge.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
