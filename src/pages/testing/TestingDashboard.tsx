import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestAppFunctionality from "@/components/testing/TestAppFunctionality";
import ResponsiveDesignTester from "@/components/testing/ResponsiveDesignTester";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Upload, 
  Github, 
  Globe 
} from "lucide-react";

const TestingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("functionality");
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [githubStatus, setGithubStatus] = useState<'idle' | 'pushing' | 'success' | 'error'>('idle');

  const handleDeployToVercel = async () => {
    setDeploymentStatus('deploying');
    
    // Simulate deployment process
    setTimeout(() => {
      // In a real implementation, this would be an actual deployment to Vercel
      setDeploymentStatus('success');
    }, 3000);
  };

  const handlePushToGithub = async () => {
    setGithubStatus('pushing');
    
    // Simulate GitHub push process
    setTimeout(() => {
      // In a real implementation, this would be an actual push to GitHub
      setGithubStatus('success');
    }, 3000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Test- und Deployment-Dashboard</h1>
        <p className="text-muted-foreground">
          Teste und deploye die LemonVows Hochzeitsplanungs-App
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="functionality">Funktionalität</TabsTrigger>
          <TabsTrigger value="responsive">Responsives Design</TabsTrigger>
        </TabsList>
        
        <TabsContent value="functionality" className="mt-6">
          <TestAppFunctionality />
        </TabsContent>
        
        <TabsContent value="responsive" className="mt-6">
          <ResponsiveDesignTester />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Dokumentation
            </CardTitle>
            <CardDescription>
              Dokumentation der neuen Funktionen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Die Dokumentation für die neuen Funktionen (JGA-Planungsmodul und Hochzeitshomepage) wurde erstellt und ist im Repository verfügbar.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href="/docs/DOKUMENTATION.md" target="_blank">Dokumentation ansehen</a>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Vercel Deployment
            </CardTitle>
            <CardDescription>
              Deployment auf Vercel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {deploymentStatus === 'idle' && (
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              )}
              {deploymentStatus === 'deploying' && (
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
              )}
              {deploymentStatus === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {deploymentStatus === 'error' && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <span>
                {deploymentStatus === 'idle' && 'Bereit zum Deployment'}
                {deploymentStatus === 'deploying' && 'Deployment läuft...'}
                {deploymentStatus === 'success' && 'Deployment erfolgreich'}
                {deploymentStatus === 'error' && 'Deployment fehlgeschlagen'}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleDeployToVercel}
              disabled={deploymentStatus === 'deploying'}
            >
              {deploymentStatus === 'deploying' ? 'Wird deployed...' : 'Auf Vercel deployen'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Github className="mr-2 h-5 w-5" />
              GitHub Repository
            </CardTitle>
            <CardDescription>
              Änderungen ins GitHub-Repository pushen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {githubStatus === 'idle' && (
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              )}
              {githubStatus === 'pushing' && (
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
              )}
              {githubStatus === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {githubStatus === 'error' && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <span>
                {githubStatus === 'idle' && 'Bereit zum Pushen'}
                {githubStatus === 'pushing' && 'Push läuft...'}
                {githubStatus === 'success' && 'Push erfolgreich'}
                {githubStatus === 'error' && 'Push fehlgeschlagen'}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handlePushToGithub}
              disabled={githubStatus === 'pushing'}
            >
              {githubStatus === 'pushing' ? 'Wird gepusht...' : 'Auf GitHub pushen'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {(deploymentStatus === 'success' || githubStatus === 'success') && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Erfolgreiche Aktionen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {deploymentStatus === 'success' && (
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <p>Die App wurde erfolgreich auf Vercel deployed.</p>
                </div>
              )}
              {githubStatus === 'success' && (
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <p>Die Änderungen wurden erfolgreich ins GitHub-Repository gepusht.</p>
                </div>
              )}
            </div>
          </CardContent>
          {deploymentStatus === 'success' && (
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a 
                  href="https://hochzeitsapp-really.vercel.app" 
                  target="_blank"
                  className="flex items-center justify-center"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Deployed App öffnen
                </a>
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};

export default TestingDashboard;
