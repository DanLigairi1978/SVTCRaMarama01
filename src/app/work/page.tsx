import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { corePrograms, strategicPriorities, donorProjects } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ListChecks, Target, Handshake } from "lucide-react";

export default function WorkPage() {
  const workHeaderImage = PlaceHolderImages.find(p => p.id === 'work-header');

  return (
    <div className="bg-background">
      <header className="relative h-[50vh] flex items-center justify-center text-center text-white">
        {workHeaderImage && (
          <Image
            src={workHeaderImage.imageUrl}
            alt={workHeaderImage.description}
            fill
            className="object-cover object-[center_20%] brightness-50"
            priority
            data-ai-hint={workHeaderImage.imageHint}
          />
        )}
        <div className="relative z-10 p-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Our Work</h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Discover our strategic approach to empowering women and uplifting communities across Cakaudrove.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto h-auto">
            <TabsTrigger value="programs" className="py-2.5">
              <Target className="w-4 h-4 mr-2" /> Core Programs
            </TabsTrigger>
            <TabsTrigger value="strategy" className="py-2.5">
              <ListChecks className="w-4 h-4 mr-2" /> Strategic Plan
            </TabsTrigger>
            <TabsTrigger value="projects" className="py-2.5">
              <Handshake className="w-4 h-4 mr-2" /> Donor Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="mt-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Our Core Programs</h2>
              <p className="text-muted-foreground mt-2">The pillars of our day-to-day activities and long-term impact.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {corePrograms.map((program) => {
                const Icon = program.icon;
                return (
                  <Card key={program.id} className="text-center shadow-lg hover:shadow-primary/20 transition-shadow">
                    <CardHeader className="items-center">
                      <div className="p-4 bg-primary text-primary-foreground rounded-full">
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="mt-4 text-xl">{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{program.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="mt-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Our 5 Strategic Priorities</h2>
              <p className="text-muted-foreground mt-2">Guiding our efforts from 2024 to 2029 to ensure focused, sustainable growth.</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
              {strategicPriorities.map((priority, index) => (
                <Card key={priority.id} className="shadow-md">
                  <CardContent className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 text-3xl font-bold text-primary">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-headline font-semibold text-foreground">{priority.title}</h3>
                      <p className="text-muted-foreground mt-1">{priority.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Current Donor-Funded Projects</h2>
              <p className="text-muted-foreground mt-2">Key initiatives made possible by the generous support of our partners.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {donorProjects.map((project) => (
                <Card key={project.id} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <p className="text-sm font-semibold text-accent pt-1">Partner: {project.partner}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{project.description}</p>
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
