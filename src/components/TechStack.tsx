import { Database, Cloud, GitBranch } from "lucide-react";

const techs = [
  { name: "Supabase", icon: Database },
  { name: "Cloudflare", icon: Cloud },
  { name: "n8n", icon: GitBranch },
];

const TechStack = () => {
  return (
    <section className="py-24 px-6 border-t border-border/50">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Powered by
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap">
          {techs.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.name} className="flex items-center gap-2 text-muted-foreground">
                <Icon className="w-5 h-5" />
                <span className="text-base font-medium">{t.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
