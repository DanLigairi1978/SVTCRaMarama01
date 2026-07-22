import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { corePrograms, strategicPriorities, donorProjects } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ListChecks, Target, Handshake } from "lucide-react";

export default function WorkPage() {
  const workHeaderImage = PlaceHolderImages.find(p => p.id === 'work-header');

  return (
    <div className="bg-background">
      <PageHeader
        image={workHeaderImage}
        eyebrow="Our Work"
        title="Craft, Income &amp; Knowledge"
        description="Discover our strategic approach to empowering women and uplifting communities across Cakaudrove."
      />

      <main className="container mx-auto px-4 py-16 md:py-24">
        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="justify-center w-full">
            <TabsTrigger value="programs">
              <Target className="w-4 h-4 mr-2" /> Core Programs
            </TabsTrigger>
            <TabsTrigger value="strategy">
              <ListChecks className="w-4 h-4 mr-2" /> Strategic Plan
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Handshake className="w-4 h-4 mr-2" /> Donor Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="mt-12">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight">Our Core Programs</h2>
              <p className="font-body text-muted-foreground mt-2">The pillars of our day-to-day activities and long-term impact.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {corePrograms.map((program) => {
                const Icon = program.icon;
                return (
                  <Card key={program.id} className="text-center">
                    <CardHeader className="items-center">
                      <div className="p-4 bg-primary text-primary-foreground rounded-full">
                        <Icon className="w-7 h-7" />
                      </div>
                      <CardTitle className="mt-4 text-xl">{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-body text-muted-foreground">{program.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="mt-12">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight">Our 5 Strategic Priorities</h2>
              <p className="font-body text-muted-foreground mt-2">Guiding our efforts from 2024 to 2029 to ensure focused, sustainable growth.</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-5">
              {strategicPriorities.map((priority, index) => (
                <Card key={priority.id}>
                  <CardContent className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 font-headline text-3xl font-bold text-primary">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-semibold text-foreground">{priority.title}</h3>
                      <p className="font-body text-muted-foreground mt-1">{priority.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-12">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight">Current Donor-Funded Projects</h2>
              <p className="font-body text-muted-foreground mt-2">Key initiatives made possible by the generous support of our partners.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {donorProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <p className="font-label text-xs font-semibold uppercase tracking-wide text-accent pt-1">Partner: {project.partner}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="font-body text-muted-foreground">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
