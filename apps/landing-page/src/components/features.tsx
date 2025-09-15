import { Shield, Zap, Lock, Award, FileCheck, Globe } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Military-Grade Security",
    description: "Uses DoD 5220.22-M and NIST 800-88 standards to ensure complete data destruction."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized algorithms provide rapid erasure without compromising security standards."
  },
  {
    icon: Lock,
    title: "Multiple Pass Options",
    description: "Choose from 1-pass to 35-pass erasure methods based on your security requirements."
  },
  {
    icon: Award,
    title: "Certified Compliance",
    description: "Meets government and enterprise security standards with detailed audit reports."
  },
  {
    icon: FileCheck,
    title: "Verification Reports",
    description: "Generate comprehensive reports proving successful data destruction for compliance."
  },
  {
    icon: Globe,
    title: "Cross-Platform",
    description: "Available for Windows, Linux, Android, and as a bootable ISO for any system."
  }
];

const Features = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose <span className="gradient-text-primary">SecureWipe</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced features designed for both personal and enterprise data security needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="bg-card p-6 rounded-xl border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="gradient-primary p-3 rounded-lg w-fit mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;